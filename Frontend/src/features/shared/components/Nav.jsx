import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const wishlistItems = useSelector(state => state.wishlist?.items)
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Handle search submission - navigates to /products?search=query
    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    // Gender navigation links
    const genderLinks = [
        { label: 'Men', path: '/category/men' },
        { label: 'Women', path: '/category/women' },
        { label: 'Unisex', path: '/category/unisex' },
    ]

    return (
        <>
            {/* Main Navbar */}
            <nav className="px-8 lg:px-16 xl:px-24 pt-6 pb-4 flex items-center justify-between border-b border-[#e4e2df]">
                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden transition-colors hover:text-[#C9A96E]"
                    aria-label="Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1b1c1a' }}>
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                {/* Improved Clothy Logo */}
                <Link 
                    to="/" 
                    className="flex items-center gap-2 group"
                >
                    <div className="w-8 h-8 rounded-lg bg-[#C9A96E] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                    </div>
                    <span 
                        className="text-lg font-semibold tracking-[0.2em] uppercase"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a', letterSpacing: '0.15em' }}
                    >
                        Clothy
                    </span>
                </Link>

                {/* Search Bar - visible on larger screens */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-xs w-full">
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full h-9 pl-9 pr-3 rounded-full border border-[#E7E1D2] bg-[#F8F6F1] text-xs focus:outline-none focus:border-[#C9A96E] transition-colors"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
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
                </form>

                <div className="flex gap-5 items-center text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                    {/* Desktop nav links */}
                    <Link to="/products" className="hidden md:block transition-colors hover:text-[#C9A96E]">
                        Shop All
                    </Link>

                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => navigate('/products')}
                        className="md:hidden transition-colors hover:text-[#C9A96E]"
                        aria-label="Search products"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1b1c1a' }}>
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>

                    {user ? (
                        <>
                            {/* Wishlist Heart Icon */}
                            <Link
                                to="/wishlist"
                                className="relative flex items-center hover:opacity-70 transition-opacity"
                                style={{ color: '#1b1c1a' }}
                                aria-label="Wishlist"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                {wishlistItems?.length > 0 && (
                                    <span
                                        className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                        style={{
                                            backgroundColor: '#C9A96E',
                                            width: '16px',
                                            height: '16px',
                                            fontSize: '9px',
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 600,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart Icon */}
                            <Link
                                to="/cart"
                                className="relative flex items-center hover:opacity-70 transition-opacity"
                                style={{ color: '#1b1c1a' }}
                                aria-label="Shopping cart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                {cartItems?.length > 0 && (
                                    <span
                                        className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                        style={{
                                            backgroundColor: '#C9A96E',
                                            width: '16px',
                                            height: '16px',
                                            fontSize: '9px',
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 600,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        {cartItems.length > 9 ? '9+' : cartItems.length}
                                    </span>
                                )}
                            </Link>

                            <span className="hidden md:block" style={{ color: '#1b1c1a' }}>{user.fullname}</span>
                            {user.role === 'seller' && (
                                <Link to="/seller/dashboard" className="hidden md:block transition-colors hover:text-[#C9A96E]">Dashboard</Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="transition-colors hover:text-[#C9A96E]">Sign In</Link>
                            <Link to="/register" className="transition-colors hover:text-[#C9A96E]">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Gender Navigation Bar - Below main nav */}
            <div className="hidden md:flex px-8 lg:px-16 xl:px-24 py-3 items-center justify-center gap-10 border-b border-[#f0ede6] bg-white">
                {genderLinks.map((link) => (
                    <Link
                        key={link.label}
                        to={link.path}
                        className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#7A6E63] hover:text-[#C9A96E] transition-colors duration-200 relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[2px] after:bg-[#C9A96E] after:transition-all hover:after:w-full"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden px-8 pb-6 pt-4 border-b border-[#f0ede6] bg-white">
                    <div className="flex flex-col gap-4">
                        {/* Mobile Gender Links */}
                        {genderLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xs uppercase tracking-[0.2em] font-medium text-[#7A6E63] hover:text-[#C9A96E] transition-colors py-1"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs uppercase tracking-[0.2em] font-medium text-[#7A6E63] hover:text-[#C9A96E] transition-colors py-1"
                        >
                            Shop All
                        </Link>
                        {user?.role === 'seller' && (
                            <Link
                                to="/seller/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xs uppercase tracking-[0.2em] font-medium text-[#C9A96E] transition-colors py-1"
                            >
                                Seller Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Nav