import {AbsoluteCard, NormalCard, Card} from "./Cards.js";

export class History {
    #card
    static #historyStack = []
    static #head = 0
    static undoFulfilled = true;
    static redoFulfilled = true;

    constructor(theCard) {
        this.#card = theCard

        // debug
        console.log(History.historyStack)
        console.log("Head", History.head)
    }

    static pushToStack(action, card, ...args) {
        if (History.#historyStack.length > 100) {
            History.#historyStack.shift();
        }

        History.#historyStack = History.#historyStack.slice(0, History.#head + 1);

        History.#historyStack.push({
            action: action,
            card: {
                id: card.id,
                size: card.size,
                imgUrl: card.imageUrl,
                orderInDOM: (card.orderInDOM !== undefined) ? card.orderInDOM : -1,
                isAbsolute: card.constructor.name === "AbsoluteCard",
                absoluteProps: {
                    positioning: card.positioning || {
                        left: window.innerWidth / 2,
                        right: window.innerHeight / 2
                    },
                    zIndex: card.zIndex || 1
                }
            },
            args: [...args]
        })

        if (History.#historyStack.length < 1) {
            History.#head = History.#historyStack.length;
        } else {
            History.#head = History.#historyStack.length - 1;
        }

        History.undoFulfilled = false;

        console.log(History.historyStack)
        console.log("Head", History.head)
    }

    static get historyStack() { return this.#historyStack; }

    static get head() { return this.#head; }
    static set head(head) { this.#head = head; }

    postRedo() {
        if (History.#head < History.#historyStack.length)
            History.#head++;
    }

    postUndo() {
        if (History.#head > 0)
            History.#head--;
    }

    // Deletes a card
    revertDeleteCard() {
        let cardInstance;
        if (this.#card.isAbsolute) {
            cardInstance = new AbsoluteCard(this.#card.id, this.#card.imgUrl, this.#card.size);
            cardInstance.positioning = this.#card.absoluteProps.positioning;
            cardInstance.zIndex = this.#card.absoluteProps.zIndex;
        } else {
            cardInstance = new NormalCard(this.#card.id, this.#card.imgUrl, this.#card.size);
            cardInstance.getNormalCardsInDOM()[this.#card.orderInDOM].before(cardInstance.element);
            cardInstance.resyncAll();
        }
    }

    redoDeleteCard() {
        Card.allCards[this.#card.id].destroy();
    }

    // Adds a card
    revertAddCard() {
        this.redoDeleteCard();
    }

    redoAddCard() {
        this.revertDeleteCard();
    }

    // Moves a normal card
    revertMoveNormalCard(direction) {
        if (direction === "Left") {
            Card.allCards[this.#card.id].moveToRight();
        } else {
            Card.allCards[this.#card.id].moveToLeft();
        }
    }

    redoMoveNormalCard(direction) {
        if (direction === "Left") {
            Card.allCards[this.#card.id].moveToLeft();
        } else {
            Card.allCards[this.#card.id].moveToRight();
        }
    }

    // Moves an absolute card
    revertMoveAbsoluteCard(oldLeft, oldTop) {
        Card.allCards[this.#card.id].positioning = {
            left: oldLeft,
            top: oldTop
        };
    }

    redoMoveAbsoluteCard() {
        Card.allCards[this.#card.id] = this.#card.absoluteProps.positioning;
    }

    // Changes z-index of an absolute card
    revertChangeZIndex(oldZIndex) {
        Card.allCards[this.#card.id].zIndex = oldZIndex;
    }

    redoChangeZIndex() {
        Card.allCards[this.#card.id].zIndex = this.#card.absoluteProps.positioning;
    }

    // Zooms in/out a card
    revertZoomCard(zoomType) {
        if (zoomType === "ZoomIn") {
            Card.allCards[this.#card.id].zoomOut();
        } else {
            Card.allCards[this.#card.id].zoomIn();
        }
    }

    redoZoomCard(zoomType) {
        if (zoomType === "ZoomIn") {
            Card.allCards[this.#card.id].zoomIn();
        } else {
            Card.allCards[this.#card.id].zoomOut();
        }
    }

    // Converts a card to Absolute
    revertConvertToAbsolute() {
        Card.allCards[this.#card.id].toNormalCard();
    }

    redoConvertToAbsolute() {
        Card.allCards[this.#card.id].toAbsoluteCard();
    }

    // Converts a card to Normal
    revertConvertToNormal() {
        this.redoConvertToAbsolute();
    }

    redoConvertToNormal() {
        this.revertConvertToAbsolute();
    }


}