import {Card} from "../classes/Cards.js";
import {History} from "../classes/History.js";

let absoluteCardHistoryIntervalIDs = [];

export default (event) => {
    let target = event.target;
    event.preventDefault()

    const cardElement = target.closest("div.card");

    if (target.closest("div.card.absoluteCard")) { // only an absolute card
        const absoluteCard = Card.allCards[cardElement.id];

        const oldCardData = {
            positioning: {
                top: Number(absoluteCard.positioning.top),
                left: Number(absoluteCard.positioning.left)
            }
        };

        absoluteCardHistoryIntervalIDs.push(setInterval(function () {
            if (oldCardData.positioning.left !== absoluteCard.positioning.left ||
                oldCardData.positioning.top !== absoluteCard.positioning.top) {
                History.pushToStack("MoveAbsoluteCard", absoluteCard, oldCardData.positioning.left, oldCardData.positioning.top)
            }

            absoluteCardHistoryIntervalIDs.map(id => clearInterval(id))
            absoluteCardHistoryIntervalIDs = []
        }, 2000));

        absoluteCard.positioning = {
            'left': event.x,
            'top': event.y
        }
    }
}