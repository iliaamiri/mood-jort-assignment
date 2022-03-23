import {AbsoluteCard, NormalCard} from "./Cards.js";

export class LocalStorage {
    static storage = window.localStorage
    static #cardsKeyName = "Cards"

    constructor() {
        let allCards = LocalStorage.getAllCards();

        if (allCards.length < 1) {
            LocalStorage.storage.setItem(LocalStorage.#cardsKeyName, "[]")
        } else {
            allCards.map(card => {
                let cardInstance;
                if (card.isAbsolute) {
                    cardInstance = new AbsoluteCard(card.id, card.imgUrl, card.size)
                    cardInstance.positioning = card.absoluteProps.positioning;
                    cardInstance.zIndex = card.absoluteProps.zIndex;
                } else {
                    cardInstance = new NormalCard(card.id, card.imgUrl, card.size)
                }
            })
        }
    }

    static addCard(cardObject) {
        let cards = this.getAllCards();
        cards.push(cardObject);

        this.syncCardsWithLocalStorage(cards)
    }

    static updateCard(latestCardInstance) {
        let cards = this.getAllCards();
        let updatingCard = this.getCardById(latestCardInstance.id);

        if (!updatingCard) {
            return;
        }

        updatingCard.size = latestCardInstance.size;
        updatingCard.isAbsolute = latestCardInstance.constructor.name === "AbsoluteCard";

        if (updatingCard.isAbsolute) {
            updatingCard.absoluteProps = {};
            updatingCard.absoluteProps.positioning = latestCardInstance.positioning;
            updatingCard.absoluteProps.zIndex = latestCardInstance.zIndex;
        } else {
            updatingCard.orderInDOM = latestCardInstance.orderInDOM;
        }

        cards = cards.map(card => {
            if (Number(card.id) === Number(latestCardInstance.id)) {
                return updatingCard;
            }

            return card;
        })

        this.syncCardsWithLocalStorage(cards)
    }

    static getCardById(cardId) {
        return this.getAllCards().find(card => Number(card.id) === Number(cardId)) || null
    }

    static removeCard(cardId) {
        let cards = this.getAllCards();
        cards = cards.filter(card => Number(card.id) !== Number(cardId))

        this.syncCardsWithLocalStorage(cards)
    }

    static syncCardsWithLocalStorage(allCards) {
        this.storage.setItem(this.#cardsKeyName, JSON.stringify(allCards))
    }

    static getAllCards() {
        let allCards = JSON.parse(this.storage.getItem(this.#cardsKeyName));
        if (!allCards) {
            return [];
        }

        allCards.sort((card1, card2) => {
            if (!card1.hasOwnProperty('orderInDOM'))
                card1.orderInDOM = -1;
            if (!card2.hasOwnProperty('orderInDOM'))
                card2.orderInDOM = -1;

            return card1.orderInDOM - card2.orderInDOM;
        })

        return allCards;
    }
}