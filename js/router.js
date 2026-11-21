
import {
    renderHome,
    renderProducts,
    renderProductDetail
} from "./products.js";

import {
    renderCart,
    renderCheckout
} from "./cart.js";

import { renderAbout } from "./utils.js";

export function navigate(path) {

    history.pushState({}, "", path);

    route();

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

}

export async function route() {

    const path = decodeURI(location.pathname);

    document.querySelectorAll("[data-link]").forEach(link => {

        const href = link.getAttribute("href");

        const active =
        href === "/"
        ? path === "/"
        : href === "/products"
        ? path.startsWith("/products")
        : href === "/about"
        ? path === "/about"
        : false;

        link.classList.toggle("active", active);

    });

    if (path === "/") {
        return renderHome();
    }

    if (path === "/products") {
        return renderProducts();
    }

    if (path.startsWith("/product/")) {
        return renderProductDetail(path.split("/")[2]);
    }

    if (path === "/cart") {
        return renderCart();
    }

    if (path === "/checkout") {
        return renderCheckout();
    }

    if (path === "/about") {
        return renderAbout();
    }

    document.querySelector("#app").innerHTML = `

    <section class="container">

    <div class="empty-state">

    <h1>Page not found</h1>

    <p>
    The page you are looking for does not exist.
    </p>

    <a href="/" data-link class="button">
    Return home
    </a>

    </div>

    </section>

    `;

}
