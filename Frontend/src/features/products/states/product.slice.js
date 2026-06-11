import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProducts, searchProductsApi, filterProductsApi, getProductsByCategoryApi, getProductsByGenderApi, getProductById } from '../services/product.api.js';

// Async thunks
export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    async ({ page = 1, limit = 15 } = {}, { rejectWithValue }) => {
        try {
            const data = await getAllProducts(page, limit);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'product/fetchProductById',
    async (productId, { rejectWithValue }) => {
        try {
            const data = await getProductById(productId);
            return data.product;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
        }
    }
);

export const searchProductsThunk = createAsyncThunk(
    'product/searchProducts',
    async ({ keyword, page = 1, limit = 15 }, { rejectWithValue }) => {
        try {
            const data = await searchProductsApi(keyword, page, limit);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

export const filterProductsThunk = createAsyncThunk(
    'product/filterProducts',
    async ({ filters = {}, page = 1, limit = 15 }, { rejectWithValue }) => {
        try {
            const data = await filterProductsApi(filters, page, limit);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Filter failed');
        }
    }
);

export const fetchProductsByCategory = createAsyncThunk(
    'product/fetchByCategory',
    async ({ category, page = 1, limit = 15 }, { rejectWithValue }) => {
        try {
            const data = await getProductsByCategoryApi(category, page, limit);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch category products');
        }
    }
);

export const fetchProductsByGender = createAsyncThunk(
    'product/fetchByGender',
    async ({ gender, page = 1, limit = 15 }, { rejectWithValue }) => {
        try {
            const data = await getProductsByGenderApi(gender, page, limit);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch gender products');
        }
    }
);

const initialState = {
    // Seller products
    sellerProducts: [],
    // All products with pagination
    products: [],
    // Current product detail
    currentProduct: null,
    // Search state
    searchKeyword: '',
    // Pagination
    totalProducts: 0,
    totalPages: 1,
    currentPage: 1,
    // Loading & error states
    loading: false,
    error: null,
    // Detail loading
    detailLoading: false,
    detailError: null,
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        setSearchKeyword: (state, action) => {
            state.searchKeyword = action.payload
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null
            state.detailError = null
        },
        clearError: (state) => {
            state.error = null
            state.detailError = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
                state.totalProducts = action.payload.totalProducts
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch product by ID
            .addCase(fetchProductById.pending, (state) => {
                state.detailLoading = true
                state.detailError = null
                state.currentProduct = null
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.detailLoading = false
                state.currentProduct = action.payload
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.detailLoading = false
                state.detailError = action.payload
            })
            // Search products
            .addCase(searchProductsThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(searchProductsThunk.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
                state.totalProducts = action.payload.totalProducts
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(searchProductsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Filter products
            .addCase(filterProductsThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(filterProductsThunk.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
                state.totalProducts = action.payload.totalProducts
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(filterProductsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch by category
            .addCase(fetchProductsByCategory.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
                state.totalProducts = action.payload.totalProducts
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Fetch by gender
            .addCase(fetchProductsByGender.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductsByGender.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
                state.totalProducts = action.payload.totalProducts
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchProductsByGender.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})


export const { setSellerProducts, setProducts, setCurrentPage, setSearchKeyword, clearCurrentProduct, clearError } = productSlice.actions
export default productSlice.reducer