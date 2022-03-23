import {History} from "../classes/History.js";

export default (target, card) => {
    let magnifierValue = (target.closest("span").classList.value.includes("zoomIn")) ? "+" : "-";

    if (magnifierValue === "+") {
        History.pushToStack('ZoomCard', card, "'ZoomIn'")
        card.zoomIn();
    } else {
        History.pushToStack('ZoomCard', card, "'ZoomOut'")
        card.zoomOut();
    }
}