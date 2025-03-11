export function renderFooter() {
    const footerContainer = document.querySelector(".js-footer");
    const footerHTML = `
    <!-- Logo -->
      <div class="flex h-full md:h-1/2 lg:pl-10 items-center xs:max-md:hidden">
        <img src="images/agro-kiran-dark.png" class="h-20" alt="" />
      </div>
      <!-- Customer Support -->
      <div class="flex justify-center flex-col">
        <h2 class="font-bold text-white text-lg mb-3 underline decoration-secondary decoration-5 underline-offset-6 max-xs:whitespace-nowrap">
          Customer Support
        </h2>
        <ul class="text-white text-sm flex flex-col justify-center gap-2.5">
          <li><a class="footer-links" href="">Track Your Order</a></li>
          <li><a class="footer-links" href="">Refunds and Returns</a></li>
          <li><a class="footer-links" href="">Terms and Conditions</a></li>
          <li><a class="footer-links" href="">Privacy Policy</a></li>
        </ul>
      </div>
      <!-- Quick Links -->
      <div class="flex justify-center flex-col">
        <h2 class="font-bold text-white text-lg mb-3 underline decoration-secondary decoration-5 underline-offset-6">Quick Links</h2>
        <ul class="text-white text-sm flex flex-col justify-center gap-2.5">
          <li><a class="footer-links" href="">Home</a></li>
          <li><a class="footer-links" href="">Shop</a></li>
          <li><a class="footer-links" href="">About</a></li>
          <li><a class="footer-links" href="">Contact us</a></li>
        </ul>
      </div>
      <!-- Contact Details -->
      <div>
        <h2 class="font-bold text-white text-lg mb-3 underline decoration-secondary decoration-5 underline-offset-6">Contact Details</h2>
        <ul class="text-white text-sm flex flex-col justify-center gap-2.5">
          <li><span class="font-bold text-secondary">Email: </span>support@agrokiran.com</li>
          <li class="max-w-[300px]">
            <span class="font-bold text-secondary">Address: </span>G-24, Race Course Tower, Race Course Circle,Vadodara, Gujarat, 390015, India
          </li>
          <li><span class="font-bold text-secondary">Helpline: </span>1800 0000 00</li>
        </ul>
      </div>
    `;
    footerContainer.innerHTML = footerHTML;

}