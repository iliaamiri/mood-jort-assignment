export function isValidUrL(string) {
    let a = document.createElement("a");
    a.href = string;
    return (a.host && a.host !== window.location.host);
}

export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}