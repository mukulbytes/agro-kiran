import flower from "../assets/flower-primary-stroke.png"
import productbg from "../assets/Product-bg.png"
import { fetchProductData } from "../data/products.js";
import { updateCartQuantity, updateDeliveryOption, deleteFromCart } from "../data/cart.js";
import { formatPriceINR } from "../utils/utils.js";
import { calculateDeliveryDate, renderDeliveryDate, generateDeliveyOptions } from "../data/delivery.js";
import { updatePaymentSummary } from "./paymentSummary.js";
import { userService } from "../services/userService.js";

const bgURL = new URL(productbg, import.meta.url).href;

export async function updateCartSummary() {
    const cart = await userService.getCart();
    const itemsContainer = document.querySelector('.js-cart-items-grid');
    let cartHTML = '';

    if (cart.length === 0) {
        cartHTML = `<div class="empty-cart-container">
                    <p class="mb-3 font-medium text-secondary shadow-2xl">Your Cart is empty</p>
                    <a href="/shop.html" class="shadow-2xl py-1.5 px-2.5 bg-primary font-bold text-white duration-150 ease-in-out hover:text-secondary border-3 border-accent hover:border-secondary rounded-lg"> 
                    View Products </a>
                </div>`
    }
    else {
        // Use Promise.all to wait for all product data to be fetched
        const cartItemsPromises = cart.map(async (cartItem) => {
            let { productId, deliveryOptionId } = cartItem;
            let deliveryDate = calculateDeliveryDate(deliveryOptionId);

            // Await the product data
            const productTitle = await fetchProductData(productId, "title");
            const productPrice = await fetchProductData(productId, "price");
            const productImages = await fetchProductData(productId, "img");

            return `
                <div class="js-cart-item flex flex-col justify-center items-center relative p-5 border-3 border-secondary/50 rounded-lg overflow-clip">
                    <img src="${flower}" class="blur-xs absolute h-80 -bottom-50 -right-20" alt="" />
                    
                    <!--Delivery Date Heading Div-->
                    <div
                        class="js-main-date-heading text-secondary font-bold text-center text-xl lg:text-left md:text-3xl mb-5"
                        data-product-id="${productId}"
                        data-delivery-option-id="${deliveryOptionId}"
                    >
                        Delivery date: <span class="block md:inline"> ${deliveryDate} </span>
                    </div>

                    <!--Item Details Grid-->
                    <div class="grid grid-cols-1 gap-5 justify-center items-center w-full">

                        <!--Product Image Div-->
                        <div class="flex items-center justify-center bg-center bg-no-repeat bg-contain" style="background-image: url('${bgURL}') !important">
                            <img class="h-60" src="${productImages[cartItem.variant]}" alt="" />
                        </div>

                        <div class="flex flex-col sm:flex-row max-sm:justify-between sm:justify-around  pt-5"> 

                            <!--Product Details Div-->
                            <div class="flex flex-col text-white font-bold gap-1.5">
                                <div class="text-center sm:text-left text-xl md:text-2xl ">${productTitle} (${cartItem.variant})</div>
                                <div class="text-amber-200 text-xl md:text-2xl">${formatPriceINR(productPrice[cartItem.variant])}</div>
                                <div class="flex gap-2.5 items-center text-sm md:max-md:text-lg xl:text-lg">
                                    <div class="js-quantity-display whitespace-nowrap">Quantity: ${cartItem.quantity}</div>
                                    <input class="js-quantity-input border-2 p-0.5 border-amber-200 max-w-9.5 rounded-lg text-center hidden" type="number" name="quantity" id="quantity" value="1" />
                                    <button class="text-amber-200 hover:underline hover:text-secondary js-save-button hidden" data-product-id="${productId}">Save</button>
                                    <button class="text-amber-200 hover:underline hover:text-secondary js-update-button">Update</button>
                                    <button class="text-amber-200 hover:underline hover:text-secondary js-delete-button" data-product-id="${productId}">Delete</button>
                                </div>
                            </div>

                            <div>
                                <div class="text-secondary font-bold max-sm:mt-5 text-sm md:text-lg">Choose a delivery option:</div>
                                ${generateDeliveyOptions(productId, cartItem)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Wait for all cart items to be processed
        const cartItemsHTML = await Promise.all(cartItemsPromises);
        cartHTML = cartItemsHTML.join('');
    }

    itemsContainer.innerHTML = cartHTML;

    const updateButtons = document.querySelectorAll('.js-update-button');
    const saveButtons = document.querySelectorAll('.js-save-button');
    const quantityDisplay = document.querySelectorAll('.js-quantity-display');
    const quantityInputs = document.querySelectorAll('.js-quantity-input');

    //Refactor duplicate code

    async function handleUpdate(index) {
        const cart = await userService.getCart();
        //fecth the current button
        let btn = saveButtons[index];
        let { productId } = btn.dataset;
        let value = Number(quantityInputs[index].value);
        let i = cart.findIndex(cartItem => cartItem.productId === productId);
        if (value === 0) {
            deleteFromCart(i);
            updatePaymentSummary();
        }
        else if (value < 0 || value > 100) {
            alert('Invalid Quantity');
        }
        else {
            updateCartQuantity(productId, value);
            updatePaymentSummary();
            quantityDisplay[index].innerHTML = `Quantity: ${value}`;
            btn.classList.toggle("hidden")
            quantityInputs[index].classList.toggle('hidden');
            updateButtons[index].classList.toggle('hidden');
        }
    }

    saveButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            handleUpdate(index);
        })

        //Keyboard Functionality
        quantityInputs[index].addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                handleUpdate(index);
            }
        })
    })

    updateButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('hidden');
            saveButtons[index].classList.toggle('hidden');
            quantityInputs[index].classList.toggle('hidden');
        })
    })

    const deleteButtons = document.querySelectorAll('.js-delete-button');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            let { productId } = btn.dataset;
            let index = cart.findIndex(cartItem => cartItem.productId === productId);
            deleteFromCart(index);
            //Render Payment Summary
            updatePaymentSummary();
        })
    })

    const optionElements = document.querySelectorAll('.js-delivery-option input[type="radio"]');

    optionElements.forEach(opt => {
        opt.addEventListener('click', () => {
            const productId = opt.dataset.productId;
            const deliveryOptionId = opt.dataset.deliveryOptionId;
            updateDeliveryOption(productId, deliveryOptionId);
            renderDeliveryDate(productId, deliveryOptionId);
            updatePaymentSummary();
        })
    })
}