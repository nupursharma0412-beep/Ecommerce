import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData)
    return response.data
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller")
    return response.data
}

/**
 * Get all products with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 15)
 */
export async function getAllProducts(page = 1, limit = 15) {
    const response = await productApiInstance.get(`/?page=${page}&limit=${limit}`)
    return response.data
}

/**
 * Get a single product by ID
 */
export async function getProductById(productId) {
    const response = await productApiInstance.get(`/detail/${productId}`)
    return response.data
}

/**
 * Search products by keyword
 * @param {string} keyword - Search term
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
export async function searchProductsApi(keyword, page = 1, limit = 15) {
    const response = await productApiInstance.get(`/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`)
    return response.data
}

/**
 * Filter products with multiple criteria
 * @param {Object} filters - { category, gender, minPrice, maxPrice }
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
export async function filterProductsApi(filters = {}, page = 1, limit = 15) {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.gender) params.append('gender', filters.gender)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    params.append('page', page)
    params.append('limit', limit)

    const response = await productApiInstance.get(`/filter?${params.toString()}`)
    return response.data
}

/**
 * Get products by category
 */
export async function getProductsByCategoryApi(category, page = 1, limit = 15) {
    const response = await productApiInstance.get(`/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`)
    return response.data
}

/**
 * Get products by gender
 */
export async function getProductsByGenderApi(gender, page = 1, limit = 15) {
    const response = await productApiInstance.get(`/gender/${encodeURIComponent(gender)}?page=${page}&limit=${limit}`)
    return response.data
}

export async function addProductVariant(productId, newProductVariant) {
    console.log(newProductVariant)

    const formData = new FormData()

    newProductVariant.images.forEach((image) => {
        formData.append(`images`, image.file)
    })

    formData.append("stock", newProductVariant.stock)
    formData.append("priceAmount", newProductVariant.price)
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiInstance.post(`/${productId}/variants`, formData)

    return response.data
}

/**
 * Update a product
 */
export async function updateProductApi(productId, formData) {
    const response = await productApiInstance.put(`/${productId}`, formData)
    return response.data
}