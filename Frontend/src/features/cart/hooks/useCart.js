import { addItem, getCart , increamentCartItemApi , decreamentCartItemApi, removeCartItemApi } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { addItem as addItemToCart, setItems , increamentCartItem , decreamentCartItem, removeCartItem } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {

        const data = await addItem({ productId, variantId })
        return data

    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setItems(data.cart.items))
    }

    async function handleIncreamentCartItem({ productId, variantId }) {
        const data = await increamentCartItemApi({ productId, variantId })
        dispatch(increamentCartItem({ productId, variantId }))
    }

    async function handleDecreamentCartItem({ productId, variantId }) {
        const data = await decreamentCartItemApi({ productId, variantId })
        dispatch(decreamentCartItem({ productId, variantId }))
    }
    async function handleRemoveCartItem({ productId, variantId }) {
        const data = await removeCartItemApi({ productId, variantId })
        dispatch(removeCartItem({ productId, variantId }))
    }

    return {
        handleAddItem,
        handleGetCart,
        handleIncreamentCartItem,
        handleDecreamentCartItem,
        handleRemoveCartItem
    }
}

