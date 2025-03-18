import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import rajesh from "../assets/testimonials/q11nkooa09gjgotb3lod.webp"
import meera from "../assets/testimonials/ymvejqae5iudsfqrhf1q.webp"
import amit from "../assets/testimonials/ujbdrkntzgnzjlbeey08.webp"
import sumanth from "../assets/testimonials/wft3kpdf28rkzwj87uaw.webp"
import atul from "../assets/testimonials/e75hz572eyeytnszmxl5.webp";

const testimonials = [
    {
        rating: 5,
        testimonial: "Agro Kiran made fertilizer selection so easy! The AI recommendations were spot-on, and my crop yield has improved significantly.",
        img: rajesh,
        name: "Rajesh Patel",
        designation: "Horticulturist"
    },
    {
        rating: 4.5,
        testimonial: "Great product quality and fast delivery. The fertilizers are exactly as described, and my soil health has improved.",
        img: meera,
        name: "Meera Devi",
        designation: "Organic Farmer"
    },
    {
        rating: 4.8,
        testimonial: "I love the wide variety of organic and synthetic fertilizers available. The website is user-friendly and easy to navigate.",
        img: amit,
        name: "Amit Verma",
        designation: "Vegetable Grower"
    },
    {
        rating: 5,
        testimonial: "Customer support is excellent! They guided me through selecting the right fertilizer, and it worked wonders for my farm.",
        img: sumanth,
        name: "Sumanth Reddy",
        designation: "Rice Farmer"
    },
    {
        rating: 4.7,
        testimonial: "The AI chatbot is really helpful. It suggested the best fertilizer for my crops, and I've seen a visible improvement in plant health.",
        img: atul,
        name: "Atul Yadav",
        designation: "Wheat Farmer"
    }
]

export function renderTestimonials() {
    const testimonialContainer = document.querySelector('.js-testimonial-container');
    let testimonialHTML = "";
    testimonials.forEach(item => {
        testimonialHTML += `
        <div class="swiper-slide bg-primary text-accent rounded-2xl p-3 border-[5px]">
              <i class="fa-solid fa-star slide_active:text-secondary"><span class="ml-3">${item.rating}</span></i>
           <p class="my-5 slide_active:text-white">${item.testimonial}</p>
            
           <div class="bottom-div border-t-3 border-t-accent flex pt-3 gap-3 slide_active\:border">
            <img src="${item.img}" class="size-15 rounded-full opacity-10 slide_active:opacity" alt="">
            <div class="group">
              <p class="font-bold text-lg slide_active:text-secondary">${item.name}</p>
              <p class="slide_active:text-white">${item.designation}</p>
            </div>
           </div>
          </div>
        `
    })
    testimonialContainer.innerHTML = testimonialHTML;
}
export function initSwiper() {
    return new Swiper(".js-testimonial-swiper", {
        slidesPerView: "auto",
        loop: true,
        centeredSlides: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 20
            },

            500: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40
            }
        },
    });
}
