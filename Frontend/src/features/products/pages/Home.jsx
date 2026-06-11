import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../states/product.slice'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import Loader from '../../shared/components/Loader'

const Home = () => {
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector(state => state.product)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchProducts({ page: 1, limit: 15 }))
    }, [dispatch])

    const getProductImage = (product) => {
        if (!product) return null
        if (product.images?.[0]?.url) return product.images[0].url
        if (typeof product.images?.[0] === 'string') return product.images[0]
        return null
    }

    // Split products into sections (re-use same products with different labels for now)
    const featuredProducts = products?.slice(0, 5) || []
    const latestProducts = products?.slice(0, 8) || []
    const trendingProducts = products?.slice(2, 10) || []

    const ProductCard = ({ product }) => {
        const imageUrl = getProductImage(product)
        return (
            <div
                onClick={() => navigate(`/product/${product._id}`)}
                className="group rounded-[28px] border border-[#E7E1D2] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-[#B79A4A] cursor-pointer"
            >
                <div className="relative h-64 bg-[#F8F6F1] overflow-hidden">
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
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h3
                            className="text-lg font-semibold text-[#18181B] line-clamp-2"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                            {product.title || 'Untitled Product'}
                        </h3>
                    </div>

                    <p className="text-sm leading-6 text-[#6B7280] mb-5 line-clamp-2">
                        {product.description || 'No description available.'}
                    </p>

                    {/* Category & Gender badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {product.category && (
                            <span className="text-[10px] uppercase tracking-[0.1em] bg-[#F8F6F1] px-2 py-1 rounded-full text-[#6B7280]">
                                {product.category}
                            </span>
                        )}
                        {product.gender && (
                            <span className="text-[10px] uppercase tracking-[0.1em] bg-[#F8F6F1] px-2 py-1 rounded-full text-[#6B7280]">
                                {product.gender}
                            </span>
                        )}
                    </div>

                    <div className="mb-6 flex items-center justify-between border-t border-[#E7E1D2] pt-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#B79A4A] mb-1 font-medium">
                                Price
                            </p>
                            <p className="text-xl font-semibold text-[#18181B]">
                                ₹{Number(product.price?.amount || product.price || 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#71717A] mb-1 font-medium">
                                Currency
                            </p>
                            <span className="inline-flex rounded-full bg-[#F8F6F1] px-3 py-1 text-xs font-medium text-[#6B7280]">
                                {product.price?.currency || 'INR'}
                            </span>
                        </div>
                    </div>

                    <button className="w-full h-12 rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold transition-all duration-300 hover:bg-[#A48A42] shadow-[0_8px_20px_rgba(183,154,74,0.25)] hover:shadow-[0_12px_30px_rgba(183,154,74,0.35)]">
                        View Details
                    </button>
                </div>
            </div>
        )
    }

    if (loading && products.length === 0) {
        return <Loader />
    }

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
            {/* Hero Section */}
            <div className="bg-linear-to-br from-[#18181B] to-[#2D2D2D] text-white px-4 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl">
                        <p className="uppercase tracking-[0.4em] text-xs text-[#B79A4A] font-medium mb-4">
                            Discover Fashion
                        </p>
                        <h1
                            className="text-5xl lg:text-6xl leading-tight mb-6"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                            Curated Collections
                        </h1>
                        <p className="text-lg text-gray-300 leading-8 max-w-2xl">
                            Browse a handpicked selection of premium fashion items from talented sellers. Find timeless pieces that celebrate your individual style.
                        </p>
                    </div>
                </div>
            </div>

            {/* Loading Skeleton */}
            {loading && products.length > 0 && (
                <div className="px-4 py-8 text-center">
                    <p className="text-[#B79A4A]">Updating products...</p>
                </div>
            )}

            {/* Featured Products Section */}
            {featuredProducts.length > 0 && (
                <div className="px-4 py-16 lg:py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <p className="uppercase tracking-[0.35em] text-xs text-[#B79A4A] font-medium mb-4">
                                    Curated Selection
                                </p>
                                <h2
                                    className="text-4xl lg:text-5xl text-[#18181B] leading-tight"
                                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                                >
                                    Featured Products
                                </h2>
                            </div>
                            <Link
                                to="/products"
                                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#B79A4A] hover:text-[#A48A42] transition-colors"
                            >
                                View More
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <div className="mt-10 text-center sm:hidden">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold transition-all duration-300 hover:bg-[#A48A42]"
                            >
                                View All Products
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Latest Products Section */}
            {latestProducts.length > 0 && (
                <div className="px-4 py-16 lg:py-20 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <p className="uppercase tracking-[0.35em] text-xs text-[#B79A4A] font-medium mb-4">
                                    Fresh Arrivals
                                </p>
                                <h2
                                    className="text-4xl lg:text-5xl text-[#18181B] leading-tight"
                                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                                >
                                    Latest Products
                                </h2>
                            </div>
                            <Link
                                to="/products"
                                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#B79A4A] hover:text-[#A48A42] transition-colors"
                            >
                                View More
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {latestProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <div className="mt-10 text-center sm:hidden">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold transition-all duration-300 hover:bg-[#A48A42]"
                            >
                                View All Products
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Trending Products Section */}
            {trendingProducts.length > 0 && (
                <div className="px-4 py-16 lg:py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <p className="uppercase tracking-[0.35em] text-xs text-[#B79A4A] font-medium mb-4">
                                    Popular Picks
                                </p>
                                <h2
                                    className="text-4xl lg:text-5xl text-[#18181B] leading-tight"
                                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                                >
                                    Trending Products
                                </h2>
                            </div>
                            <Link
                                to="/products"
                                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[#B79A4A] hover:text-[#A48A42] transition-colors"
                            >
                                View More
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {trendingProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <div className="mt-10 text-center sm:hidden">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#B79A4A] text-white text-sm font-semibold transition-all duration-300 hover:bg-[#A48A42]"
                            >
                                View All Products
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* No Products Fallback */}
            {!loading && products.length === 0 && (
                <div className="px-4 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="rounded-[30px] border border-[#E7E1D2] bg-white p-16 text-center">
                            <p className="text-xl font-semibold text-[#18181B] mb-3">No products available</p>
                            <p className="text-[#6B7280]">Check back soon for new curated fashion items.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home