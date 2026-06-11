import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWishlist, toggleWishlistItem, clearWishlistError } from '../state/wishlist.slice'

export const useWishlist = () => {
    const dispatch = useDispatch()
    const { items, wishlistedIds, loading, error, togglingIds } = useSelector(state => state.wishlist)

    const handleFetchWishlist = useCallback(() => {
        dispatch(fetchWishlist())
    }, [dispatch])

    const handleToggleWishlist = useCallback((productId, variantId = null) => {
        dispatch(toggleWishlistItem({ productId, variantId }))
    }, [dispatch])

    const isProductWishlisted = useCallback((productId) => {
        return wishlistedIds.includes(productId)
    }, [wishlistedIds])

    const isProductToggling = useCallback((productId) => {
        return togglingIds.includes(productId)
    }, [togglingIds])

    const handleClearError = useCallback(() => {
        dispatch(clearWishlistError())
    }, [dispatch])

    return {
        wishlistItems: items,
        wishlistedIds,
        loading,
        error,
        togglingIds,
        handleFetchWishlist,
        handleToggleWishlist,
        isProductWishlisted,
        isProductToggling,
        handleClearError
    }
}