window.addEventListener("DOMContentLoaded", () => {

    let items = [
        {
            value: "content1",
            iconUrl: "https://enka.network/ui/UI_AvatarIcon_Fischl.png",
        },
        {
            value: "content2",
            iconUrl: "https://enka.network/ui/UI_AvatarIcon_Linette.png"
        },
        {
            value: "content3",
            iconUrl: "https://enka.network/ui/UI_AvatarIcon_PlayerGirl.png"
        }
    ]

    let menuContainer = document.getElementById("ssm")
    let menuContainer2 = document.getElementById("ssm2")
    if(menuContainer !== null) {
        const ssm = new SSMenu(menuContainer, {
            defaultText: "選択してください。"
        }).setItems([
            {
                value: "content1",
                iconUrl: "https://enka.network/ui/UI_AvatarIcon_PlayerGirl.png",
                isDefault: true
            },
            {
                value: "content2"
            },
            {
                value: "content3"
            }
        ])

        let setButton = document.getElementById("set")
        if(setButton !== null) {
            setButton.onclick = () => {
                ssm.setItems(items)
            }
        }
    }

})