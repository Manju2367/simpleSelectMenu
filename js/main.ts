// interfaces
interface SSMItem {
    iconUrl?: string
    value: string
    content: string
    isDefault?: boolean
}

interface SSM<T extends HTMLElement> {
    setItems: (items: Array<SSMItem>) => this
    addItems: (items: Array<SSMItem>) => this
}

interface SSMOptions {
    defaultText: string
}



// options default
const SSMItemDefault: SSMItem = {
    iconUrl: "",
    value: "",
    content: "",
    isDefault: false
}

const SSMOptionsDefault: SSMOptions = {
    defaultText: "-"
}



class SSMenuOptionError extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options)
    }
}

/**
 * @class
 */
class SSMenu<T extends HTMLElement> implements SSM<T> {
    private rootElement
    private selectedItemContainerElement: HTMLDivElement
    private defaultTextElement: HTMLParagraphElement
    private selectedItemElement: HTMLParagraphElement
    private selectMenuElement: HTMLUListElement
    private selectMenuItemElements: Array<HTMLLIElement>
    private _selectedObject: SSMItem|null
    private _selectedValue: string|null

    /**
     * 
     * @constructor
     * @param elem 
     * @param options 
     */
    constructor(elem: T, options?: Partial<SSMOptions>) {
        // init field
        this.rootElement = elem
        this.selectedItemContainerElement = document.createElement("div")
        this.defaultTextElement = document.createElement("p")
        this.selectedItemElement = document.createElement("p")
        this.selectMenuElement = document.createElement("ul")
        this.selectMenuItemElements = []
        this._selectedObject = null
        this._selectedValue = null



        // init options
        options ??= SSMOptionsDefault
        options.defaultText ??= SSMOptionsDefault.defaultText



        // add classes
        this.rootElement.classList.add("SSM-root-container")
        this.selectedItemContainerElement.classList.add("SSM-selected-item-container")
        this.defaultTextElement.classList.add("SSM-default-text")
        this.selectedItemElement.classList.add("SSM-selected-item")
        this.selectMenuElement.classList.add("SSM-select-menu")



        // options
        this.defaultTextElement.innerText = options.defaultText



        // events
        this.rootElement.addEventListener("click", () => {
            this.selectMenuElement.classList.toggle("active")
        })



        this.defaultTextElement.append(this.generatePulldownSVG())
        this.appendAll(this.selectedItemContainerElement, this.defaultTextElement, this.selectedItemElement)
        this.appendAll(this.rootElement, this.selectedItemContainerElement, this.selectMenuElement)
    }



    /**
     * 
     * @param parent 
     * @param items 
     * @returns 
     */
    private appendAll(parent: ParentNode, ...items: Array<string|Node>): ParentNode {
        items.forEach(item => parent.append(item))
        return parent
    }

    /**
     * 
     * @param node 
     * @returns 
     */
    private removeAllChildren(node: Node): Node {
        while(node.firstChild) {
            node.removeChild(node.firstChild)
        }
        return node
    }

    /**
     * 
     * @returns 
     */
    private generatePulldownSVG(): SVGSVGElement {
        let pulldownSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        pulldownSVG.setAttribute("viewBox", "0 0 32 40")
        pulldownSVG.setAttribute("x", "0")
        pulldownSVG.setAttribute("y", "0")
        pulldownSVG.innerHTML = `
            <path fill=""#000 d="M22.92,13.62A1,1,0,0,0,22,13H10a1,1,0,0,0-.92.62,1,1,0,0,0,.21,1.09l6,6a1,1,0,0,0,1.42,0l6-6A1,1,0,0,0,22.92,13.62Z"></path>
        `
        pulldownSVG.classList.add("SSM-pulldown-icon")
        
        return pulldownSVG
    }

    private nonNullable<T>(T: any): asserts T is NonNullable<T> {
        if(T === null || T === undefined) {
            throw new Error("This value is null or undefined.")
        }
    }



    /**
     * 
     * @param items 
     * @returns 
     */
    public setItems(items: Array<SSMItem>) {
        if(items.filter(i => i.isDefault).length > 1) {
            throw new SSMenuOptionError("Default selected item is must be 1 item.")
        }

        // init
        this.defaultTextElement.classList.remove("hidden")
        this.selectedItemElement.classList.add("hidden")
        this.removeAllChildren(this.selectedItemElement)
        this.selectMenuItemElements = []
        this.removeAllChildren(this.selectMenuElement)

        // for each items
        items.forEach(item => {
            let menuItem = document.createElement("li")
            menuItem.classList.add("SSM-select-list")
            menuItem.dataset.value = item.value



            // menu item icon
            let menuItemIcon: HTMLImageElement|undefined
            if(typeof item.iconUrl === "string") {
                menuItemIcon = document.createElement("img")
                menuItemIcon.src = item.iconUrl
                menuItemIcon.alt = "○"
                menuItemIcon.classList.add("SSM-menu-item-icon")

                menuItem.append(menuItemIcon.cloneNode(true))
            }



            // menu item text
            let menuItemText = document.createElement("p")
            menuItemText.innerText = item.content
            menuItemText.classList.add("SSM-menu-item-text")
            if(typeof item.isDefault === "undefined") {
                item.isDefault === SSMItemDefault.isDefault
            }
            if(item.isDefault) {
                this._selectedObject = item
                this._selectedValue = item.value
                this.defaultTextElement.classList.add("hidden")
                this.selectedItemElement.classList.remove("hidden")
                this.removeAllChildren(this.selectedItemElement)
                if(typeof menuItemIcon !== "undefined") {
                    this.selectedItemElement.append(menuItemIcon.cloneNode(true))
                }
                this.selectedItemElement.append(menuItemText.cloneNode(true))
                this.selectedItemElement.append(this.generatePulldownSVG())

                menuItem.classList.add("selected")
            }



            // events
            menuItem.addEventListener("click", (e) => {
                // reseet selected
                this.selectMenuItemElements.forEach(menu => menu.classList.remove("selected"))
                let target = e.target
                if(target instanceof HTMLLIElement) {
                    this._selectedObject = item
                    this._selectedValue = item.value
                    target.classList.add("selected")
                    this.removeAllChildren(this.selectedItemElement)

                    for(let i = 0; i < target.children.length; i++) {
                        let item = target.children.item(i)
                        if(item !== null) {
                            this.selectedItemElement.append(item.cloneNode(true))
                        }
                    }
                    this.selectedItemElement.append(this.generatePulldownSVG())

                    this.defaultTextElement.classList.add("hidden")
                    this.selectedItemElement.classList.remove("hidden")
                }
            })



            menuItem.append(menuItemText.cloneNode(true))
            this.selectMenuItemElements.push(menuItem)
            this.selectMenuElement.append(menuItem)
        })

        return this
    }

    /**
     * 
     * @param items 
     * @returns 
     */
    public addItems(items: Array<SSMItem>) {
        

        return this
    }

    /**
     * 
     */
    public get selectedObject() {
        return this._selectedObject
    }

    /**
     * 
     */
    public get selectedValue() {
        return this._selectedValue
    }
}
