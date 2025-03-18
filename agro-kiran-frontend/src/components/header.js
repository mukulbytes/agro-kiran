import brandLogo from '../assets/agro-kiran-dark.png';
import { cart } from '../data/cart';

export let loggedIn = false;

export function toggleUserActions() {
  const loginSignup = document.querySelector('.js-ls-btns');
  const userMenu = document.querySelector('.js-user-menu');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (token && user) {
    userMenu.classList.remove('hidden');
    userMenu.classList.add('flex');
    loginSignup.classList.remove('flex');
    loginSignup.classList.add('hidden');
    
    // Add profile link
    userMenu.href = '/profile.html';
  } else {
    userMenu.classList.remove('flex');
    userMenu.classList.add('hidden');
    loginSignup.classList.remove('hidden');
    loginSignup.classList.add('flex');
  }
}

function navToggle() {
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
  const headerElement = document.querySelector('.js-header-content');

  const headerContentHTML = `
      <!-- Spacer -->
      <div class="h-20 bg-primary"></div>

      <!-- Header Navigation -->
      <header class="fixed top-0 right-0 left-0 z-10 w-full py-[15px] px-[35px] text-[1.05rem] bg-primary h-20 shadow-2xl">
        <nav class="flex justify-between items-center">
          <!-- Logo -->
          <a class="" href="/index.html">
          <img class="w-[60px] duration-170 hover:scale-105" src="${brandLogo}" alt="-brand-logo" />
          </a>
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
          <a href="/checkout.html" class="mr-4 hidden md:flex items-center">
            <span class="relative size-3 ${cart.length ? "flex" : "hidden"}">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75 -top-2.5 left-2.5"></span>
              <span class="relative inline-flex size-3 rounded-full bg-secondary -top-2.5 left-2.5"></span>
            </span>
            <i class="fa-solid fa-cart-shopping text-white text-[20px]"></i>
          </a>

          <!-- Login Signup -->
          <div class="hidden md:flex gap-2 items-center justify-center">
            <!-- Buttons -->
            <div class="js-ls-btns flex gap-2">
              <a href="/login.html" class="user-actions bg-white text-primary hover:bg-transparent">Login</a>
              <a href="/signup.html" class="user-actions text-white">Sign Up</a>
            </div>
            <!-- User Menu -->
            <a class="js-user-menu relative hidden justify-center items-center border-2 border-white rounded-full size-[28px]" href="">
              <i class="fa-solid fa-user text-white text-[12px]"></i>
            </a>
          </div>
        </nav>
      </header>

      <!-- Hamburger Icon -->
      <button
        class="flex justify-center fixed size-[35px] right-9 top-6 z-[10000] cursor-pointer rounded-lg duration-100 ease-in-out bg-transparent border-0 hover:shadow md:hidden"
        id="icon"
        aria-label="Hamburger menu button"
      >
        <div class="icon-1 icons" id="a"></div>
        <div class="icon-2 icons" id="b"></div>
        <div class="icon-3 icons" id="c"></div>
      </button>

      <!-- Hamburger Navigation -->
      <aside
        class="md:hidden fixed z-[15] top-0 right-0 h-screen w-0 opacity-0 duration-500 delay-100 ease-[--cubic-bez] bg-primary text-white"
        id="nav"
      >
        <nav class="flex flex-col">
          <!-- Header -->
          <div class="flex justify-between items-center border-b-2 h-20 border-secondary p-2 pr-10 text-xl font-medium tracking-widest">
            AGRO KIRAN
          </div>

          <!-- Nav Links -->
          <ul class="flex flex-col gap-5 justify-center mt-2 p-3 text-[1rem] tracking-wider">
             <li>
              <a class="nav-links ${currentPage === '/index.html' || currentPage === '/' ? 'text-secondary font-bold' : ''}" href="/index.html">Home</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/shop.html' ? 'text-secondary font-bold' : ''}" href="/shop.html">Shop</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/about.html' ? 'text-secondary font-bold' : ''}" href="/about.html">About</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/contact.html' ? 'text-secondary font-bold' : ''}" href="/contact.html">Contact</a>
            </li>
          </ul>

          <!-- User Action -->
          <div class="flex gap-2 items-center border-t-2 border-t-secondary mt-5 pt-5">
            <!-- Cart -->
            <a href="/checkout.html" class="mr-4 flex items-center">
              <span class="relative size-3 ${cart.length ? "flex" : "hidden"}">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75 -top-2.5 left-2.5"></span>
                <span class="relative inline-flex size-3 rounded-full bg-secondary -top-2.5 left-2.5"></span>
              </span>
              <i class="fa-solid fa-cart-shopping text-white text-[20px]"></i>
            </a>
            <!-- Buttons -->
            <div class="js-ls-btns flex gap-2">
              <a href="/login.html" class="user-actions bg-white text-primary hover:bg-transparent">Login</a>
              <a href="/signup.html" class="user-actions text-white">Sign Up</a>
            </div>

            <!-- User Menu -->
            <a class="js-user-menu relative hidden justify-center items-center border-2 border-white rounded-full size-[28px]" href="">
              <i class="fa-solid fa-user text-white text-[12px]"></i>
            </a>
          </div>
        </nav>
      </aside>

      <!-- Hamburger Black Alpha BG -->
      <div class="fixed top-0 left-0 bg-black/50 h-screen w-0 duration-500 delay-75 ease-[--cubic-bez] z-[14] opacity-0 md:hidden" id="black"></div>
    `;
  headerElement.innerHTML = headerContentHTML;
  let icon = document.getElementById("icon");
  let black = document.getElementById("black");
  icon.addEventListener('click', navToggle);
  black.addEventListener('click', navToggle);

  // Call toggleUserActions after rendering
  toggleUserActions();
}