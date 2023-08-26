"use strict";
// options default
const SSMItemDefault = {
    iconUrl: "",
    value: "",
    content: "",
    isDefault: false
};
const SSMOptionsDefault = {
    defaultText: "-"
};
class SSMenuOptionError extends Error {
    constructor(message, options) {
        super(message, options);
    }
}
/**
 * @class
 */
class SSMenu {
    rootElement;
    selectedItemContainerElement;
    defaultTextElement;
    selectedItemElement;
    selectMenuElement;
    selectMenuItemElements;
    _selectedObject;
    _selectedValue;
    /**
     *
     * @constructor
     * @param elem
     * @param options
     */
    constructor(elem, options) {
        // init field
        this.rootElement = elem;
        this.selectedItemContainerElement = document.createElement("div");
        this.defaultTextElement = document.createElement("p");
        this.selectedItemElement = document.createElement("p");
        this.selectMenuElement = document.createElement("ul");
        this.selectMenuItemElements = [];
        this._selectedObject = null;
        this._selectedValue = null;
        // init options
        options ??= SSMOptionsDefault;
        options.defaultText ??= SSMOptionsDefault.defaultText;
        // add classes
        this.rootElement.classList.add("SSM-root-container");
        this.selectedItemContainerElement.classList.add("SSM-selected-item-container");
        this.defaultTextElement.classList.add("SSM-default-text");
        this.selectedItemElement.classList.add("SSM-selected-item");
        this.selectMenuElement.classList.add("SSM-select-menu");
        // tab index
        this.selectedItemContainerElement.tabIndex = 0;
        // options
        this.defaultTextElement.innerText = options.defaultText;
        // events
        // this.rootElement.addEventListener("click", () => {
        //     this.selectMenuElement.classList.toggle("active")
        // })
        this.selectedItemContainerElement.addEventListener("focus", () => {
            this.selectMenuElement.classList.add("active");
        });
        this.selectedItemContainerElement.addEventListener("blur", () => {
            this.selectMenuElement.classList.remove("active");
        });
        this.defaultTextElement.append(this.generatePulldownSVG());
        this.appendAll(this.selectedItemContainerElement, this.defaultTextElement, this.selectedItemElement);
        this.appendAll(this.rootElement, this.selectedItemContainerElement, this.selectMenuElement);
        if (options.items) {
            this.setItems(options.items);
        }
    }
    /**
     *
     * @param parent
     * @param items
     * @returns
     */
    appendAll(parent, ...items) {
        items.forEach(item => parent.append(item));
        return parent;
    }
    /**
     *
     * @param node
     * @returns
     */
    removeAllChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        return node;
    }
    /**
     *
     * @returns
     */
    generatePulldownSVG() {
        let pulldownSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        pulldownSVG.setAttribute("viewBox", "0 0 32 40");
        pulldownSVG.setAttribute("x", "0");
        pulldownSVG.setAttribute("y", "0");
        pulldownSVG.innerHTML = `
            <path fill=""#000 d="M22.92,13.62A1,1,0,0,0,22,13H10a1,1,0,0,0-.92.62,1,1,0,0,0,.21,1.09l6,6a1,1,0,0,0,1.42,0l6-6A1,1,0,0,0,22.92,13.62Z"></path>
        `;
        pulldownSVG.classList.add("SSM-pulldown-icon");
        return pulldownSVG;
    }
    nonNullable(T) {
        if (T === null || T === undefined) {
            throw new Error("This value is null or undefined.");
        }
    }
    /**
     *
     * @param items
     * @returns
     */
    setItems(items) {
        if (items.filter(i => i.isDefault).length > 1) {
            throw new SSMenuOptionError("Default selected item is must be 1 item.");
        }
        // init
        this.defaultTextElement.classList.remove("hidden");
        this.selectedItemElement.classList.add("hidden");
        this.removeAllChildren(this.selectedItemElement);
        this.selectMenuItemElements = [];
        this.removeAllChildren(this.selectMenuElement);
        // for each items
        items.forEach(item => {
            let menuItem = document.createElement("li");
            menuItem.classList.add("SSM-select-list");
            menuItem.dataset.value = item.value;
            // menu item icon
            let menuItemIcon;
            if (typeof item.iconUrl === "string") {
                menuItemIcon = document.createElement("img");
                menuItemIcon.src = item.iconUrl;
                menuItemIcon.alt = "○";
                menuItemIcon.classList.add("SSM-menu-item-icon");
                menuItem.append(menuItemIcon.cloneNode(true));
            }
            // menu item text
            let menuItemText = document.createElement("p");
            menuItemText.innerText = item.content;
            menuItemText.classList.add("SSM-menu-item-text");
            if (typeof item.isDefault === "undefined") {
                item.isDefault === SSMItemDefault.isDefault;
            }
            if (item.isDefault) {
                this._selectedObject = item;
                this._selectedValue = item.value;
                this.defaultTextElement.classList.add("hidden");
                this.selectedItemElement.classList.remove("hidden");
                this.removeAllChildren(this.selectedItemElement);
                if (typeof menuItemIcon !== "undefined") {
                    this.selectedItemElement.append(menuItemIcon.cloneNode(true));
                }
                this.selectedItemElement.append(menuItemText.cloneNode(true));
                this.selectedItemElement.append(this.generatePulldownSVG());
                menuItem.classList.add("selected");
            }
            // events
            menuItem.addEventListener("mousedown", (e) => {
                this.selectedItemContainerElement.focus();
                // reseet selected
                this.selectMenuItemElements.forEach(menu => menu.classList.remove("selected"));
                let target = e.target;
                if (target instanceof HTMLLIElement) {
                    this._selectedObject = item;
                    this._selectedValue = item.value;
                    target.classList.add("selected");
                    this.removeAllChildren(this.selectedItemElement);
                    for (let i = 0; i < target.children.length; i++) {
                        let item = target.children.item(i);
                        if (item !== null) {
                            this.selectedItemElement.append(item.cloneNode(true));
                        }
                    }
                    this.selectedItemElement.append(this.generatePulldownSVG());
                    this.defaultTextElement.classList.add("hidden");
                    this.selectedItemElement.classList.remove("hidden");
                }
                this.selectedItemContainerElement.blur();
            });
            menuItem.append(menuItemText.cloneNode(true));
            this.selectMenuItemElements.push(menuItem);
            this.selectMenuElement.append(menuItem);
        });
        return this;
    }
    /**
     *
     * @param items
     * @returns
     */
    addItems(items) {
        if (items.filter(i => i.isDefault).length > 1) {
            throw new SSMenuOptionError("Default selected item is must be 1 item.");
        }
        // init
        this.defaultTextElement.classList.remove("hidden");
        this.selectedItemElement.classList.add("hidden");
        this.selectMenuItemElements.forEach(menuItem => {
            menuItem.classList.remove("selected");
        });
        this._selectedObject = null;
        this._selectedValue = null;
        // for each items
        items.forEach(item => {
            let menuItem = document.createElement("li");
            menuItem.classList.add("SSM-select-list");
            menuItem.dataset.value = item.value;
            // menu item icon
            let menuItemIcon;
            if (typeof item.iconUrl === "string") {
                menuItemIcon = document.createElement("img");
                menuItemIcon.src = item.iconUrl;
                menuItemIcon.alt = "○";
                menuItemIcon.classList.add("SSM-menu-item-icon");
                menuItem.append(menuItemIcon.cloneNode(true));
            }
            // menu item text
            let menuItemText = document.createElement("p");
            menuItemText.innerText = item.content;
            menuItemText.classList.add("SSM-menu-item-text");
            if (typeof item.isDefault === "undefined") {
                item.isDefault === SSMItemDefault.isDefault;
            }
            if (item.isDefault) {
                this._selectedObject = item;
                this._selectedValue = item.value;
                this.defaultTextElement.classList.add("hidden");
                this.selectedItemElement.classList.remove("hidden");
                this.removeAllChildren(this.selectedItemElement);
                if (typeof menuItemIcon !== "undefined") {
                    this.selectedItemElement.append(menuItemIcon.cloneNode(true));
                }
                this.selectedItemElement.append(menuItemText.cloneNode(true));
                this.selectedItemElement.append(this.generatePulldownSVG());
                menuItem.classList.add("selected");
            }
            // events
            menuItem.addEventListener("mousedown", (e) => {
                // reseet selected
                this.selectMenuItemElements.forEach(menu => menu.classList.remove("selected"));
                let target = e.target;
                if (target instanceof HTMLLIElement) {
                    this._selectedObject = item;
                    this._selectedValue = item.value;
                    target.classList.add("selected");
                    this.removeAllChildren(this.selectedItemElement);
                    for (let i = 0; i < target.children.length; i++) {
                        let item = target.children.item(i);
                        if (item !== null) {
                            this.selectedItemElement.append(item.cloneNode(true));
                        }
                    }
                    this.selectedItemElement.append(this.generatePulldownSVG());
                    this.defaultTextElement.classList.add("hidden");
                    this.selectedItemElement.classList.remove("hidden");
                }
            });
            menuItem.append(menuItemText.cloneNode(true));
            this.selectMenuItemElements.push(menuItem);
            this.selectMenuElement.append(menuItem);
        });
        return this;
    }
    /**
     *
     */
    get selectedObject() {
        return this._selectedObject;
    }
    /**
     *
     */
    get selectedValue() {
        return this._selectedValue;
    }
}
