import { Route, Routes } from 'react-router-dom'

import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'

// Admin Pages
import AddProduct from './pages/admin/AddProduct'
import AdminLogin from './pages/admin/AdminLogin'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'
import Dashboard from './pages/admin/Dashboard'
import EditProduct from './pages/admin/EditProduct'

// Auth Pages
import ForgotPassword from './pages/Auth/ForgotPassword'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ResetPassword from './pages/Auth/ResetPassword'

// Main Pages
import About from './pages/About/About'
import Careers from './pages/Careers/Careers'
import Cart from './pages/Cart/Cart'
import Categories from './pages/Categories/Categories'
import Category from './pages/Category/Category'
import Checkout from './pages/Checkout/Checkout'
import Company from './pages/Company/Company'
import CustomerService from './pages/CustomerService/CustomerService'
import Help from './pages/Help/Help'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Orders from './pages/Orders/Orders'
import OrderTracking from './pages/Orders/OrderTracking'
import PaymentSuccess from './pages/PaymentSuccess'
import Press from './pages/Press/Press'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Products from './pages/Products/Products'
import Profile from './pages/Profile/Profile'
import ProfileAddresses from './pages/Profile/ProfileAddresses'
import ProfileOrders from './pages/Profile/ProfileOrders'
import ProfilePayments from './pages/Profile/ProfilePayments'
import ProfileSecurity from './pages/Profile/ProfileSecurity'
import Returns from './pages/Returns/Returns'
import SearchResults from './pages/SearchResults/SearchResults'
import Shipping from './pages/Shipping/Shipping'
import Wishlist from './pages/Wishlist/Wishlist'

// Static Pages
import {
  BestSellers,
  Books,
  Electronics,
  Fashion,
  Gaming,
  GiftCards,
  Kitchen,
  Laptops,
  Mobiles,
  Sports,
  TodayDeals
} from './pages/Static.jsx'

// Route Protection
import AdminRoute from './routes/AdminRoute'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
  <div>
    <Navbar />

    <main>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Products */}
        <Route path="/products" element={<Products />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Cart & Orders */}
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/track/:id"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        {/* User */}
        <Route path="/wishlist" element={<Wishlist />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/security"
          element={
            <ProtectedRoute>
              <ProfileSecurity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/addresses"
          element={
            <ProtectedRoute>
              <ProfileAddresses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/payments"
          element={
            <ProtectedRoute>
              <ProfilePayments />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-product/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />

        {/* Static Pages */}
        <Route path="/today-deals" element={<TodayDeals />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/electronics" element={<Electronics />} />
        <Route path="/fashion" element={<Fashion />} />
        <Route path="/mobiles" element={<Mobiles />} />
        <Route path="/laptops" element={<Laptops />} />
        <Route path="/books" element={<Books />} />
        <Route path="/gaming" element={<Gaming />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/gift-cards" element={<GiftCards />} />

        {/* Categories */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:name" element={<Category />} />

        {/* Information Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/company" element={<Company />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>

    <Footer />
  </div>
)
}