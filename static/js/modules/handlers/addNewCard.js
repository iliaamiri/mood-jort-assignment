import {isValidUrL} from "../core/utils.js";
import {History} from "../classes/History.js";
import {NormalCard} from "../classes/Cards.js"


export default () => {
    const newPictureUrl = document.getElementById('newPicUrl').value;
    if (!isValidUrL(newPictureUrl)) {
        // debug
        console.log(newPictureUrl)
        return
    }

    let newCard = new NormalCard(null, newPictureUrl, 5);
    History.pushToStack("AddCard", newCard)
}