import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ProductProvider } from './context/ProductContext'
import { WishlistProvider } from './context/WishlistContext'
import './styles/global.module.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider>
      <WishlistProvider>
        <CartProvider>
          <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </WishlistProvider>
    </ProductProvider>
  </React.StrictMode>
)
