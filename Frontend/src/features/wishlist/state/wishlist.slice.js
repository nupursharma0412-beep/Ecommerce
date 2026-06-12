import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as wishlistApi from '../services/wishlist.api'
import { toast } from 'react-toastify'

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const data = await wishlistApi.getWishlist()
            return data.wishlist
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist')
        }
    }
)

export const toggleWishlistItem = createAsyncThunk(
    'wishlist/toggleItem',
    async ({ productId, variantId = null }, { rejectWithValue }) => {
        try {
            const data = await wishlistApi.toggleWishlist(productId, variantId)
            return { wishlist: data.wishlist, isWishlisted: data.isWishlisted, productId }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle wishlist')
        }
    }
)

const initialState = {
    items: [],
    wishlistedIds: [],
    loading: false,
    error: null,
    togglingIds: [] // track which products are being toggled
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        clearWishlistError: (state) => {
            state.error = null
        },
        setWishlistedIds: (state, action) => {
            state.wishlistedIds = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload?.items || []
                state.wishlistedIds = (action.payload?.items || []).map(item => item.product?._id || item.product)
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(toggleWishlistItem.pending, (state, action) => {
                const productId = action.meta.arg.productId
                if (!state.togglingIds.includes(productId)) {
                    state.togglingIds.push(productId)
                }
            })
            .addCase(toggleWishlistItem.fulfilled, (state, action) => {
                const { wishlist, isWishlisted, productId } = action.payload
                state.items = wishlist?.items || []
                state.togglingIds = state.togglingIds.filter(id => id !== productId)

                if (isWishlisted) {
                    if (!state.wishlistedIds.includes(productId)) {
                        state.wishlistedIds.push(productId)
                    }
                    toast.success("Added to wishlist")
                } else {
                    state.wishlistedIds = state.wishlistedIds.filter(id => id !== productId)
                    toast.success("Removed from wishlist")
                }
            })
            .addCase(toggleWishlistItem.rejected, (state, action) => {
                const productId = action.meta.arg.productId
                state.togglingIds = state.togglingIds.filter(id => id !== productId)
                state.error = action.payload
                toast.error(action.payload || "Failed to toggle wishlist")
            })
    }
})

export const { clearWishlistError, setWishlistedIds } = wishlistSlice.actions
export default wishlistSlice.reducer