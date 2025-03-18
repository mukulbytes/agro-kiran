import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { API_CONFIG } from "../config/api.js";

function displayProfile(user) {
    const profileContent = document.getElementById('profile-content');
    profileContent.innerHTML = `
        <div class="mb-4">
            <label class="text-gray-600 text-sm">Name</label>
            <p class="text-primary text-lg font-semibold">${user.name}</p>
        </div>
        <div class="mb-4">
            <label class="text-gray-600 text-sm">Email</label>
            <p class="text-primary text-lg">${user.email}</p>
        </div>
    `;
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/login.html';
        return;
    }

    displayProfile(user);

    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}); 