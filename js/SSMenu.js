"use strict";
// options default
const SSMenuItemDefault = {
    value: "",
    content: "",
    iconUrl: "",
    iconBackground: "transparent",
    isDefault: false,
};
const SSMenuOptionsDefault = {
    defaultText: "-",
    iconBackground: "transparent",
    items: [],
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
    pulldownIconElement;
    selectedItemElement;
    selectMenuElement;
    selectMenuItemElements;
    _selectedObject;
    _selectedValue;
    _iconBackground;
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
        options ??= SSMenuOptionsDefault;
        options.defaultText ??= SSMenuOptionsDefault.defaultText;
        options.iconBackground ??= SSMenuOptionsDefault.iconBackground;
        this._iconBackground = options.iconBackground;
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
        this.selectedItemContainerElement.addEventListener("mousedown", (e) => {
            if (this.selectMenuElement.classList.contains("active")) {
                this.selectedItemContainerElement.blur();
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });
        this.selectedItemContainerElement.addEventListener("focus", () => {
            this.pulldownIconElement.classList.add("active");
            this.selectMenuElement.classList.add("active");
        });
        this.selectedItemContainerElement.addEventListener("blur", () => {
            this.pulldownIconElement.classList.remove("active");
            this.selectMenuElement.classList.remove("active");
        });
        this.pulldownIconElement = this.generatePulldownSVG();
        this.defaultTextElement.append(this.pulldownIconElement);
        this.appendAll(this.selectedItemContainerElement, this.defaultTextElement, this.selectedItemElement);
        this.appendAll(this.rootElement, this.selectedItemContainerElement, this.selectMenuElement);
        if (options.items) {
            this.setItems(options.items);
        }
    }
    // private methods
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
        pulldownSVG.setAttribute("viewBox", "0 0 100 100");
        pulldownSVG.setAttribute("x", "0");
        pulldownSVG.setAttribute("y", "0");
        pulldownSVG.innerHTML = `
            <path fill=""#000 d="M96.2,77.7L58.5,12.5c-3.8-6.5-13.2-6.5-17,0L3.8,77.7c-3.8,6.5,0.9,14.7,8.5,14.7h75.4C95.2,92.4,99.9,84.3,96.2,77.7z"></path>
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
     */
    initItems(items) {
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
                menuItemIcon.style.background = item.iconBackground ?? this._iconBackground ?? "";
                menuItem.append(menuItemIcon.cloneNode(true));
            }
            // menu item text
            let menuItemText = document.createElement("p");
            menuItemText.innerText = item.content;
            menuItemText.classList.add("SSM-menu-item-text");
            if (typeof item.isDefault === "undefined") {
                item.isDefault === SSMenuItemDefault.isDefault;
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
                this.selectedItemElement.append(this.pulldownIconElement);
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
                    this.selectedItemElement.append(this.pulldownIconElement);
                    this.defaultTextElement.classList.add("hidden");
                    this.selectedItemElement.classList.remove("hidden");
                }
            });
            menuItem.append(menuItemText.cloneNode(true));
            this.selectMenuItemElements.push(menuItem);
            this.selectMenuElement.append(menuItem);
        });
    }
    // public methods
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
        this.initItems(items);
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
        this.defaultTextElement.append(this.pulldownIconElement);
        this.defaultTextElement.classList.remove("hidden");
        this.selectedItemElement.classList.add("hidden");
        this.selectMenuItemElements.forEach(menuItem => {
            menuItem.classList.remove("selected");
        });
        this._selectedObject = null;
        this._selectedValue = null;
        this.initItems(items);
        return this;
    }
    setIconBackground(iconBackground) {
        this._iconBackground = iconBackground;
        return this;
    }
    // getter
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
