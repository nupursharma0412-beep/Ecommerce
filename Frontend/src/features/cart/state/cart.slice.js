import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],

    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        
            increamentCartItem: (state, action) => {
                const { productId, variantId } = action.payload

                const item = state.items.find(
                    item => item.product._id === productId && item.variant === variantId
                )

                if (item) item.quantity += 1
            }
        
    }
})

export const { setItems, addItem, increamentCartItem } = cartSlice.actions

export default cartSlice.reducer