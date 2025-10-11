let category_nav_list = document.querySelector(".category_nav_list");

function Open_Categ_list(){
    category_nav_list.classList.toggle("active")
}

let nav_links = document.querySelector(".nav_links")

function open_Menu() {
    nav_links.classList.toggle("active")
}

var cart = document.querySelector('.cart');

function open_close_cart() {
    cart.classList.toggle("active")
}

fetch('products.json')
.then(response => response.json())
.then(data => {
    
    const addToCartButtons = document.querySelectorAll(".btn_add_cart")
    
    addToCartButtons.forEach(button =>{
        button.addEventListener("click", (event) => {
            const productId = event.currentTarget.getAttribute('data-id')
            const selcetedProduct = data.find(product => product.id == productId)

            addToCart(selcetedProduct)

            const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)

            allMatchingButtons.forEach(btn =>{
                btn.classList.add("active")
                btn.innerHTML = ' <i class="fa-solid fa-cart-shopping"></i> Item in cart '
            })
        })
    })

})


function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []

    // تحقق إذا كان المنتج موجود مسبقًا
    let existing = cart.find(item => item.id === product.id)
    if(existing){
        existing.quantity += 1
    } else {
        cart.push({...product , quantity: 1})
    }

    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}


function updateCart() {
    const cartItemsContainer = document.getElementById("cart_items")
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const checkout_items = document.getElementById("checkout_items")

    if(checkout_items){
        checkout_items.innerHTML=""
    }

    var total_Price = 0
    var total_count = 0

    cartItemsContainer.innerHTML = "" ;
    cart.forEach((item , index) => {

        let total_Price_item = item.price * item.quantity;

        total_Price += total_Price_item
        total_count += item.quantity

        // في نافذة cart
        cartItemsContainer.innerHTML += `
            <div class="item_cart">
                <img src="${item.img}" alt="">
                <div class="content">
                    <h4>${item.name}</h4>
                    <p class="price_cart">$${total_Price_item}</p>
                    <div class="quantity_control">
                        <button class="decrease_quantity" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="Increase_quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete_item" data-index="${index}" ><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `

        // في صفحة checkout
        if(checkout_items){
            checkout_items.innerHTML += `
                <div class="item_cart">
                    <div class="image_name">
                        <img src="${item.img}" alt="">
                        <div class="content">
                            <h4>${item.name}</h4>
                            <p class="price_cart">$${total_Price_item}</p>
                            <div class="quantity_control">
                                <button class="decrease_quantity" data-index="${index}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="Increase_quantity" data-index="${index}">+</button>
                            </div>
                        </div>
                    </div>
                    <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `
        }
    })


    const price_cart_total = document.querySelector('.price_cart_total')
    const count_item_cart = document.querySelector('.Count_item_cart')
    const count_item_header = document.querySelector('.count_item_header')
    
    price_cart_total.innerHTML = `$ ${total_Price}`
    count_item_cart.innerHTML = total_count
    count_item_header.innerHTML = total_count

    if(checkout_items){
        const subtotal_checkout = document.querySelector(".subtotal_checkout")
        const total_checkout = document.querySelector(".total_checkout")

        subtotal_checkout.innerHTML=`$ ${total_Price}`
        total_checkout.innerHTML=`$ ${total_Price + 20}`
    }

    const increaseButtons = document.querySelectorAll(".Increase_quantity")
    const decreaseButtons = document.querySelectorAll(".decrease_quantity")

    increaseButtons.forEach(button => {
        button.addEventListener("click" , (event) =>{
            const itemIndex = event.currentTarget.getAttribute("data-index")
            IncreaseQuantity(itemIndex)
        })
    })

    decreaseButtons.forEach(button => {
        button.addEventListener("click" , (event) =>{
            const itemIndex = event.currentTarget.getAttribute("data-index")
            decreaseQuantity(itemIndex)
        })
    })

    const delteButtons = document.querySelectorAll('.delete_item')
    delteButtons.forEach(button =>{
        button.addEventListener('click' , (event) =>{
            const itemIndex = event.currentTarget.closest('button').getAttribute('data-index')
            removeFromCart(itemIndex)
        })
    })
}


function IncreaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    if(cart[index]){
        cart[index].quantity += 1
    }
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}

function decreaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    if (cart[index] && cart[index].quantity > 1){
        cart[index].quantity -= 1
    }
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
}


function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const removeProduct = cart.splice(index , 1)[0]
    localStorage.setItem('cart' , JSON.stringify(cart))
    updateCart()
    if(removeProduct){
        updateButtonsState(removeProduct.id)
    }
}


function updateButtonsState(productId) {
    const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
    allMatchingButtons.forEach(button =>{
        button.classList.remove('active');
        button.innerHTML = ' <i class="fa-solid fa-cart-shopping"></i> add to cart '
    })
}

updateCart()
