
const API = "https://fakestoreapi.com";

let productsCache = null;

export async function getProducts() {

    if (productsCache) {
        return productsCache;
    }

    const response = await fetch(`${API}/products`);

    if (!response.ok) {
        throw new Error("Unable to load products.");
    }

    productsCache = await response.json();

    return productsCache;
}

export async function getProduct(id) {

    const response = await fetch(
        `${API}/products/${encodeURIComponent(id)}`
    );

    if (!response.ok) {
        throw new Error("Product not found.");
    }

    return response.json();
}

export async function getCategories() {

    const response = await fetch(
        `${API}/products/categories`
    );

    if (!response.ok) {
        throw new Error("Unable to load categories.");
    }

    return response.json();
}
