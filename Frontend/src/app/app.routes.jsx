import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import Protected from '../features/auth/components/Protected'
import AppLayout from './AppLayout'

const Register = lazy(() => import('../features/auth/pages/Register'))
const Login = lazy(() => import('../features/auth/pages/Login'))
const CreateProduct = lazy(() => import('../features/products/pages/CreateProduct'))
const Dashboard = lazy(() => import('../features/products/pages/Dashboard'))
const Home = lazy(() => import('../features/products/pages/Home'))
const ProductDetailed = lazy(() => import('../features/products/pages/ProductDetailed'))
const SellerProductDetials = lazy(() => import('../features/products/pages/SellerProductDetials'))
const Cart = lazy(() => import('../features/cart/pages/Cart'))

const LazyLoad = ({ children }) => (
  <Suspense fallback={
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: 13,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#9ca3af',
      fontFamily: 'system-ui, sans-serif'
    }}>
      Loading…
    </div>
  }>
    {children}
  </Suspense>
)

export const routes = createBrowserRouter([
    {
        path: "/register",
        element: <LazyLoad><Register /></LazyLoad>
    }, {
        path: "/login",
        element: <LazyLoad><Login /></LazyLoad>
    },
    {
        element: <AppLayout />,
        children: [

            {
                path: "/",
                element: <LazyLoad><Home /></LazyLoad>
            }, {
                path: "/product/:productId",
                element: <LazyLoad><ProductDetailed /></LazyLoad>
            },
            {
                path: "/cart",
                element: <LazyLoad><Protected><Cart /></Protected></LazyLoad>
            },
            {
                path: "/seller",
                children: [
                    {
                        path: "/seller/create-product",
                        element: <LazyLoad><Protected role='seller'><CreateProduct /></Protected></LazyLoad>
                    }, {
                        path: "/seller/dashboard",
                        element: <LazyLoad><Protected role='seller'><Dashboard /></Protected></LazyLoad>
                    }, {
                        path: "/seller/product/:productId",
                        element: <LazyLoad><Protected role='seller'><SellerProductDetials /></Protected></LazyLoad>
                    }
                ]
            }
        ]
    }
])
