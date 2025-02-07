export function renderHeader() {
    const headerElement = document.querySelector('.js-header');
    const headerHTML = `
     <nav class="nav-container">
        <object
          data="images/AgroKiranLogo.svg"
          type="image/svg+xml"
          class="logo-container"
        ></object>

        <ul class="nav-links">
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">Shop</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        <div class="user-actions">
          <a href="" class="login user">Login</a>
          <a href="" class="sign-up user">Sign Up</a>
        </div>
      </nav>
    `;
    headerElement.innerHTML = headerHTML;
}