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
        items: [
            {
                content: "フィッシュル",
                value: "Fischl",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_Fischl.png"
            },
            {
                content: "リネット",
                value: "Linette",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_Linette.png"
            },
            {
                content: "旅人",
                value: "PlayerGirl",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_PlayerGirl.png"
            }
        ]
    })



    const setButton = document.getElementById("set")
    nonNullable(setButton)

    setButton.onclick = () => {
        console.log(ssm.selectedObject)
        console.log(ssm.selectedValue)
    }



    const selectMenu = document.getElementsByClassName("SSM-selected-item-container")[0]
    nonNullable(selectMenu)
    isDivElement(selectMenu)



})