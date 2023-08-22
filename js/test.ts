window.addEventListener("DOMContentLoaded", () => {

    let menuContainer = document.getElementById("ssm")
    if(menuContainer !== null) {
        const ssm = new SSMenu(menuContainer, {
            defaultText: "選択してください。"
        }).setItems([
            {
                content: "フィッシュル",
                value: "Fischl",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_Fischl.png",
                isDefault: false
            },
            {
                content: "リネット",
                value: "Linette",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_Linette.png",
                isDefault: true
            },
            {
                content: "旅人",
                value: "PlayerGirl",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_PlayerGirl.png"
            }
        ])

        let setButton = document.getElementById("set")
        if(setButton !== null) {
            setButton.onclick = () => {
                ssm.addItems([{
                    content: "Inserted",
                    value: "inserted value"
                }])
                console.log(ssm.selectedObject)
                console.log(ssm.selectedValue)
            }
        }
    }

})