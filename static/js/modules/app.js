import init from "./init.js";

init();

import {randomIntFromInterval} from "./core/utils.js";
import buttonsPreventDefaultFormsHandler from "./handlers/buttonsPreventDefaultForms.js";
import cardClickHandler from "./handlers/cardClick.js";
import cardMagnifyHandler from "./handlers/cardMagnify.js";
import addNewCardHandler from "./handlers/addNewCard.js";
import normalCardMoveHandler from "./handlers/normalCardMove.js";
import dragAbsoluteCardHandler from "./handlers/dragAbsoluteCard.js";

import {LocalStorage} from './classes/LocalStorage.js';
import {AbsoluteCard, NormalCard, Card} from "./classes/Cards.js";
import {History} from './classes/History.js';

new LocalStorage()

document.querySelector("body").addEventListener('click', event => {
    let target = event.target;

    if (target.tagName === "BUTTON") {
        buttonsPreventDefaultFormsHandler(target, event);
    }

    const cardElement = target.closest("div.card");

    if (target.closest("div.card")) { // any card
        const anyCard = Card.allCards[cardElement.id]
        console.log(anyCard)

        cardClickHandler(target, event);

        if (target.closest("div.magnifyDiv") && (target.tagName === "SPAN" || target.tagName === "I")) {
            cardMagnifyHandler(target, anyCard);
        }

        if (target.closest("span.deleteButton") && (target.tagName === "SPAN" || target.tagName === "I")) {
            History.pushToStack('DeleteCard', anyCard)
            anyCard.destroy();
        }
    }

    if (target.closest("div.card:not(.absoluteCard)")) { // only a normal card
        const normalCard = Card.allCards[cardElement.id];

        if (target.closest("div.moveDiv") && (target.tagName === "SPAN" || target.tagName === "I")) {
            normalCardMoveHandler(target, normalCard);
        }

        let toAbsoluteButton = target.closest("span.makeItAbsoluteButton");
        if (toAbsoluteButton && (target.tagName === "SPAN" || target.tagName === "I")) {
            History.pushToStack("ConvertToAbsolute", normalCard)
            normalCard.toAbsoluteCard();
        }
    }

    if (target.closest("div.card.absoluteCard")) { // only an absolute card
        const absoluteCard = Card.allCards[cardElement.id];

        let toNormalButton = target.closest("span.makeItNormalButton");
        if (toNormalButton && (target.tagName === "SPAN" || target.tagName === "I")) {
            History.pushToStack("ConvertToNormal", absoluteCard)
            absoluteCard.toNormalCard();
        }


    }
})


document.querySelector('main').addEventListener('drag', event => dragAbsoluteCardHandler(event))
document.querySelector('main').addEventListener('dragend', event => dragAbsoluteCardHandler(event))

const anyCardBindings = {
    'Delete': Card.prototype.destroy,
    'ArrowUp': Card.prototype.zoomIn,
    'ArrowDown': Card.prototype.zoomOut
}

const normalCardBindings = {
    'ArrowRight': NormalCard.prototype.moveToRight,
    'ArrowLeft': NormalCard.prototype.moveToLeft
}

const absoluteCardBindings = {
    ']': AbsoluteCard.prototype.bringFront,
    '[': AbsoluteCard.prototype.bringBack,
    'w': AbsoluteCard.prototype.moveUp,
    'a': AbsoluteCard.prototype.moveLeft,
    's': AbsoluteCard.prototype.moveDown,
    'd': AbsoluteCard.prototype.moveRight,
}

let cardHistoryIntervalIDs = [];

