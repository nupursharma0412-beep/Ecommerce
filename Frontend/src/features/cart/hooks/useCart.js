import { addItem, getCart , increamentCartItemApi , decreamentCartItemApi, removeCartItemApi } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { addItem as addItemToCart, setItems , increamentCartItem , decreamentCartItem, removeCartItem } from "../state/cart.slice"
import { toast } from "react-toastify"

export const useCart = () => {
    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        try {
            const data = await addItem({ productId, variantId })
            toast.success("Item added to cart!")
            return data
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add item to cart")
            throw error
        }
    }

    async function handleGetCart() {
        try {
            const data = await getCart()
            dispatch(setItems(data.cart.items))
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load cart")
        }
    }

    async function handleIncreamentCartItem({ productId, variantId }) {
        try {
            const data = await increamentCartItemApi({ productId, variantId })
            dispatch(increamentCartItem({ productId, variantId }))
            toast.success("Quantity increased")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity")
        }
    }

    async function handleDecreamentCartItem({ productId, variantId }) {
        try {
            const data = await decreamentCartItemApi({ productId, variantId })
            dispatch(decreamentCartItem({ productId, variantId }))
            toast.success("Quantity decreased")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity")
        }
    }
    async function handleRemoveCartItem({ productId, variantId }) {
        try {
            const data = await removeCartItemApi({ productId, variantId })
            dispatch(removeCartItem({ productId, variantId }))
            toast.success("Item removed from cart")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item")
        }
    }

    return {
        handleAddItem,
        handleGetCart,
        handleIncreamentCartItem,
        handleDecreamentCartItem,
        handleRemoveCartItem
    }
}

