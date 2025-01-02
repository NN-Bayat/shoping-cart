let iconCard = document.querySelector(".icon_card");
let body = document.querySelector("body");
let closeCard = document.querySelector(".close");
let listProductHTML = document.querySelector(".listProduct");
let listCardHTML = document.querySelector(".listCard");
let iconCardSpan = document.querySelector(".icon_card span");

let listProducts = [];
let cards = [];

iconCard.addEventListener("click", () => {
    body.classList.toggle("showCard");
});
closeCard.addEventListener("click", () => {
    body.classList.remove("showCard");
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement("div");
            newProduct.classList.add("item");
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="image">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCard">
                    Add to Card
                </button>
            `;
            listProductHTML.appendChild(newProduct);
        });
    };
};
listProductHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains("addCard")) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCard(product_id);
    }
});

const addToCard = (product_id) => {
    let positionThisProductInCard = cards.findIndex((value) => value.product_id == product_id);
    if (cards.length <= 0) {
        cards = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCard < 0) {
        cards.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cards[positionThisProductInCard].quantity = cards[positionThisProductInCard].quantity + 1;
    }
    addCardToHTML();
};

const addCardToHTML = () => {
    listCardHTML.innerHTML = '';
    let totleQuantity = 0;
    if (cards.length > 0) {
        cards.forEach(card => {
            totleQuantity = totleQuantity + card.quantity;
            let newCard = document.createElement("div");
            newCard.classList.add("item");
            newCard.dataset.id = card.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == card.product_id);
            let info = listProducts[positionProduct];
            newCard.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="image">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totlePrice">
                    $${info.price * card.quantity}
                </div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${card.quantity}</span>
                    <span class="plus">+</span>
                </div>`;
            listCardHTML.appendChild(newCard);
        });
    }
    iconCardSpan.innerText = totleQuantity;
};

listCardHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains("minus") || positionClick.classList.contains("plus")) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = "minus";
        if (positionClick.classList.contains("plus")) {
            type = "plus";
        }
        changeQuantity(product_id, type);
    }
});

const changeQuantity = (product_id, type) => {
    let positionItemInCard = cards.findIndex((value) => value.product_id == product_id);
    if (positionItemInCard >= 0) {
        switch (type) {
            case "plus":
                cards[positionItemInCard].quantity = cards[positionItemInCard].quantity + 1;
                break;

            default:
                let valueChange = cards[positionItemInCard].quantity - 1;
                if (valueChange > 0) {
                    cards[positionItemInCard].quantity = valueChange;
                } else {
                    cards.splice(positionItemInCard, 1);
                }
                break;
        }
    }
    addCardToHTML();
};

const initApp = () => {
    // get data from json
    fetch("products.json")
        .then(response => response.json())
        .then(Data => {
            listProducts = Data;
            addDataToHTML();
        });
};
initApp();
