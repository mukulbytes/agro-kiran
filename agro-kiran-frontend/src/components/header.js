import brandLogo from '../assets/agro-kiran-dark.png';
import { userService } from '../services/userService.js';
import { clearAuthData, isAuthenticated } from '../utils/auth.js';
import { showToast } from '../utils/toast.js';

// Handle logout
function handleLogout() {
  clearAuthData();
  showToast('Logged out successfully', 'success');
  window.location.href = 'index.html';
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

export async function renderHeader() {
  const currentPage = window.location.pathname;
  const headerElement = document.querySelector('.js-header-content');
  const cart = await userService.getCart();

  const headerContentHTML = `
      <!-- Spacer -->
      <div class="h-20 bg-primary"></div>

      <!-- Header Navigation -->
      <header class="fixed top-0 right-0 left-0 z-50 w-full py-[15px] px-[35px] text-[1.05rem] bg-primary h-20 shadow-2xl">
        <nav class="flex justify-between items-center">
          <!-- Logo -->
          <a class="" href="index.html">
          <img class="w-[60px] duration-170 hover:scale-105" src="${brandLogo}" alt="-brand-logo" />
          </a>
          <!-- Nav Links -->
          <ul class="hidden md:flex gap-8 text-white ml-20 flex-1 justify-center h-max">
            <li>
              <a class="nav-links ${currentPage === '/index.html' || currentPage === '/' ? 'active-li-header' : ''}" href="index.html">Home</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/shop.html' ? 'active-li-header' : ''}" href="shop.html">Shop</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/chat.html' ? 'active-li-header' : ''}" href="chat.html">AI-Chat</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/about.html' ? 'active-li-header' : ''}" href="about.html">About</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/contact.html' ? 'active-li-header' : ''}" href="contact.html">Contact</a>
            </li>
          </ul>
          <!-- Cart Icon -->
          <a href="checkout.html" class="mr-3 hidden md:flex items-center">
            <span class="relative size-3 ${cart.length ? "flex" : "hidden"}">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75 -top-2.5 left-2.5"></span>
              <span class="relative inline-flex size-3 rounded-full bg-secondary -top-2.5 left-2.5"></span>
            </span>
            <i class="fa-solid fa-cart-shopping text-white text-[20px]"></i>
          </a>

          <!-- Login Signup -->
          <div class="hidden md:flex gap-2 items-center justify-center">
            <!-- Login/Signup Buttons -->
            <div class="${isAuthenticated() ? 'hidden' : 'flex'} gap-2">
              <a href="login.html" class="user-actions bg-white text-primary  hover:bg-transparent">Login</a>
              <a href="signup.html" class="user-actions text-white">Sign Up</a>
            </div>
            <!-- Profile/Logout Buttons -->
            <div class="relative ${isAuthenticated() ? 'flex' : 'hidden'} gap-2">
              <a class="flex user-actions size-[28px]" href="/profile.html">
                <i class="fa-solid fa-user text-white text-[12px]"></i>
              </a>
              <!-- Logout Button -->
              <button class="js-logout-btn user-actions text-white">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
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
        class="md:hidden fixed z-50 top-0 right-0 h-screen w-0 opacity-0 duration-500 delay-100 ease-[--cubic-bez] bg-primary text-white"
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
              <a class="nav-links ${currentPage === '/index.html' || currentPage === '/' ? 'text-secondary font-bold' : ''}" href="index.html">Home</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/shop.html' ? 'text-secondary font-bold' : ''}" href="shop.html">Shop</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/chat.html' ? 'text-secondary font-bold' : ''}" href="chat.html">AI-Chat</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/about.html' ? 'text-secondary font-bold' : ''}" href="about.html">About</a>
            </li>
            <li>
              <a class="nav-links ${currentPage === '/contact.html' ? 'text-secondary font-bold' : ''}" href="contact.html">Contact</a>
            </li>
          </ul>

          <!-- User Action -->
          <div class="flex gap-2 items-center justify-between border-t-2 border-t-secondary mt-5 p-2 pt-5">
            <!-- Cart -->
            <a href="checkout.html" class="flex items-center">
              <span class="relative size-3 ${cart.length ? "flex" : "hidden"}">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75 -top-2.5 left-2.5"></span>
                <span class="relative inline-flex size-3 rounded-full bg-secondary -top-2.5 left-2.5"></span>
              </span>
              <i class="fa-solid fa-cart-shopping text-white text-[20px]"></i>
              <span class="text-white ml-2 font-medium">Cart</span>
            </a>
            <!-- Buttons -->
            <div class="${isAuthenticated() ? 'hidden' : 'flex'}  gap-2">
              <a href="login.html" class="user-actions  bg-white text-primary hover:bg-transparent">Login</a>
              <a href="signup.html" class="user-actions text-white">Sign Up</a>
            </div>

            <!-- Profile/Logout Buttons-->
            <div class="relative ${isAuthenticated() ? 'flex' : 'hidden'} gap-1">
              <a class="flex user-actions" href="/profile.html">
                <i class="fa-solid fa-user text-white text-[12px]"></i>
                <span class="text-white ml-2 font-medium">Profile</span>
              </a>
            <!-- Logout Button -->
            <button class="js-mobile-logout-btn flex user-actions text-white">
              <i class="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Hamburger Black Alpha BG -->
      <div class="fixed top-0 left-0 bg-black/50 h-screen w-0 duration-500 delay-75 ease-[--cubic-bez] z-49 opacity-0 md:hidden" id="black"></div>
    `;
  headerElement.innerHTML = headerContentHTML;
  let icon = document.getElementById("icon");
  let black = document.getElementById("black");
  icon.addEventListener('click', navToggle);
  black.addEventListener('click', navToggle);

  // Add logout event listener
  const logoutBtn = document.querySelector('.js-logout-btn');
  const mobileLogoutBtn = document.querySelector('.js-mobile-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', handleLogout);
  }
}