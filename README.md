# Simple Select Menu

## Examples
### セレクトメニューの生成
```html
<head>
    <!-- css and js -->
    <link rel="stylesheet" href="css/SSMenu.css">
    <script src="js/SSMenu.js"></script>

    <script src="js/example.js"></script>
</head>
<body>
    <!-- any menu element -->
    <div id="menu"></div>
</body>
```
```ts
let menuElem = document.getElementById("menu")
if(menuElem !== null) {
    let menu = new SSMenu(menuElem, {
        defaultText: "好きな果物を選択してください。",
        items: [
            {
                content: "リンゴ",
                value: "apple",
                iconUrl: "./apple.png",
                isDefault: true
            },
            {
                content: "バナナ",
                value: "banana",
                iconUrl: "./banana.png"
            },
            {
                content: "サクランボ",
                value: "cherry",
                iconUrl: "./cherry.png"
            }
        ]
    })
}
```

### 選ばれているアイテムの取得
```ts
console.log(menu.selectedObject)
// => {
//     content: "リンゴ",
//     value: "apple",
//     iconUrl: "./apple.png",
//     isDefault: true
// }

console.log(menu.selectedValue)
// => "apple"
```

### 要素の上書き・追加
```ts
// 上書き
menu.setItems([
    // items here
])

// 追加
menu.addItems([
    // items here
])
```