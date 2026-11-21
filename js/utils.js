
export const formatPrice = value =>
new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
}).format(Number(value) || 0);

export const escapeHTML = value =>
String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
})[char]);

export const getCart = () => {
    try {
        return JSON.parse(localStorage.getItem("shopsphere-cart")) || [];
    } catch {
        return [];
    }
};

export const saveCart = cart => {
    localStorage.setItem("shopsphere-cart", JSON.stringify(cart));

    const count = cart.reduce(
        (total, item) => total + item.quantity,
                              0
    );

    const counter = document.querySelector("#cart-count");

    if (counter) {
        counter.textContent = count;
    }
};

export function showToast(message) {
    const toast = document.querySelector("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

export function renderAbout() {
    document.querySelector("#app").innerHTML = `
    <section class="container">

    <div class="about-panel">

    <span class="eyebrow">A little about us</span>

    <h1>
    Good design.
    Useful things.
    Everyday joy.
    </h1>

    <p>
    ShopSphere is a concept storefront created
    to demonstrate a complete frontend shopping
    experience. Browse our sample catalog,
    discover product details, and try the
    shopping bag and demo checkout.
    </p>

    <a href="/products" data-link class="button">
    Explore the collection ↗
    </a>

    </div>

    <div class="section-heading">
    <div>
    <span class="eyebrow">Made for this project</span>
    <h2>Built with modern web fundamentals</h2>
    </div>
    </div>

    <p class="results-count">
    HTML5 · CSS3 · JavaScript Modules · Fetch API
    · History API · localStorage
    </p>

    </section>
    `;
}
