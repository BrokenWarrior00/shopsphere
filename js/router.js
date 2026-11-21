
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
    const newPath = path.startsWith("#")
    ? path.slice(1)
    : path;

    const hash = "#" + (newPath.startsWith("/")
    ? newPath
    : "/" + newPath);

    if (location.hash === hash) {
        route();
    } else {
        location.hash = hash;
    }

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
}

export async function route() {

    const path = decodeURI(
        location.hash.slice(1) || "/"
    );

    document.querySelectorAll("[data-link]").forEach(link => {

        const href = link.getAttribute("href");

        const active =
        href === "/" && path === "/"
        ? true
        : href === "/products" && path.startsWith("/products")
        ? true
        : href === "/about" && path === "/about"
        ? true
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

window.addEventListener("hashchange", route);
