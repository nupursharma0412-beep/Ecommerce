import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { fetchWishlist, toggleWishlistItem } from '../state/wishlist.slice'
import Loader from '../../shared/components/Loader'

const Wishlist = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { items, loading, error, togglingIds } = useSelector(state => state.wishlist)
    const user = useSelector(state => state.auth.user)

    useEffect(() => {
        if (user) {
            dispatch(fetchWishlist())
        }
    }, [user, dispatch])

    const handleRemove = (productId) => {
        dispatch(toggleWishlistItem({ productId }))
    }

    const getProductImage = (product) => {
        if (!product) return null
        if (product.images?.[0]?.url) return product.images[0].url
        if (typeof product.images?.[0] === 'string') return product.images[0]
        return null
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F0EDE6] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B79A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-[#18181B] mb-3" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                        Sign in to view your wishlist
                    </h1>
                    <p className="text-[#6B7280] mb-6">Save your favorite items and come back to them anytime.</p>
                    <Link
                        to="/login"
                        className="inline-flex px-8 h-12 items-center rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold hover:bg-[#A48A42] transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        )
    }

    if (loading && items.length === 0) return <Loader />

    return (
        <div className="min-h-screen bg-[#F8F6F1]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="px-4 py-12 lg:py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <h1
                            className="text-4xl lg:text-5xl text-[#18181B] leading-tight mb-4"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                            Your Wishlist
                        </h1>
                        <p className="text-[#6B7280]">
                            {items.length} {items.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Wishlist Items */}
                    {items.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((item) => {
                                const product = item.product
                                if (!product) return null
                                const imageUrl = getProductImage(product)
                                const isToggling = togglingIds.includes(product._id)

                                return (
                                    <div
                                        key={product._id}
                                        className="group rounded-[28px] border border-[#E7E1D2] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-[#B79A4A] cursor-pointer"
                                    >
                                        <div
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="relative h-56 bg-[#F8F6F1] overflow-hidden"
                                        >
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={product.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-[#B79A4A] text-4xl font-light">
                                                    {product.title?.charAt(0)?.toUpperCase() || 'P'}
                                                </div>
                                            )}

                                            {/* Remove button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemove(product._id)
                                                }}
                                                disabled={isToggling}
                                                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all disabled:opacity-50"
                                            >
                                                {isToggling ? (
                                                    <svg className="animate-spin w-4 h-4 text-[#B79A4A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#B79A4A" stroke="#B79A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>

                                        <div
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="p-5"
                                        >
                                            <h3
                                                className="text-base font-semibold text-[#18181B] mb-2 line-clamp-1"
                                                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                                            >
                                                {product.title || 'Untitled Product'}
                                            </h3>

                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {product.category && (
                                                    <span className="text-[9px] uppercase tracking-[0.1em] bg-[#F8F6F1] px-2 py-0.5 rounded-full text-[#6B7280]">
                                                        {product.category}
                                                    </span>
                                                )}
                                                {product.gender && (
                                                    <span className="text-[9px] uppercase tracking-[0.1em] bg-[#F8F6F1] px-2 py-0.5 rounded-full text-[#6B7280]">
                                                        {product.gender}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-[#E7E1D2] pt-3">
                                                <p className="text-lg font-semibold text-[#18181B]">
                                                    ₹{Number(product.price?.amount || product.price || 0).toFixed(2)}
                                                </p>
                                                <button className="text-xs font-medium text-[#B79A4A] hover:text-[#A48A42] transition-colors">
                                                    View Details →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        !loading && (
                            <div className="rounded-[30px] border border-[#E7E1D2] bg-white p-16 text-center">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F0EDE6] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B79A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </div>
                                <p className="text-xl font-semibold text-[#18181B] mb-3">Your wishlist is empty</p>
                                <p className="text-[#6B7280] mb-6">Start saving your favorite items by clicking the heart icon.</p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="px-8 h-12 rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold hover:bg-[#A48A42] transition-colors"
                                >
                                    Browse Products
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default Wishlist