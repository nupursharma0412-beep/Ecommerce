import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router'
import { fetchProducts, searchProductsThunk, filterProductsThunk, setSearchKeyword } from '../states/product.slice'
import Loader from '../../shared/components/Loader'

const CATEGORIES = ['Shirts', 'Shoes', 'Watches', 'Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Beauty', 'Sports', 'Books']
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids']
const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
]

const Products = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const { products, totalProducts, totalPages, currentPage, loading, error, searchKeyword } = useSelector(state => state.product)

    // Local state for filters
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedGender, setSelectedGender] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [sortBy, setSortBy] = useState('newest')
    const [showFilters, setShowFilters] = useState(false)
    const [page, setPage] = useState(1)

    // Read search param from URL on mount
    useEffect(() => {
        const searchFromUrl = searchParams.get('search')
        if (searchFromUrl) {
            setSearchInput(searchFromUrl)
            dispatch(setSearchKeyword(searchFromUrl))
            dispatch(searchProductsThunk({ keyword: searchFromUrl, page: 1, limit: 15 }))
        } else {
            dispatch(fetchProducts({ page: 1, limit: 15 }))
        }
    }, [])

    // Handle search
    const handleSearch = useCallback((e) => {
        e?.preventDefault()
        if (searchInput.trim()) {
            dispatch(setSearchKeyword(searchInput.trim()))
            dispatch(searchProductsThunk({ keyword: searchInput.trim(), page: 1, limit: 15 }))
            setSearchParams({ search: searchInput.trim() })
            setPage(1)
        }
    }, [searchInput, dispatch, setSearchParams])

    // Handle filter application
    const handleApplyFilters = useCallback(() => {
        setPage(1)
        const filters = {}
        if (selectedCategory) filters.category = selectedCategory
        if (selectedGender) filters.gender = selectedGender
        if (minPrice) filters.minPrice = minPrice
        if (maxPrice) filters.maxPrice = maxPrice

        if (Object.keys(filters).length > 0) {
            dispatch(filterProductsThunk({ filters, page: 1, limit: 15 }))
        } else {
            dispatch(fetchProducts({ page: 1, limit: 15 }))
        }
    }, [selectedCategory, selectedGender, minPrice, maxPrice, dispatch])

    // Handle pagination
    const handlePageChange = useCallback((newPage) => {
        if (newPage < 1 || newPage > totalPages) return
        setPage(newPage)

        if (searchKeyword) {
            dispatch(searchProductsThunk({ keyword: searchKeyword, page: newPage, limit: 15 }))
        } else if (selectedCategory || selectedGender || minPrice || maxPrice) {
            const filters = {}
            if (selectedCategory) filters.category = selectedCategory
            if (selectedGender) filters.gender = selectedGender
            if (minPrice) filters.minPrice = minPrice
            if (maxPrice) filters.maxPrice = maxPrice
            dispatch(filterProductsThunk({ filters, page: newPage, limit: 15 }))
        } else {
            dispatch(fetchProducts({ page: newPage, limit: 15 }))
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [totalPages, searchKeyword, selectedCategory, selectedGender, minPrice, maxPrice, dispatch])

    // Handle sort
    const handleSort = useCallback((value) => {
        setSortBy(value)
        let sorted = [...products]
        switch (value) {
            case 'price-low':
                sorted.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0))
                break
            case 'price-high':
                sorted.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0))
                break
            case 'oldest':
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                break
            case 'newest':
            default:
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
        }
        // We dispatch to set products but keep pagination meta
        dispatch({ type: 'product/setProducts', payload: sorted })
    }, [products, dispatch])

    // Clear all filters
    const handleClearFilters = useCallback(() => {
        setSelectedCategory('')
        setSelectedGender('')
        setMinPrice('')
        setMaxPrice('')
        setSearchInput('')
        setSortBy('newest')
        setPage(1)
        dispatch(setSearchKeyword(''))
        dispatch(fetchProducts({ page: 1, limit: 15 }))
        setSearchParams({})
    }, [dispatch, setSearchParams])

    const getProductImage = (product) => {
        if (!product) return null
        if (product.images?.[0]?.url) return product.images[0].url
        if (typeof product.images?.[0] === 'string') return product.images[0]
        return null
    }

    if (loading && products.length === 0) return <Loader />

    return (
        <div className="min-h-screen bg-[#F8F6F1]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="px-4 py-12 lg:py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-10">
                        <h1
                            className="text-4xl lg:text-5xl text-[#18181B] leading-tight mb-4"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                            {searchKeyword ? `Search: "${searchKeyword}"` : 'All Products'}
                        </h1>
                        <p className="text-[#6B7280]">{totalProducts || 0} products found</p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="mb-8 space-y-4">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full h-12 pl-12 pr-4 rounded-2xl border border-[#E7E1D2] bg-white text-sm focus:outline-none focus:border-[#B79A4A] transition-colors"
                                />
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                className="px-6 h-12 rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold hover:bg-[#A48A42] transition-colors"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 h-12 rounded-2xl border text-sm font-medium transition-colors ${
                                    showFilters
                                        ? 'bg-[#B79A4A] text-white border-[#B79A4A]'
                                        : 'bg-white text-[#6B7280] border-[#E7E1D2] hover:border-[#B79A4A]'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" y1="21" x2="4" y2="14" />
                                    <line x1="4" y1="10" x2="4" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12" y2="3" />
                                    <line x1="20" y1="21" x2="20" y2="16" />
                                    <line x1="20" y1="12" x2="20" y2="3" />
                                    <line x1="1" y1="14" x2="7" y2="14" />
                                    <line x1="9" y1="8" x2="15" y2="8" />
                                    <line x1="17" y1="16" x2="23" y2="16" />
                                </svg>
                            </button>
                        </form>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="bg-white rounded-2xl border border-[#E7E1D2] p-6">
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-[0.2em] text-[#6B7280] mb-2 font-medium">
                                            Category
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full h-10 rounded-xl border border-[#E7E1D2] bg-white px-3 text-sm focus:outline-none focus:border-[#B79A4A]"
                                        >
                                            <option value="">All Categories</option>
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Gender Filter */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-[0.2em] text-[#6B7280] mb-2 font-medium">
                                            Gender
                                        </label>
                                        <select
                                            value={selectedGender}
                                            onChange={(e) => setSelectedGender(e.target.value)}
                                            className="w-full h-10 rounded-xl border border-[#E7E1D2] bg-white px-3 text-sm focus:outline-none focus:border-[#B79A4A]"
                                        >
                                            <option value="">All Genders</option>
                                            {GENDERS.map((gen) => (
                                                <option key={gen} value={gen}>{gen}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-[0.2em] text-[#6B7280] mb-2 font-medium">
                                            Min Price
                                        </label>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            placeholder="₹0"
                                            className="w-full h-10 rounded-xl border border-[#E7E1D2] bg-white px-3 text-sm focus:outline-none focus:border-[#B79A4A]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-[0.2em] text-[#6B7280] mb-2 font-medium">
                                            Max Price
                                        </label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            placeholder="₹99999"
                                            className="w-full h-10 rounded-xl border border-[#E7E1D2] bg-white px-3 text-sm focus:outline-none focus:border-[#B79A4A]"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={handleApplyFilters}
                                        className="px-8 h-10 rounded-xl bg-[#B79A4A] text-white text-sm font-semibold hover:bg-[#A48A42] transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-8 h-10 rounded-xl border border-[#E7E1D2] text-sm text-[#6B7280] hover:border-[#B79A4A] transition-colors"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sort & Results Info */}
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-sm text-[#6B7280]">
                            {loading && <span className="text-[#B79A4A]">Updating...</span>}
                        </p>
                        <div className="flex items-center gap-3">
                            <label className="text-xs uppercase tracking-[0.2em] text-[#6B7280] font-medium">Sort:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSort(e.target.value)}
                                className="h-9 rounded-xl border border-[#E7E1D2] bg-white px-3 text-xs focus:outline-none focus:border-[#B79A4A]"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
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
                                <p className="text-xl font-semibold text-[#18181B] mb-3">No products found</p>
                                <p className="text-[#6B7280] mb-6">Try adjusting your search or filter criteria.</p>
                                <button
                                    onClick={handleClearFilters}
                                    className="px-8 h-12 rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold hover:bg-[#A48A42] transition-colors"
                                >
                                    Clear Filters
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

export default Products