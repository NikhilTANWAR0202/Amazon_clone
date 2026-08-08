import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import About from './pages/About/About'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminOrders from './pages/Admin/AdminOrders'
import AdminUsers from './pages/Admin/AdminUsers'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ResetPassword from './pages/Auth/ResetPassword'
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
import Press from './pages/Press/Press'
import ProductDetails from './pages/ProductDetails/ProductDetails'
import Products from './pages/Products/Products'
import Profile from './pages/Profile/Profile'
import Returns from './pages/Returns/Returns'
import SearchResults from './pages/SearchResults/SearchResults'
import Shipping from './pages/Shipping/Shipping'
import { BestSellers, Books, Electronics, Fashion, Gaming, GiftCards, Kitchen, Laptops, Mobiles, Sports, TodayDeals } from './pages/Static'
import Wishlist from './pages/Wishlist/Wishlist'
import AdminRoute from './routes/AdminRoute'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App(){
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/search" element={<SearchResults/>} />
          <Route path="/product/:id" element={<ProductDetails/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
          <Route path="/orders/track/:id" element={<ProtectedRoute><OrderTracking/></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist/>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard/></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers/></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders/></AdminRoute>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/today-deals" element={<TodayDeals/>} />
          <Route path="/best-sellers" element={<BestSellers/>} />
          <Route path="/electronics" element={<Electronics/>} />
          <Route path="/fashion" element={<Fashion/>} />
          <Route path="/mobiles" element={<Mobiles/>} />
          <Route path="/laptops" element={<Laptops/>} />
          <Route path="/books" element={<Books/>} />
          <Route path="/gaming" element={<Gaming/>} />
          <Route path="/kitchen" element={<Kitchen/>} />
          <Route path="/sports" element={<Sports/>} />
          <Route path="/gift-cards" element={<GiftCards/>} />
          <Route path="/categories" element={<Categories/>} />
          <Route path="/category/:name" element={<Category/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/help" element={<Help/>} />
          <Route path="/customer-service" element={<CustomerService/>} />
          <Route path="/returns" element={<Returns/>} />
          <Route path="/shipping" element={<Shipping/>} />
          <Route path="/company" element={<Company/>} />
          <Route path="/careers" element={<Careers/>} />
          <Route path="/press" element={<Press/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
