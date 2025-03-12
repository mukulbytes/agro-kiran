import brandLogo from '../assets/agro-kiran-dark.png';

export let loggedIn = false;

export function toggleUserActions(loggedIn) {
  const loginSignup = document.querySelector('.js-ls-btns');
  const userMenu = document.querySelector('.js-user-menu');
  if (loggedIn) {
    userMenu.classList.remove('hidden');
    userMenu.classList.add('flex');
    loginSignup.classList.remove('flex');
    loginSignup.classList.add('hidden');
  }
}

export function navToggle() {
  let icon1 = document.getElementById("a");
  let icon2 = document.getElementById("b");
  let icon3 = document.getElementById("c");
  let nav = document.getElementById('nav');
  let black = document.getElementById("black");

  icon1.classList.toggle('a');
  icon2.classList.toggle('c');
  icon3.classList.toggle('b');
  nav.classList.toggle('show');
  black.classList.toggle('slide');
};

export function renderHeader() {
  const currentPage = window.location.pathname;
  const headerElement = document.querySelector('.js-header');
  const headerHTML = `
      <nav class="flex justify-between items-center">
        <!-- Logo -->
        <img class="w-[60px] duration-170 hover:scale-105" src="${brandLogo}" alt="-brand-logo" />
        <!-- Nav Links -->
        <ul class="hidden md:flex gap-8 text-white ml-20 flex-1 justify-center h-max">
          <li>
            <a class="nav-links ${currentPage === '/index.html' || currentPage === '/' ? 'active-li-header' : ''}" href="/index.html">Home</a>
          </li>
          <li>
            <a class="nav-links ${currentPage === '/shop.html' ? 'active-li-header' : ''}" href="/shop.html">Shop</a>
          </li>
          <li>
            <a class="nav-links ${currentPage === '/about.html' ? 'active-li-header' : ''}" href="/about.html">About</a>
          </li>
          <li>
            <a class="nav-links ${currentPage === '/contact.html' ? 'active-li-header' : ''}" href="/contact.html">Contact</a>
          </li>
        </ul>
        <!-- Cart Icon -->
        <div class="mr-4 hidden md:flex items-center">
          <span class="relative flex size-3">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75 -top-2.5 left-2.5"></span>
            <span class="relative inline-flex size-3 rounded-full bg-secondary -top-2.5 left-2.5"></span>
          </span>
          <i class="fa-solid fa-cart-shopping text-white text-[20px]"></i>
        </div>

        <!-- Login Signup -->
        <div class="hidden md:flex gap-2 items-center justify-center">
          <!-- Buttons -->
          <div class="js-ls-btns flex gap-2">
            <a href="" class="user-actions bg-white text-primary hover:bg-transparent">Login</a>
            <a href="" class="user-actions text-white">Sign Up</a>
          </div>
          <!-- User Menu -->
          <a class="js-user-menu relative hidden justify-center items-center border-2 border-white rounded-full size-[28px]" href="">
            <i class="fa-solid fa-user text-white text-[12px]"></i>
          </a>
        </div>
      </nav>
    `;
  headerElement.innerHTML = headerHTML;
}