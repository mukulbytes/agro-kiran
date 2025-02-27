const products = [
    {
        id: "m46ktwulat58sa0zjrp0",
        img: "./images/hero-products/bloom-power.png",
        title: "Bloom Power",
        desc: "A fertilizer formulated to boost flower production with a higher phosphorus content to promote abundant blooming in ornamental plants and flowering shrubs.",
        highlights: {
            li1: "Increases flower size and number.",
            li2: "Enhances color and fragrance in blooms.",
            li3: "Ideal for roses, perennials, and bedding plants.",
        },
        price: 5999,
    },
    {
        id: "m46ktwulat58sa0zjrp0",
        img: "./images/hero-products/urea-plus.png",
        title: "Urea Plus",
        desc: "A fertilizer formulated to boost flower production with a higher phosphorus content to promote abundant blooming in ornamental plants and flowering shrubs.",
        highlights: {
            li1: "Increases flower size and number.",
            li2: "Enhances color and fragrance in blooms.",
            li3: "Ideal for roses, perennials, and bedding plants.",
        },
        price: 5999,
    },
    {
        id: "m46ktwulat58sa0zjrp0",
        img: "./images/hero-products/balance-mix.png",
        title: "Balance Mix",
        desc: "A fertilizer formulated to boost flower production with a higher phosphorus content to promote abundant blooming in ornamental plants and flowering shrubs.",
        highlights: {
            li1: "Increases flower size and number.",
            li2: "Enhances color and fragrance in blooms.",
            li3: "Ideal for roses, perennials, and bedding plants.",
        },
        price: 5999,
    },
    {
        id: "m46ktwulat58sa0zjrp0",
        img: "./images/hero-products/bloom-power.png",
        title: "Bloom Power",
        desc: "A fertilizer formulated to boost flower production with a higher phosphorus content to promote abundant blooming in ornamental plants and flowering shrubs.",
        highlights: {
            li1: "Increases flower size and number.",
            li2: "Enhances color and fragrance in blooms.",
            li3: "Ideal for roses, perennials, and bedding plants.",
        },
        price: 5999,
    },

]
export function renderFeaturedProducts() {
    const container = document.querySelector('.js-featured-products-container');
    let productHTML = "";
    products.forEach(product => {
        productHTML += `
              <div class="grid grid-cols-1 lg:grid-cols-2 relative bg-accent rounded-2xl shadow-xs z-10 p-3 lg:py-10 lg:pr-10 justify-center items-center max-w-[50rem]">
                  <img src="images/flower-primary-stroke.png" class="blur-xs absolute h-80 -bottom-50 -right-20" alt="" />
            <!-- Image Div -->
            <div class="image-test relative flex items-center justify-center bg-center bg-no-repeat bg-contain bg-[url(../images/Product-bg.png)]">
              <img src="${product.img}" class="h-[13rem] md:h-[15rem] xl:h-[20rem] z-[2] drop-shadow-2xl" alt="" />
            </div>
            <!-- Product Details Div -->
            <div class="flex flex-col gap-0.5 xl:gap-3 lg:pl-10 text-white">
              <h2 class="text-secondary text-[1.8rem] xs:max-sm:text-[1.45rem] max-lg:self-center font-bold whitespace-nowrap">${product.title}</h2>
              <p class="text-pretty text-sm/[135%] xl:text-lg/[110%] line-clamp-4 lg:hidden xl:block">
                ${product.desc}
              </p>
              <ul class="hidden sm:block text-sm/[120%] xl:text-lg/[100%] lg:max-xl:text-white pl-4 lg:p-0 list-disc text-secondary  lg:mt-auto xl:mt-3">
                <li class="">${product.highlights.li1}</li>
                <li class="">${product.highlights.li2}</li>
                <li class="">${product.highlights.li3}</li>
              </ul>
              <p class="text-[2rem] font-extrabold">₹ ${product.price}</p>
              <button class="rounded-lg max-w-40 bg-primary py-1.5 px-5 text-sm font-bold text-white duration-100 ease-in-out border-2 border-primary hover:border-secondary hover:text-secondary">Add to cart</button>
            </div>
          </div>
          `
    })
    container.innerHTML = productHTML;
}
