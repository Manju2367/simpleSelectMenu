"use strict";
/**
 * <div class="select-menu-container">
        <div class="selected-item-container">
            <p class="default-text">キャラクターを選択してください。</p>
            <p class="selected-item hidden"></p>
        </div>
        <ul class="select-menu">
            <li class="select-list">
                <img class="menu-item" src="https://enka.network/ui/UI_AvatarIcon_Fischl.png" alt="">
                <p class="menu-text">フィッシュル</span>
            </li>
            <li class="select-list">
                <img class="menu-item" src="https://enka.network/ui/UI_AvatarIcon_Linette.png" alt="">
                <p class="menu-text">リネット</span>
            </li>
            <li class="select-list">
                <img class="menu-item" src="https://enka.network/ui/UI_AvatarIcon_PlayerGirl.png" alt="">
                <p class="menu-text">旅人</span>
            </li>
        </ul>
    </div>
 */
const SSMItemDefault = {
    iconUrl: "",
    value: "",
    isDefault: false
};
const SSMOptionsDefault = {
    defaultText: "-"
};
class SSMenu {
    rootElement;
    selectedItemContainerElement;
    defaultTextElement;
    selectedItemElement;
    selectMenuElement;
    selectMenuItemElements;
    constructor(elem, options) {
        // init field
        this.rootElement = elem;
        this.selectedItemContainerElement = document.createElement("div");
        this.defaultTextElement = document.createElement("p");
        this.selectedItemElement = document.createElement("p");
        this.selectMenuElement = document.createElement("ul");
        this.selectMenuItemElements = [];
        // init options
        options ??= SSMOptionsDefault;
        options.defaultText ??= SSMOptionsDefault.defaultText;
        // add classes
        this.rootElement.classList.add("SSM-root-container");
        this.selectedItemContainerElement.classList.add("SSM-selected-item-container");
        this.defaultTextElement.classList.add("SSM-default-text");
        this.selectedItemElement.classList.add("SSM-selected-item");
        this.selectMenuElement.classList.add("SSM-select-menu");
        // options
        this.defaultTextElement.innerText = options.defaultText;
        // events
        this.rootElement.addEventListener("click", () => {
            this.selectMenuElement.classList.toggle("active");
        });
        this.appendAll(this.selectedItemContainerElement, this.defaultTextElement, this.selectedItemElement);
        this.appendAll(this.rootElement, this.selectedItemContainerElement, this.selectMenuElement);
    }
    appendAll(parent, ...items) {
        items.forEach(item => parent.append(item));
        return parent;
    }
    removeAllChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        return node;
    }
    setItems(items) {
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
            menuItemText.innerText = item.value;
            menuItemText.classList.add("SSM-menu-item-text");
            if (typeof item.isDefault === "undefined") {
                item.isDefault === SSMItemDefault.isDefault;
            }
            if (item.isDefault) {
                this.defaultTextElement.classList.add("hidden");
                this.selectedItemElement.classList.remove("hidden");
                this.removeAllChildren(this.selectedItemElement);
                if (typeof menuItemIcon !== "undefined") {
                    this.selectedItemElement.append(menuItemIcon.cloneNode(true));
                }
                this.selectedItemElement.append(menuItemText.cloneNode(true));
                menuItem.classList.add("selected");
            }
            // events
            menuItem.addEventListener("click", (e) => {
                // reseet selected
                this.selectMenuItemElements.forEach(menu => menu.classList.remove("selected"));
                let target = e.target;
                if (target instanceof HTMLLIElement) {
                    target.classList.add("selected");
                    this.removeAllChildren(this.selectedItemElement);
                    for (let i = 0; i < target.children.length; i++) {
                        let item = target.children.item(i);
                        if (item !== null) {
                            this.selectedItemElement.append(item.cloneNode(true));
                        }
                    }
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
    addItems(items) {
        return this;
    }
}
