import {History} from '../classes/History.js'

let cardHistoryIntervalIDs = [];

export default (target, card) => {
    let moveValue = (target.closest("span").classList.value.includes("moveToLeft")) ? "Left" : "Right";

    const oldOrderInDOM = card.orderInDOM;
    cardHistoryIntervalIDs.push(setInterval(function () {
        if (oldOrderInDOM !== card.orderInDOM) {
            History.pushToStack('MoveNormalCard', card, `'${moveValue}'`)
        }

        cardHistoryIntervalIDs.map(id => clearInterval(id))
        cardHistoryIntervalIDs = []
    }, 1500));

    if (moveValue === "Left") {
        card.moveToLeft()
    } else {
        card.moveToRight()
    }
}