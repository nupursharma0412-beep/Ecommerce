import axios from 'axios'

const wishlistApiInstance = axios.create({
    baseURL: "/api/wishlist",
    withCredentials: true
})

export const getWishlist = async () => {
    const response = await wishlistApiInstance.get("/")
    return response.data
}

export const addToWishlist = async (productId, variantId = null) => {
    const response = await wishlistApiInstance.post(`/add/${productId}`, { variantId })
    return response.data
}

export const removeFromWishlist = async (productId, variantId = null) => {
    const params = variantId ? `?variantId=${variantId}` : ''
    const response = await wishlistApiInstance.delete(`/remove/${productId}${params}`)
    return response.data
}

export const toggleWishlist = async (productId, variantId = null) => {
    const response = await wishlistApiInstance.post(`/toggle/${productId}`, { variantId })
    return response.data
}

export const checkWishlist = async (productId) => {
    const response = await wishlistApiInstance.get(`/check/${productId}`)
    return response.data
}