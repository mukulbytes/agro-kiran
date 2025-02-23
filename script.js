import { renderHeader, navToggle, toggleUserActions } from "./components/header.js";

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    toggleUserActions();
    let icon = document.getElementById("icon");
    let black = document.getElementById("black");
    icon.addEventListener('click', navToggle);
    black.addEventListener('click', navToggle);
})
