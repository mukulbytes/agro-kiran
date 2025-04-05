import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatPriceINR } from '../utils/utils';

export const deliveryOptions = [
    {
        deliveryOptionId: '1',
        cost: 0,
        deliveryTime: 7
    }, {
        deliveryOptionId: '2',
        cost: 40,
        deliveryTime: 3
    }, {
        deliveryOptionId: '3',
        cost: 100,
        deliveryTime: 1
    }
];

//Generate Delivery Options Dynamically
export function generateDeliveyOptions(productId, cartItem) {
    let optionHTML = '';

    deliveryOptions.forEach(opt => {
        let deliveryOptionId = opt.deliveryOptionId;
        let cost = deliveryOptionId === '1' ? "FREE" : `${formatPriceINR(opt.cost)} -`
        let isChecked = deliveryOptionId === cartItem.deliveryOptionId;
        let deliveryDate = calculateDeliveryDate(deliveryOptionId);

        optionHTML += `
              <label class="text-sm md:text-lg grid grid-cols-[1rem_1fr] gap-2.5 js-delivery-option" >
                <input
                  type="radio"
                  class="accent-secondary"
                  ${isChecked ? 'checked' : ''}
                  name="delivery-option-${productId}-${cartItem.variant}"
                  data-product-id="${productId}"
                  data-variant="${cartItem.variant}"
                  data-delivery-option-id="${deliveryOptionId}" 
                />
                <div class="flex flex-col gap-1">
                  <div class="text-amber-200 font-bold">${deliveryDate}</div>
                  <div class="text-white">${cost} Shipping</div>
                </div>
              </label>
    `  });
    return optionHTML;
}

export function calculateDeliveryDate(id) {

    //Get Base Delivery Time Using deliveryOptionId
    let baseDeliveryTime;
    deliveryOptions.forEach(opt => {
        if (opt.deliveryOptionId === id) {
            baseDeliveryTime = opt.deliveryTime;
        }
    })

    const weekends = ["Saturday", "Sunday"];
    let i = 0;
    let finalDeliveryTime = 0;

    //This loop gives us the final delivery time with weekends skipped
    while (i < baseDeliveryTime) {
        finalDeliveryTime++;

        //Check if the new deliveryTime is a weekend
        if (!weekends.includes(dayjs().add(finalDeliveryTime, 'days').format('dddd'))) {
            i++;
        }
    }

    //Generate the final format of the delivery date using finalDeliveryTime
    return dayjs().add(finalDeliveryTime, 'days').format('dddd, MMMM DD');
}

export function renderDeliveryDate(productId, deliveryOptionId, variant) {
    //Get All query Nodes for main date heading
    const headingElements = document.querySelectorAll(".js-main-date-heading");

    //Find Correct Node
    let finalElement;
    headingElements.forEach(element => {
        if (element.dataset.productId === productId && element.dataset.variant === variant) {
            finalElement = element;
        }
    });
    
    if (finalElement) {
        finalElement.innerHTML = `Delivery date: ${calculateDeliveryDate(deliveryOptionId)}`;
    }
}