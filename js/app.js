
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

    const href = link.getAttribute("href");

    event.preventDefault();

    if (href.startsWith("#")) {
        navigate(href);
    } else {
        const url = new URL(href, location.href);
        navigate(url.pathname);
    }

});

document.querySelector("#year").textContent =
new Date().getFullYear();

saveCart(getCart());

const newsletterForm =
document.querySelector("#newsletter-form");

if (newsletterForm) {

    newsletterForm.addEventListener("submit", event => {

        event.preventDefault();

        const message =
        document.querySelector("#newsletter-message");

        if (message) {
            message.textContent =
            "Thanks for subscribing! (Demo only)";
        }

        event.currentTarget.reset();

        showToast("Thanks for joining us!");

    });

}

route();
