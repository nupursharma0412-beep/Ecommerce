import React, { useState } from 'react'
import { useProduct } from '../hook/useProduct'
import { useNavigate } from 'react-router'

const CATEGORIES = ['Shirts', 'Shoes', 'Watches', 'Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Other']
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids']

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct()
 const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
        category: 'Other',
        gender: 'Unisex',
        quantity: '1',
        images: []
    })
    const [imagePreviews, setImagePreviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        const remainingSlots = 7 - imagePreviews.length
        const filesToAdd = files.slice(0, remainingSlots)

        if (files.length > remainingSlots) {
            setError(`You can only upload up to 7 images. ${remainingSlots} slots remaining.`)
            setTimeout(() => setError(''), 3000)
        }

        // Create previews
        const newPreviews = filesToAdd.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))

        setImagePreviews(prev => [...prev, ...newPreviews])
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...filesToAdd]
        }))
    }

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index].preview)
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        

        try {
            // Validate required fields
            if (!formData.title.trim()) {
                setError('Product title is required')
                setLoading(false)
                return
            }
            if (!formData.description.trim()) {
                setError('Product description is required')
                setLoading(false)
                return
            }
            if (!formData.priceAmount) {
                setError('Price amount is required')
                setLoading(false)
                return
            }
            if (imagePreviews.length === 0) {
                setError('At least one product image is required')
                setLoading(false)
                return
            }

            // Create FormData for multipart submission
            const submitData = new FormData()
            submitData.append('title', formData.title)
            submitData.append('description', formData.description)
            submitData.append('priceAmount', formData.priceAmount)
            submitData.append('priceCurrency', formData.priceCurrency)
            submitData.append('category', formData.category)
            submitData.append('gender', formData.gender)
            submitData.append('quantity', formData.quantity)

            // Append images
            formData.images.forEach((image, index) => {
                submitData.append(`images`, image)
            })

            await handleCreateProduct(submitData)
            navigate('/seller/dashboard')
        } catch (err) {
            setError(err.message || 'Failed to create product. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F6F1]" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* Main Container */}
            <div className="max-w-3xl mx-auto px-8 lg:px-12 py-12 lg:py-16">
                
                {/* Header Section */}
                <div className="mb-12">
                    <p className="uppercase tracking-[0.25em] text-xs text-[#B79A4A] font-medium mb-4">
                        Add New Item
                    </p>
                    <h1
                        className="text-4xl lg:text-5xl text-[#18181B] mb-3"
                        style={{
                            fontFamily: "Cormorant Garamond, serif",
                        }}
                    >
                        Create Product
                    </h1>
                    <p className="text-[#71717A] text-[15px]">
                        Share your unique fashion item with our community
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Product Title */}
                    <div>
                        <label htmlFor="title" className="block mb-3 text-sm text-[#444] font-medium">
                            Product Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter product title"
                            className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"
                        />
                    </div>

                    {/* Product Description */}
                    <div>
                        <label htmlFor="description" className="block mb-3 text-sm text-[#444] font-medium">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your product in detail"
                            rows={6}
                            className="w-full rounded-2xl border border-[#E7E1D2] bg-white px-5 py-4 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10 resize-none"
                        />
                    </div>

                    {/* Category & Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block mb-3 text-sm text-[#444] font-medium">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10 appearance-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B79A4A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="gender" className="block mb-3 text-sm text-[#444] font-medium">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10 appearance-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B79A4A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                {GENDERS.map((gen) => (
                                    <option key={gen} value={gen}>{gen}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price Section & Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <label htmlFor="priceAmount" className="block mb-3 text-sm text-[#444] font-medium">
                                Price Amount
                            </label>
                            <input
                                type="number"
                                id="priceAmount"
                                name="priceAmount"
                                value={formData.priceAmount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"
                            />
                        </div>
                        <div>
                            <label htmlFor="priceCurrency" className="block mb-3 text-sm text-[#444] font-medium">
                                Currency
                            </label>
                            <select
                                id="priceCurrency"
                                name="priceCurrency"
                                value={formData.priceCurrency}
                                onChange={handleInputChange}
                                className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10 appearance-none"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B79A4A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="JPY">JPY</option>
                                <option value="AUD">AUD</option>
                                <option value="CAD">CAD</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block mb-3 text-sm text-[#444] font-medium">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                placeholder="1"
                                min="0"
                                className="w-full h-14 rounded-2xl border border-[#E7E1D2] bg-white px-5 text-[15px] outline-none transition-all focus:border-[#B79A4A] focus:ring-4 focus:ring-[#B79A4A]/10"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block mb-4 text-sm text-[#444] font-medium">
                            Product Images ({imagePreviews.length}/7)
                        </label>
                        
                        {/* Upload Area */}
                        <div className="mb-6">
                            <label className="flex items-center justify-center w-full px-6 py-12 border-2 border-dashed border-[#E7E1D2] rounded-2xl cursor-pointer hover:border-[#B79A4A] hover:bg-[#FAF8F4] transition-colors">
                                <div className="text-center">
                                    <svg className="mx-auto h-10 w-10 text-[#B79A4A] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <p className="text-sm text-[#444]">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-[#999] mt-2">
                                        PNG, JPG, GIF up to 10MB each
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={imagePreviews.length >= 7}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-40 object-cover rounded-2xl border border-[#E7E1D2]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-[#B79A4A] text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#9d8340]"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 px-6 bg-[#B79A4A] text-white font-medium rounded-2xl hover:bg-[#9d8340] disabled:bg-[#CCCCCC] disabled:cursor-not-allowed transition-colors text-[15px] font-semibold"
                        >
                            {loading ? 'Creating Product...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProduct