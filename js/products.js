
import {
    getProducts,
    getCategories,
    getProduct
} from "./api.js";

import {
    formatPrice,
        escapeHTML,
        showToast
} from "./utils.js";

import { addToCart } from "./cart.js";

function createProductCard(product) {

    return `
    <article class="product-card">

    <a
    href="/product/${product.id}"
    data-link
    class="product-image"
    >

    <span class="product-tag">Popular</span>

    <img
    src="${escapeHTML(product.image)}"
    alt="${escapeHTML(product.title)}"
    loading="lazy"
    decoding="async"
    >

    </a>

    <div class="product-info">

    <div class="product-category">
    ${escapeHTML(product.category)}
    </div>

    <a
    href="/product/${product.id}"
    data-link
    class="product-title"
    >
    ${escapeHTML(product.title)}
    </a>

    <div class="product-meta">

    <span class="price">
    ${formatPrice(product.price)}
    </span>

    <span class="rating">
    ★ ${Number(product.rating?.rate || 0).toFixed(1)}
    </span>

    </div>

    <button
    class="add-button"
    data-add="${product.id}"
    >
    + Add to bag
    </button>

    </div>

    </article>
    `;
}

function bindAddButtons(products) {

    document.querySelectorAll("[data-add]").forEach(button => {

        button.addEventListener("click", () => {

            const product = products.find(
                item => item.id === Number(button.dataset.add)
            );

            if (product) {
                addToCart(product);
                showToast("Added to your bag!");
            }

        });

    });

}

export async function renderHome() {

    const app = document.querySelector("#app");

    app.innerHTML = `

    <section class="hero">

    <div class="hero-copy">

    <span class="eyebrow">
    A little something for you
    </span>

    <h1>
    Find your<br>
    everyday<br>
    favourite.
    </h1>

    <p>
    Considered essentials, standout pieces,
    and clever finds to make every day
    feel a little better.
    </p>

    <a
    href="/products"
    data-link
    class="button light"
    >
    Explore the collection ↗
    </a>

    </div>


    <div class="hero-art">

    <img
        src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
        alt="Featured backpack"
        fetchpriority="high"
        decoding="async"
        onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop';"
    >

    </div>


    </section>

    <section class="container">

    <div class="section-heading">
    <div>
    <span class="eyebrow">Browse your way</span>
    <h2>Shop by category</h2>
    </div>
    </div>

    <div id="home-categories" class="category-row">
    <p>Loading categories...</p>
    </div>

    <div class="section-heading">
    <div>
    <span class="eyebrow">Handpicked for you</span>
    <h2>Popular right now</h2>
    </div>

    <a
    href="/products"
    data-link
    class="text-link"
    >
    View all products ↗
    </a>
    </div>

    <div id="featured-products" class="product-grid">
    <p>Loading products...</p>
    </div>

    <div class="promo-banner">

    <div>
    <span class="eyebrow">
    Good things are in store
    </span>

    <h2>Your next favourite is waiting.</h2>

    <p>Browse the full collection.</p>
    </div>

    <a
    href="/products"
    data-link
    class="button"
    >
    Shop all products ↗
    </a>

    </div>

    </section>
    `;

    try {

        const [products, categories] = await Promise.all([
            getProducts(),
                                                         getCategories()
        ]);

        const icons = ["✦", "◈", "◎", "✳", "◇"];

        document.querySelector("#home-categories").innerHTML =
        categories.map((category, index) => `
        <a
        class="category-tile"
        href="/products?category=${encodeURIComponent(category)}"
        data-link
        >
        <span>${icons[index % icons.length]}</span>

        <strong>
        ${escapeHTML(category.replace(/\b\w/g, c => c.toUpperCase()))}
        ↗
        </strong>
        </a>
        `).join("");

        const featured = products.slice(0, 8);

        document.querySelector("#featured-products").innerHTML =
        featured.map(createProductCard).join("");

        bindAddButtons(featured);

    } catch (error) {

        document.querySelector("#featured-products").innerHTML =
        `<div class="error-panel">${escapeHTML(error.message)}</div>`;

    }

}

export async function renderProducts() {

    const app = document.querySelector("#app");

    app.innerHTML = `

    <section class="container">

    <div class="page-title">
    <span class="eyebrow">The collection</span>
    <h1>All the good stuff.</h1>
    <p>Find something that feels just right.</p>
    </div>

    <div class="shop-toolbar">

    <input
    class="search-input"
    id="product-search"
    type="search"
    placeholder="Search the collection..."
    aria-label="Search products"
    >

    <div class="filter-group">

    <select
    class="select-input"
    id="category-filter"
    aria-label="Filter by category"
    >
    <option value="">All categories</option>
    </select>

    <select
    class="select-input"
    id="sort-filter"
    aria-label="Sort products"
    >
    <option value="featured">Featured</option>
    <option value="low">Price: low to high</option>
    <option value="high">Price: high to low</option>
    <option value="rating">Top rated</option>
    </select>

    </div>

    </div>

    <p id="results-count" class="results-count"></p>

    <div id="all-products" class="product-grid">
    <p>Loading products...</p>
    </div>

    </section>
    `;

    try {

        const [products, categories] = await Promise.all([
            getProducts(),
                                                         getCategories()
        ]);

        const categorySelect =
        document.querySelector("#category-filter");

        categorySelect.innerHTML += categories.map(category => `
        <option value="${escapeHTML(category)}">
        ${escapeHTML(category)}
        </option>
        `).join("");

        const initialCategory =
        new URLSearchParams(location.search).get("category");

        if (initialCategory) {
            categorySelect.value = initialCategory;
        }

        function updateProducts() {

            const term = document
            .querySelector("#product-search")
            .value.toLowerCase().trim();

            const category = categorySelect.value;

            const sort = document.querySelector("#sort-filter").value;

            let filtered = products.filter(product => {

                const matchesCategory =
                !category || product.category === category;

                const matchesSearch =
                `${product.title} ${product.description} ${product.category}`
                .toLowerCase()
                .includes(term);

                return matchesCategory && matchesSearch;

            });

            if (sort === "low") {
                filtered.sort((a, b) => a.price - b.price);
            }

            if (sort === "high") {
                filtered.sort((a, b) => b.price - a.price);
            }

            if (sort === "rating") {
                filtered.sort(
                    (a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)
                );
            }

            document.querySelector("#results-count").textContent =
            `Showing ${filtered.length} of ${products.length} products`;

            document.querySelector("#all-products").innerHTML =
            filtered.length
            ? filtered.map(createProductCard).join("")
            : `<div class="empty-state">
            No products found. Try another search.
            </div>`;

            bindAddButtons(filtered);

        }

        document
        .querySelector("#product-search")
        .addEventListener("input", updateProducts);

        categorySelect.addEventListener("change", updateProducts);

        document
        .querySelector("#sort-filter")
        .addEventListener("change", updateProducts);

        updateProducts();

    } catch (error) {

        document.querySelector("#all-products").innerHTML =
        `<div class="error-panel">${escapeHTML(error.message)}</div>`;

    }

}

export async function renderProductDetail(id) {

    const app = document.querySelector("#app");

    app.innerHTML = `
    <div class="page-loading">Loading product...</div>
    `;

    try {

        const product = await getProduct(id);

        app.innerHTML = `

        <section class="container">

        <div class="detail-layout">

        <div class="detail-image">

        <img
        src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.title)}"
        >

        </div>

        <div class="detail-copy">

        <span class="eyebrow">
        ${escapeHTML(product.category)}
        </span>

        <h1>${escapeHTML(product.title)}</h1>

        <div class="rating">
        ★ ${Number(product.rating?.rate || 0).toFixed(1)}
        · ${product.rating?.count || 0} reviews
        </div>

        <div class="price">
        ${formatPrice(product.price)}
        </div>

        <p>${escapeHTML(product.description)}</p>

        <div class="detail-actions">

        <button class="button" id="detail-add">
        Add to bag ↗
        </button>

        <a
        href="/products"
        data-link
        class="button secondary"
        >
        Continue shopping
        </a>

        </div>

        <p class="results-count">
        Free shipping over $75 · Easy 30-day returns
        </p>

        </div>

        </div>

        </section>
        `;

        document.querySelector("#detail-add").addEventListener(
            "click",
            () => {
                addToCart(product);
                showToast("Added to your bag!");
            }
        );

    } catch (error) {

        app.innerHTML = `
        <section class="container">
        <div class="error-panel">
        ${escapeHTML(error.message)}
        <p>
        <a href="/products" data-link class="text-link">
        Back to products
        </a>
        </p>
        </div>
        </section>
        `;

    }

}
