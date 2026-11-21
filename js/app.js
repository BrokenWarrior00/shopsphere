
import { route, navigate } from "./router.js";

import {
    saveCart,
    getCart,
    showToast
} from "./utils.js";

document.addEventListener("click", event => {

    const link = event.target.closest("a[data-link]");

    if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return;
    }

    const url = new URL(link.href, location.href);

    if (url.origin !== location.origin) {
        return;
    }

    event.preventDefault();

    navigate(url.pathname + url.search);

});

window.addEventListener("popstate", route);

document.querySelector("#year").textContent =
new Date().getFullYear();

saveCart(getCart());

document
.querySelector("#newsletter-form")
.addEventListener("submit", event => {

    event.preventDefault();

    document.querySelector("#newsletter-message").textContent =
    "Thanks for subscribing! (Demo only)";

    event.currentTarget.reset();

    showToast("Thanks for joining us!");

});

route();
