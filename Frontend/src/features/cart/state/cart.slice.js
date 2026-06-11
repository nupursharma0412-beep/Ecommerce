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
            },
            decreamentCartItem: (state, action) => {
                const { productId, variantId } = action.payload

                const itemIndex = state.items.findIndex(
                    item => item.product._id === productId && item.variant === variantId
                )

                if (itemIndex !== -1) {
                    const item = state.items[itemIndex]
                    if (item.quantity > 1) {
                        item.quantity -= 1
                    } else {
                        // Remove the item when quantity would become 0
                        state.items.splice(itemIndex, 1)
                    }
                }
            },
            removeCartItem: (state, action) => {
                const { productId, variantId } = action.payload 
                state.items = state.items.filter(
                    item => !(item.product._id === productId && item.variant === variantId)
                )
            }
            
        
    }
})

export const { setItems, addItem, increamentCartItem , decreamentCartItem, removeCartItem } = cartSlice.actions

export default cartSlice.reducer