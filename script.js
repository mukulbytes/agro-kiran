import { renderHeader, navToggle, toggleUserActions } from "./components/header.js";
import { renderHighlights } from "./components/keyhighlights.js";

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderHighlights();
    toggleUserActions();
    let icon = document.getElementById("icon");
    let black = document.getElementById("black");
    icon.addEventListener('click', navToggle);
    black.addEventListener('click', navToggle);
})
