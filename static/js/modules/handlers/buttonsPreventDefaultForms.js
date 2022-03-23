export default (target, event) => {
    let closestForm = target.closest("form");

    if (closestForm && closestForm.classList.includes("formNoDefault")) {
        event.preventDefault();
    }
}