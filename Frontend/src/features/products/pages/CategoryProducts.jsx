import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { fetchProductsByCategory, fetchProductsByGender } from '../states/product.slice'
import Loader from '../../shared/components/Loader'

const GENDERS = ['men', 'women', 'unisex', 'kids']

const CategoryProducts = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { category } = useParams()

    const { products, totalProducts, totalPages, currentPage, loading, error } = useSelector(state => state.product)
    const [page, setPage] = useState(1)

    // Determine if this is a gender-based filter or category-based filter
    const isGenderFilter = GENDERS.includes(category?.toLowerCase())
    const isCategoryFilter = !isGenderFilter

    useEffect(() => {
        if (category) {
            setPage(1)
            if (isGenderFilter) {
                // Use gender endpoint for /category/men, /category/women, etc.
                const gender = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
                dispatch(fetchProductsByGender({ gender, page: 1, limit: 15 }))
            } else {
                // Use category endpoint for /category/shirts, /category/shoes, etc.
                dispatch(fetchProductsByCategory({ category, page: 1, limit: 15 }))
            }
        }
    }, [category, dispatch, isGenderFilter])

    const handlePageChange = useCallback((newPage) => {
        if (newPage < 1 || newPage > totalPages) return
        setPage(newPage)
        if (isGenderFilter) {
            const gender = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
            dispatch(fetchProductsByGender({ gender, page: newPage, limit: 15 }))
        } else {
            dispatch(fetchProductsByCategory({ category, page: newPage, limit: 15 }))
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [totalPages, category, dispatch, isGenderFilter])

    const getProductImage = (product) => {
        if (!product) return null
        if (product.images?.[0]?.url) return product.images[0].url
        if (typeof product.images?.[0] === 'string') return product.images[0]
        return null
    }

    // Capitalize display name
    const displayName = category
        ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
        : ''

    if (loading && products.length === 0) return <Loader />

    if (error) {
        return (
            <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl font-semibold text-[#18181B] mb-3">Something went wrong</p>
                    <p className="text-[#6B7280]">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8F6F1]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="px-4 py-12 lg:py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Category Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <button
                                onClick={() => navigate('/products')}
                                className="text-sm text-[#6B7280] hover:text-[#B79A4A] transition-colors"
                            >
                                ← All Products
                            </button>
                        </div>
                        <h1
                            className="text-4xl lg:text-5xl text-[#18181B] leading-tight mb-4"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                            {isGenderFilter ? `${displayName}'s Collection` : displayName}
                        </h1>
                        <p className="text-[#6B7280]">
                            {totalProducts || 0} product{totalProducts !== 1 ? 's' : ''} in {isGenderFilter ? `${displayName}'s` : displayName}
                        </p>
                    </div>

                    {/* Products Grid */}
                    {products?.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => {
                                const imageUrl = getProductImage(product)
                                return (
                                    <div
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        key={product._id}
                                        className="group rounded-[28px] border border-[#E7E1D2] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-[#B79A4A] cursor-pointer"
                                    >
                                        <div className="relative h-56 bg-[#F8F6F1] overflow-hidden">
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
                                        </div>

                                        <div className="p-5">
                                            <h3
                                                className="text-base font-semibold text-[#18181B] mb-2 line-clamp-1"
                                                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                                            >
                                                {product.title || 'Untitled Product'}
                                            </h3>

                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {isCategoryFilter && product.gender && (
                                                    <span className="text-[9px] uppercase tracking-[0.1em] bg-[#F8F6F1] px-2 py-0.5 rounded-full text-[#6B7280]">
                                                        {product.gender}
                                                    </span>
                                                )}
                                                {isGenderFilter && product.category && (
                                                    <span className="text-[9px] uppercase tracking-[0.1em] bg-[#F8F6F1] px-2 py-0.5 rounded-full text-[#6B7280]">
                                                        {product.category}
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
                                <p className="text-xl font-semibold text-[#18181B] mb-3">No products found in {displayName}</p>
                                <p className="text-[#6B7280] mb-6">Check back soon for new arrivals.</p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="px-8 h-12 rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold hover:bg-[#A48A42] transition-colors"
                                >
                                    Browse All Products
                                </button>
                            </div>
                        )
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="w-10 h-10 rounded-xl border border-[#E7E1D2] bg-white flex items-center justify-center text-sm disabled:opacity-50 hover:border-[#B79A4A] transition-colors"
                            >
                                ←
                            </button>
                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                let pageNum
                                if (totalPages <= 7) {
                                    pageNum = i + 1
                                } else if (currentPage <= 4) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 3) {
                                    pageNum = totalPages - 6 + i
                                } else {
                                    pageNum = currentPage - 3 + i
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-xl border text-sm font-medium transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-[#B79A4A] text-white border-[#B79A4A]'
                                                : 'bg-white text-[#6B7280] border-[#E7E1D2] hover:border-[#B79A4A]'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="w-10 h-10 rounded-xl border border-[#E7E1D2] bg-white flex items-center justify-center text-sm disabled:opacity-50 hover:border-[#B79A4A] transition-colors"
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CategoryProducts