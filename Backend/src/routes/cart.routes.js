import express from 'express'
import {authenticateUser } from '../middlewares/auth.middleware.js'
import { validateAddToCart, validateIncrementCartItemQuantity } from '../validators/cart.validator.js'
import { addToCart,getCart, increamentCartItemQuantity } from '../controllers/cart.controller.js'

const router = express.Router()



router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart , addToCart)

router.get("/" , authenticateUser, getCart)

router.patch("/quantity/increament/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity,increamentCartItemQuantity)
export default router
