
import {
    getCart,
    saveCart,
    formatPrice,
        escapeHTML
} from "./utils.js";

import { showToast } from "./utils.js";

export function addToCart(product) {

    const cart = getCart();

    const existing = cart.find(
        item => item.id === product.id
    );

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });

    }

    saveCart(cart);

}

export function changeQuantity(id, amount) {

    const cart = getCart()
    .map(item => {

        if (item.id === id) {
            return {
                ...item,
                quantity: item.quantity + amount
            };
        }

        return item;

    })
    .filter(item => item.quantity > 0);

    saveCart(cart);

}

export function removeFromCart(id) {

    const cart = getCart().filter(
        item => item.id !== id
    );

    saveCart(cart);

}

export function cartTotals() {

    const cart = getCart();

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
                                 0
    );

    const shipping =
    subtotal === 0 || subtotal >= 75 ? 0 : 6.99;

    return {
        cart,
        subtotal,
        shipping,
        total: subtotal + shipping
    };

}

export function renderCart() {

    const app = document.querySelector("#app");

    const {
        cart,
        subtotal,
        shipping,
        total
    } = cartTotals();

    app.innerHTML = `

    <section class="container">

    <div class="page-title">

    <span class="eyebrow">Your picks</span>

    <h1>Your shopping bag.</h1>

    <p>
    ${cart.reduce((sum, item) => sum + item.quantity, 0)}
    items in your bag
    </p>

    </div>

    ${
        cart.length

        ? `

        <div class="cart-layout">

        <div id="cart-items">

        ${cart.map(item => `

            <article class="cart-item">

            <img
            src="${escapeHTML(item.image)}"
            alt="${escapeHTML(item.title)}"
            >

            <div>

            <h3>
            ${escapeHTML(item.title)}
            </h3>

            <p>
            ${formatPrice(item.price)} each
            </p>

            <div class="quantity-control">

            <button
            data-minus="${item.id}"
            aria-label="Decrease quantity"
            >
            −
            </button>

            <strong>${item.quantity}</strong>

            <button
            data-plus="${item.id}"
            aria-label="Increase quantity"
            >
            +
            </button>

            </div>

            <button
            class="remove-button"
            data-remove="${item.id}"
            >
            Remove
            </button>

            </div>

            <strong>
            ${formatPrice(item.price * item.quantity)}
            </strong>

            </article>

            `).join("")}

            </div>

            <aside class="summary-card">

            <h2>Order summary</h2>

            <div class="summary-line">
            <span>Subtotal</span>
            <strong>${formatPrice(subtotal)}</strong>
            </div>

            <div class="summary-line">
            <span>Shipping</span>
            <strong>
            ${shipping === 0 ? "Free" : formatPrice(shipping)}
            </strong>
            </div>

            <div class="summary-line summary-total">
            <span>Total</span>
            <strong>${formatPrice(total)}</strong>
            </div>

            <p class="results-count">
            ${
                subtotal >= 75
                ? "You've unlocked free shipping."
                : "Free shipping on orders over $75."
            }
            </p>

            <a
            href="/checkout"
            data-link
            class="button"
            >
            Continue to checkout ↗
            </a>

            <a
            href="/products"
            data-link
            class="text-link"
            >
            Continue shopping
            </a>

            </aside>

            </div>

            `

            : `

            <div class="empty-state">

            <h2>Your bag is empty.</h2>

            <p>Find something lovely to add to it.</p>

            <a
            href="/products"
            data-link
            class="button"
            >
            Explore products ↗
            </a>

            </div>

            `
    }

    </section>

    `;

    document.querySelectorAll("[data-plus]").forEach(button => {

        button.addEventListener("click", () => {

            changeQuantity(Number(button.dataset.plus), 1);
            renderCart();

        });

    });

    document.querySelectorAll("[data-minus]").forEach(button => {

        button.addEventListener("click", () => {

            changeQuantity(Number(button.dataset.minus), -1);
            renderCart();

        });

    });

    document.querySelectorAll("[data-remove]").forEach(button => {

        button.addEventListener("click", () => {

            removeFromCart(Number(button.dataset.remove));
            renderCart();
            showToast("Item removed");

        });

    });

}

