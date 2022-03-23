export default (target, event) => {
    let cardElement = target.closest('div.card')
    if (!cardElement.classList.includes("editCard")) {
        document.querySelectorAll('div.card.editCard').forEach(elementInEditingMode => {
            elementInEditingMode.classList.remove('editCard');
            elementInEditingMode.querySelector('.modifyDiv').classList.add('displayNone');
        })

        cardElement.classList.add('editCard');
        cardElement.querySelector('.modifyDiv').classList.remove('displayNone');
    } else if (target.tagName === "IMG") {
        cardElement.classList.remove('editCard');
        cardElement.querySelector('.modifyDiv').classList.add('displayNone');
    }
}