document.addEventListener('keydown', (event) => {
    const key = event.key;
    const keyCode = event.keyCode;

    const editingCard = document.querySelector('div.card.editCard');
    if (editingCard) {
        const card = Card.allCards[editingCard.id]

        if (anyCardBindings[key]) {
            if (key === 'Delete') {
                History.pushToStack("DeleteCard", card)
            }
            const oldSize = card.size;
            cardHistoryIntervalIDs.push(setInterval(function () {
                if (oldSize !== card.size) {
                    let zoomType = (oldSize < card.size) ? "'ZoomIn'" : "ZoomOut'"
                    History.pushToStack("ZoomCard", card, zoomType)
                }

                cardHistoryIntervalIDs.map(id => clearInterval(id))
                cardHistoryIntervalIDs = []
            }, 200));

            eval('card.' + anyCardBindings[key].name + '()');
        } else if (absoluteCardBindings[key] && card.constructor.name === "AbsoluteCard") {
            const oldCardData = {
                zIndex: card.zIndex,
                positioning: {
                    top: Number(card.positioning.top),
                    left: Number(card.positioning.left)
                }
            };
            cardHistoryIntervalIDs.push(setInterval(function () {
                if (oldCardData.zIndex !== card.zIndex) {
                    History.pushToStack("ChangeZIndex", card, oldCardData.zIndex)
                }
                if (oldCardData.positioning.left !== card.positioning.left ||
                    oldCardData.positioning.top !== card.positioning.top) {
                    History.pushToStack("MoveAbsoluteCard", card, oldCardData.positioning.left, oldCardData.positioning.top)
                }

                cardHistoryIntervalIDs.map(id => clearInterval(id))
                cardHistoryIntervalIDs = []
            }, 1000));
            eval('card.' + absoluteCardBindings[key].name + '()');
            //console.log(card)
        } else if (normalCardBindings[key] && card.constructor.name === "NormalCard") {
            const oldOrderInDOM = card.orderInDOM;
            cardHistoryIntervalIDs.push(setInterval(function () {
                if (oldOrderInDOM !== card.orderInDOM) {
                    let direction = (key === "ArrowLeft") ? "Left" : "Right";
                    History.pushToStack('MoveNormalCard', card, `'${direction}'`)
                }

                cardHistoryIntervalIDs.map(id => clearInterval(id))
                cardHistoryIntervalIDs = []
            }, 100));

            eval('card.' + normalCardBindings[key].name + '()');
        }
    }
console.log("STACK HERE", History.historyStack)
console.log("HEAD HERE", History.head)
    if (History.historyStack.length > 0) {
        let currentHeadHistory = History.historyStack[History.head]
        let action, card, args;
        if (currentHeadHistory !== undefined) {
            action = currentHeadHistory.action;
            card = currentHeadHistory.card;
            args = currentHeadHistory.args;
        }
        if (event.ctrlKey && keyCode === 90 && event.shiftKey) { // ctrl + shift + z (redo)
            console.log("redo")

            if (!History.redoFulfilled) {
                if (History.undoFulfilled && History.head === 0 && History.historyStack.length === 1) {
                    History.redoFulfilled = true;
                }
                if (History.head >= History.historyStack.length - 1) {
                    History.redoFulfilled = true;
                    //return;
                }

                History.undoFulfilled = false;

                let history = new History(card);
                eval(`history.redo${action}(${args.join(", ")})`);
                history.postRedo();
            }
        } else if (event.ctrlKey && keyCode === 90) { // ctrl + z (undo)
            console.log("undo")

            if (!History.undoFulfilled) {
                if (History.redoFulfilled && History.head >= History.historyStack.length) {
                    History.head--
                    currentHeadHistory = History.historyStack[History.head]
                    action = currentHeadHistory.action;
                    card = currentHeadHistory.card;
                    args = currentHeadHistory.args;
                }
                if (History.head === 0) {
                    History.undoFulfilled = true;
                }

                History.redoFulfilled = false;

                let history = new History(card);
                eval(`history.revert${action}(${args.join(", ")})`);
                history.postUndo();
            }
        }
    }
})

// seeding
function seed() {
    for (let i = 0; i < 10; i++) {
        new NormalCard(null, `https://picsum.photos/${randomIntFromInterval(1, 3) * 100}/${randomIntFromInterval(2, 4) * 100}?random=20`, randomIntFromInterval(2, 9))
    }
}

//seed();

// opening and closing the New Image Form dialog
document.querySelector("button.buttonAddImage").addEventListener('click', () => document.querySelector("form.newPicture").show())
document.querySelector("button.buttonCancelAdd").addEventListener('click', () => document.querySelector("form.newPicture").hide())

// approving a new image
document.querySelector("button.buttonApproveAdd").addEventListener('click', () => addNewCardHandler())