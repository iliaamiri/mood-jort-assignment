export default () => {
    DOMTokenList.prototype.map = function (callback) {
        return Array.from(this).map(callback)
    }
    DOMTokenList.prototype.find = function (callback) {
        return Array.from(this).find(callback)
    }
    DOMTokenList.prototype.includes = function (item) {
        return Array.from(this).includes(item)
    }
    NodeList.prototype.indexOf = function () {
        return Array.from(this).indexOf
    }
    HTMLElement.prototype.hide = function () {
        this.classList.add("displayNone")
    }
    HTMLElement.prototype.show = function () {
        this.classList.remove("displayNone")
    }
}