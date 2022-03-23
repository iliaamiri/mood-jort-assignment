
import MakeItNormalIcon from "../components/Icons/MakeItNormalIcon.js";
import MakeItAbsoluteIcon from "../components/Icons/MakeItAbsoluteIcon.js";
import NormalMoves from "../components/ModifyDiv/NormalMoves.js";
import {History} from "./History.js";
import {LocalStorage} from "./LocalStorage.js";
import NormalModifyDiv from "../components/NormalModifyDiv.js";
import AbsoluteModifyDiv from "../components/AbsoluteModifyDiv.js";
import {randomIntFromInterval} from "../core/utils.js";

export class Card {
    #id
    #size
    #sizeMultiplier = 30
    #imageUrl
    #element

    #minMaxSizes = {
        min: 4,
        max: 9
    }

    constructor(cardId) {
        if (cardId !== null && document.getElementById(cardId)) { // instantiates an existing card from DOM
            this.element = document.getElementById(cardId);

            this.#id = this.#element.id;

            this.#imageUrl = this.#element.querySelector('img').src;
        }
    }

    createAndInitializeNewCardDOM(type = "Normal", pictureUrl, cardId) {
        this.element = document.createElement("div") // creating a new DOM element

        if (cardId !== null) { // the card exists in localStorage
            this.#id = cardId;
        } else {
            this.#id = randomIntFromInterval(10000, 99999).toString(); // generate a new id
        }

        this.#element.id = this.#id; // assign the id

        this.#imageUrl = pictureUrl; // set the image url

        let innerHTML = "Normal";
        switch (type) {
            case "Normal":
                innerHTML = NormalModifyDiv + `<img src="${pictureUrl}" alt="">`;
                break;
            case "Absolute":
                innerHTML = AbsoluteModifyDiv + `<img src="${pictureUrl}" alt="">`;
                break;
        }

        this.#element.innerHTML = innerHTML; // assign the image

        document.querySelector('main').appendChild(this.element) // append (Add to DOM)
    }

    localStorageInit(initiatingCard) {
        if (!Card.cards.hasOwnProperty(this.id)) {
            Card.cards[this.id] = this;
        }
        if (!LocalStorage.getCardById(this.id)) {
            LocalStorage.addCard(initiatingCard)
        }
    }

    destroy() {
        this.#element.remove()
        delete Card.allCards[this.#id]

        LocalStorage.removeCard(this);
    }

    get imageUrl() { return this.#imageUrl; }

    get id() { return this.#id; }
    set id(id) { this.#id = id; }

    zoomIn() {}
    zoomOut() {}

    get size() { return this.#size }
    set size(newSize) {
        if (this.minMaxSizes.min > +newSize)
            this.#size = this.minMaxSizes.min
        else if (this.minMaxSizes.max < +newSize)
            this.#size = this.minMaxSizes.max
        else
            this.#size = newSize

        this.element.className = this.element.className.split(" ").filter(className => !className.includes("size")).join(" ")
        this.element.classList.add(`size${this.#size}`);

        if (this.#size === newSize) { // if the size really changed
            LocalStorage.updateCard(this)
        }
    }

    get minMaxSizes() { return this.#minMaxSizes }

    get sizeMultiplier() { return this.#sizeMultiplier; }

    get element() { return this.#element; }

    set element(element) {
        if (element === null) {
            throw new Error("Element cannot be null")
        }
        this.#element = element;
    }

    static #cards = {}

    static get cards() { return Card.#cards; }

    static get allCards() { return Card.#cards; }
}

export class NormalCard extends Card {

    #orderInDOM

    constructor(cardId, pictureUrl, size) {
        super(cardId)

        if (document.getElementById(cardId)) { // instantiates an existing card from DOM
            let normalCardsInDOM = this.getNormalCardsInDOM();
            this.#orderInDOM = normalCardsInDOM.length; // set the order in DOM
            normalCardsInDOM[normalCardsInDOM.length - 1].after(this.element)
            this.resyncCardOrderInDOM();

            this.size = Number(this.element.classList.find(className => className.includes("size")).replace('size', ''));
        } else { // creates and initialize a new card
            super.createAndInitializeNewCardDOM("Normal", pictureUrl, cardId);

            this.element.classList.add('card'); // add the crucial classes

            this.size = size; // initialize the size

            this.#orderInDOM = this.getNormalCardsInDOM().length - 1; // set the order in DOM
        }

        this.localStorageInit({
            id: this.id,
            size: super.size,
            imgUrl: this.imageUrl,
            orderInDOM: this.#orderInDOM,
            isAbsolute: false
        });

        LocalStorage.updateCard(this)
        // console.log(Card.allCards)
        // console.log(LocalStorage.getAllCards())
    }

    moveToLeft() {
        if (this.element.previousElementSibling !== null &&
            !this.element.previousElementSibling.classList.includes("absoluteCard") &&
            this.element.previousElementSibling.classList.includes("card")) {
            let pairSiblingCard = Card.allCards[this.element.previousElementSibling.id]
            this.element.previousElementSibling.before(this.element)

            this.resyncCardOrderInDOM();
            if (pairSiblingCard && pairSiblingCard.constructor.name === "NormalCard")
                pairSiblingCard.resyncCardOrderInDOM(); // resync the pair sibling card
        }
    }

    moveToRight() {
        if (this.element.nextElementSibling !== null &&
            !this.element.nextElementSibling.classList.includes("absoluteCard") &&
            this.element.nextElementSibling.classList.includes("card")) {
            let pairSiblingCard = Card.allCards[this.element.nextElementSibling.id]
            this.element.nextElementSibling.after(this.element);

            this.resyncCardOrderInDOM(); // resync this card
            if (pairSiblingCard && pairSiblingCard.constructor.name === "NormalCard")
                pairSiblingCard.resyncCardOrderInDOM(); // resync the pair sibling card
        }
    }

    zoomIn() {
        this.size = super.size + 1;
        if (super.size + 1 === this.size) {
            History.pushToStack('ZoomCard', this, "In")
        }
    }

    zoomOut() {
        this.size = super.size - 1;
        if (super.size + 1 === this.size) {
            History.pushToStack('ZoomCard', this, "Out")
        }
    }

    getNormalCardsInDOM() {
        return Array.from(document.querySelectorAll('div.card:not(.absoluteCard)'))
    }

    resyncCardOrderInDOM() {
        this.#orderInDOM = this.getNormalCardsInDOM().indexOf(this.element);
        LocalStorage.updateCard(this)
    }

    resyncAll() {
        for (let normalCard of Object.values(Card.allCards).filter(card => card.constructor.name === "NormalCard")) {
            normalCard.resyncCardOrderInDOM()
        }
    }

    get orderInDOM() { return this.#orderInDOM; }

    get size() { return super.size; }
    set size(newSize) {
        super.size = newSize
    }

    destroy() {
        super.destroy();

        // resync the orders
        this.resyncAll();

        LocalStorage.removeCard(this.id);
    }
}

export class AbsoluteCard extends Card {

    #zIndex = 1

    #pixelMovingSensitivity = 10; // in Pixel

    #positioning = {
        left: 0,
        top: 0,
    }

    constructor(cardId, pictureUrl, size) {
        super(cardId)

        if (document.getElementById(cardId)) { // instantiates an existing card from DOM
            this.size = Number(this.element.classList.find(className => className.includes("size")).replace('size', ''));

            this.positioning = {
                left: (window.innerWidth / 2),
                top: (window.innerHeight / 2)
            }
        } else { // creates a new card
            super.createAndInitializeNewCardDOM("Absolute", pictureUrl, cardId);

            this.element.classList.add('card', 'absoluteCard'); // add the crucial classes

            this.element.setAttribute("draggable", "true") // make it draggable

            this.size = size; // initialize the size
        }

        this.localStorageInit({
            id: this.id,
            size: super.size,
            imgUrl: this.imageUrl,
            isAbsolute: true,
            absoluteProps: {
                positioning: this.#positioning,
                zIndex: this.#zIndex
            }
        });

        LocalStorage.updateCard(this);
    }

    zoomIn() { this.size = super.size + 1; }
    zoomOut() { this.size = super.size - 1; }

    bringFront() { this.zIndex = this.#zIndex + 1; }
    bringBack() { this.zIndex = this.#zIndex - 1; }

    moveUp() { this.positioning = { top: this.#positioning.top - this.#pixelMovingSensitivity, left: this.#positioning.left } }
    moveDown() { this.positioning = { top: this.#positioning.top + this.#pixelMovingSensitivity, left: this.#positioning.left } }
    moveLeft() { this.positioning = { top: this.#positioning.top, left: this.#positioning.left - this.#pixelMovingSensitivity } }
    moveRight() { this.positioning = { top: this.#positioning.top, left: this.#positioning.left + this.#pixelMovingSensitivity } }

    get size() { return super.size; }
    set size(newSize) {
        super.size = newSize;

        this.element.style.height = String(super.size * super.sizeMultiplier) + "px";
        this.element.style.width = String(super.size * super.sizeMultiplier) + "px";
    }

    get zIndex() { return this.#zIndex; }
    set zIndex(newZIndex) {
        this.#zIndex = newZIndex
        this.element.style.zIndex = newZIndex.toString()
    }

    get positioning() { return this.#positioning; }
    set positioning(position) {
        this.#positioning.left = position.left;
        this.#positioning.top = position.top;

        super.element.style.left = String(position.left - super.element.offsetWidth / 2) + "px";
        super.element.style.top = String(position.top - super.element.offsetHeight / 2) + "px";

        LocalStorage.updateCard(this);
    }

    toNormalCard() {
        this.element.classList.remove('absoluteCard'); // easier to identify in DOM
        this.element.removeAttribute("draggable") // make it not draggable

        this.element.style.height = '';
        this.element.style.width = '';
        this.element.style.left = '';
        this.element.style.top = '';

        let toNormalButton = this.element.querySelector("span.makeItNormalButton");
        toNormalButton.classList.remove('makeItNormalButton');
        toNormalButton.classList.add('makeItAbsoluteButton');
        toNormalButton.innerHTML = MakeItAbsoluteIcon;

        if (this.element.querySelector('div.moveDiv')) {
            this.element.querySelector('div.moveDiv').style.display = '';
        } else {
            let modifyDiv = this.element.querySelector('div.modifyDiv');
            modifyDiv.innerHTML = modifyDiv.innerHTML + NormalMoves;
        }

        return Card.allCards[this.id] = new NormalCard(this.element.id);
    }
}

NormalCard.prototype.toAbsoluteCard = function () {
    this.element.classList.add('absoluteCard'); // easier to identify in DOM
    this.element.setAttribute("draggable", "true") // make it draggable
    Card.allCards[this.id] = new AbsoluteCard(this.element.id);

    this.resyncAll(); // rearranging the order since this one is going to be absolute

    let toAbsoluteButton = this.element.querySelector('span.makeItAbsoluteButton')
    toAbsoluteButton.classList.remove('makeItAbsoluteButton');
    toAbsoluteButton.classList.add('makeItNormalButton');
    toAbsoluteButton.innerHTML = MakeItNormalIcon;

    if (this.element.querySelector('div.moveDiv')) {
        this.element.querySelector('div.moveDiv').style.display = 'none';
    }

    return Card.allCards[this.id];
}