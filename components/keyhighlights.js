const keyHighlights = [{
  icon: "images/icons/Icon-Smart-Nutrition-Dark.png",
  alt: "smart-nutrition-icon",
  heading: "Smart Nutrition",
  content: "AI-powered recommendations ensure precise fertilizers for crops and growth stages."

},
{
  icon: "images/icons/Icon-Certified-Quality-Dark.png",
  alt: "certified-quality-icon",
  heading: "Certified Quality",
  content: "Compliant with FCO & BIS, lab-tested for purity, effectiveness, and safety."
},
{
  icon: "images/icons/Icon-Easy-Application-Dark.png",
  alt: "easy-application-icon",
  heading: "Easy Application",
  content: "Available in granular, liquid, and foliar forms for hassle-free usage."
},
{
  icon: "images/icons/Icon-Diverse-Range-Dark.png",
  alt: "diverse-range-icon",
  heading: "Diverse Range",
  content: "Organic, inorganic, slow-release, and specialty fertilizers in various forms."
}
]
export function renderHighlights() {
  const highlightsContainer = document.querySelector('.js-key-highlights-container');

  let highlightHTML = "";
  keyHighlights.forEach(item => {
    highlightHTML +=
      `<div class="z-3 bg-amber-100 max-w-75 rounded-xl shadow-2xl flex flex-col text-center gap-2 text-black  duration-200 ease-in-out hover:-translate-y-1 overflow-clip">
            <div class="upper relative bg-accent w-[100%] py-3 flex justify-center items-center overflow-clip">
              <img src="${item.icon}" class="z-2 size-15 drop-shadow-md duration-200 ease-in-out hover:-translate-y-1 hover:drop-shadow-2xl" alt="${item.alt}" />
              <img
                src="images/hero-Animated.png"
                class="absolute size-25 -right-10 -top-10 motion-safe:animate-[spin_20s_linear_infinite_forwards] drop-shadow-md"
                alt=""
              />
              <img
                src="images/hero-Animated.png"
                class="absolute size-25 -left-10 -bottom-10 motion-safe:animate-[spin_20s_linear_infinite_forwards] drop-shadow-md"
                alt=""
              />
            </div>
            <div class="content px-1 sm:px-3 mb-5 flex flex-col ">
              <p class="text-sm xs:text-xl sm:text-2xl font-quicksand whitespace-nowrap font-bold smart-text">${item.heading}</p>
              <p class="text-xs/[90%] xs:text-sm/[90%] sm:text-lg/[120%]">${item.content}</p>
            </div>
          </div>`
    highlightsContainer.innerHTML = highlightHTML;
  })

}