export function renderCheckout() {

    const app = document.querySelector("#app");

    const {
        cart,
        subtotal,
        shipping,
        total
    } = cartTotals();

    if (!cart.length) {

        app.innerHTML = `
        <section class="container">
        <div class="empty-state">
        <h1>Your bag is empty.</h1>
        <a href="/products" data-link class="button">
        Shop now
        </a>
        </div>
        </section>
        `;

        return;

    }

    app.innerHTML = `

    <section class="container">

    <div class="page-title">
    <span class="eyebrow">Almost yours</span>
    <h1>Checkout.</h1>
    <p>
    Demonstration checkout. No payment will be collected.
    </p>
    </div>

    <div class="checkout-layout">

    <form id="checkout-form" class="form-card">

    <h2>Delivery details</h2>

    <div class="form-grid">

    <div class="form-field">
    <label for="first-name">First name</label>
    <input
    class="form-input"
    id="first-name"
    name="firstName"
    required
    autocomplete="given-name"
    >
    </div>

    <div class="form-field">
    <label for="last-name">Last name</label>
    <input
    class="form-input"
    id="last-name"
    name="lastName"
    required
    autocomplete="family-name"
    >
    </div>

    <div class="form-field full">
    <label for="email">Email address</label>
    <input
    class="form-input"
    id="email"
    name="email"
    type="email"
    required
    autocomplete="email"
    >
    </div>

    <div class="form-field full">
    <label for="address">Street address</label>
    <input
    class="form-input"
    id="address"
    name="address"
    required
    autocomplete="street-address"
    >
    </div>

    <div class="form-field">
    <label for="city">City</label>
    <input
    class="form-input"
    id="city"
    name="city"
    required
    autocomplete="address-level2"
    >
    </div>

    <div class="form-field">
    <label for="postal">Postal code</label>
    <input
    class="form-input"
    id="postal"
    name="postal"
    required
    autocomplete="postal-code"
    >
    </div>

    </div>

    <button class="button" type="submit">
    Place demo order ↗
    </button>

    </form>

    <aside class="summary-card">

    <h2>Your order</h2>

    ${cart.map(item => `

        <div class="summary-line">

        <span>
        ${escapeHTML(item.title.slice(0, 35))}
        × ${item.quantity}
        </span>

        <strong>
        ${formatPrice(item.price * item.quantity)}
        </strong>

        </div>

        `).join("")}

        <div class="summary-line">
        <span>Subtotal</span>
        <strong>${formatPrice(subtotal)}</strong>
        </div>

        <div class="summary-line">
        <span>Shipping</span>
        <strong>
        ${shipping === 0 ? "Free" : formatPrice(shipping)}
        </strong>
        </div>

        <div class="summary-line summary-total">
        <span>Total</span>
        <strong>${formatPrice(total)}</strong>
        </div>

        </aside>

        </div>

        </section>

        `;

        document.querySelector("#checkout-form").addEventListener(
            "submit",
            event => {

                event.preventDefault();

                if (!event.currentTarget.reportValidity()) {
                    return;
                }

                const orderId =
                "SS-" + Date.now().toString().slice(-8);

                localStorage.removeItem("shopsphere-cart");

                saveCart([]);

                app.innerHTML = `

                <section class="container success-panel">

                <div class="success-icon">✓</div>

                <span class="eyebrow">Order confirmed</span>

                <h1>Thanks for your order!</h1>

                <p>
                Your demo order
                <strong>${orderId}</strong>
                has been placed successfully.
                </p>

                <p class="results-count">
                This is a portfolio demonstration.
                No payment or shipment has been initiated.
                </p>

                <a
                href="/products"
                data-link
                class="button"
                >
                Keep exploring ↗
                </a>

                </section>

                `;

            }
        );

}
