import { loggedIn, renderHeader, toggleUserActions } from "./components/header.js";

document.addEventListener('DOMContentLoaded', () => {
    // renderHeader();
    toggleUserActions(loggedIn);
})