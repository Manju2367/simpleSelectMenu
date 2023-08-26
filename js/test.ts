const nonNullable: <T>(value: T) => asserts value is NonNullable<T> = <T>(value: T): asserts value is NonNullable<T> => {
    if(value === undefined || value === null) {
        throw new Error("This value is nullable.")
    }
}

const isDivElement: (element: any) => asserts element is HTMLDivElement = (element: any): asserts element is HTMLDivElement => {
    if(element.nodeName !== "DIV") {
        throw new Error("This element is not a div element.")
    }
}

window.addEventListener("DOMContentLoaded", () => {

    const menuContainer = document.getElementById("ssm")
    nonNullable(menuContainer)

    const ssm = new SSMenu(menuContainer, {
        defaultText: "選択してください。",
        iconBackground: "black",
        items: [
            {
                content: "フィッシュル",
                value: "Fischl",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_Fischl.png"
            },
            {
                content: "リネット",
                value: "Linette",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_Linette.png",
                iconBackground: "green"
            },
            {
                content: "旅人",
                value: "PlayerGirl",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_PlayerGirl.png"
            }
        ]
    })



    const addItemButton = document.getElementById("add-item")
    nonNullable(addItemButton)

    addItemButton.onclick = () => {
        ssm.addItems([
            {
                content: "エウルア",
                value: "Eula",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_Eula.png"
            }
        ])
    }

    const printSelectedItemButton = document.getElementById("print-selected-item")
    const selectedItemOut = document.getElementById("selected-item-out")
    nonNullable(printSelectedItemButton)
    nonNullable(selectedItemOut)
    
    printSelectedItemButton.onclick = () => {
        selectedItemOut.innerText = ssm.selectedValue ?? "未選択"
    }

})