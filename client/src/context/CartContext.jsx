import { createContext, useContext, useEffect, useReducer } from 'react'
import api from '../services/api'

const CartContext = createContext()

const initialState = {
  items: [],
  shippingAddress: null,
  paymentMethod: {
    type: 'card',
    label: 'Credit or debit card'
  }
}

const LOCAL_KEY = 'Amazon_cart'

const transformBackendCart = (cart) => ({
  ...cart,
  items: (cart.items || []).map((item) => {
    const productId = String(item.productId || item.id || '')
    return {
      id: productId,
      productId,
      title: item.title,
      price: item.price,
      qty: item.qty ?? item.quantity ?? 1,
      images: item.images || (item.image ? [item.image] : []),
      image: item.image || (item.images?.[0] ?? ''),
      stock: item.stock ?? 0
    }
  })
})

function reducer(state, action){
  switch(action.type){
    case 'ADD':{
      const existing = state.items.find(i => i.id === action.payload.id)
      if(existing){
        return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + action.payload.qty } : i) }
      }
      return { ...state, items: [...state.items, { ...action.payload }] }
    }
    case 'REMOVE':{
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    }
    case 'UPDATE_QTY':{
      const { id, qty } = action.payload
      return { ...state, items: state.items.map(i => i.id === id ? { ...i, qty } : i) }
    }
    case 'REPLACE':
      return { ...state, ...action.payload }
    case 'SET_ADDRESS':
      return { ...state, shippingAddress: action.payload }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    case 'CLEAR':
      return initialState
    default:
      return state
  }
}

export const CartProvider = ({ children }) =>{
  const init = () => {
    try{
      const raw = localStorage.getItem(LOCAL_KEY)
      return raw ? JSON.parse(raw) : initialState
    }catch(e){
      return initialState
    }
  }

    const [state, dispatch] = useReducer(reducer, initialState, init)

  useEffect(()=>{
    const syncCart = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const res = await api.get('/cart')
        const backendCart = res.data.cart || { items: [] }
        if (backendCart.items.length === 0 && state.items.length > 0) {
          for (const item of state.items) {
            await api.post('/cart/add', { productId: item.id, qty: item.qty })
          }
          const saved = await api.get('/cart')
          const transformed = transformBackendCart(saved.data.cart || { items: [] })
          dispatch({ type: 'REPLACE', payload: { ...state, ...transformed } })
        } else {
          const transformed = transformBackendCart(backendCart)
          dispatch({ type: 'REPLACE', payload: { ...state, ...transformed } })
        }
      } catch (error) {
        // fallback to local cart if backend unavailable
      }
    }

    syncCart()
  }, [])

  useEffect(()=>{
    try{ localStorage.setItem(LOCAL_KEY, JSON.stringify(state)) }catch(e){}
  },[state])

  const addToCart = async (product, qty=1) => {
    dispatch({ type: 'ADD', payload: { id: product.id, product, title: product.title, price: product.price, images: product.images, qty } })
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await api.post('/cart/add', { productId: product.id, qty })
      } catch (error) {
        console.error('Backend cart add failed', error)
      }
    }
  }

  const removeFromCart = async (id) => {
    dispatch({ type: 'REMOVE', payload: id })
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await api.delete(`/cart/${id}`)
      } catch (error) {
        console.error('Backend cart remove failed', error)
      }
    }
  }

  const updateQty = async (id, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } })
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await api.put(`/cart/${id}`, { qty })
      } catch (error) {
        console.error('Backend cart update failed', error)
      }
    }
  }

  const setShippingAddress = (address) => dispatch({ type: 'SET_ADDRESS', payload: address })
  const setPaymentMethod = (paymentMethod) => dispatch({ type: 'SET_PAYMENT_METHOD', payload: paymentMethod })

  const clearCart = async () => {
    dispatch({ type: 'CLEAR' })
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await api.delete('/cart')
      } catch (error) {
        console.error('Backend cart clear failed', error)
      }
    }
  }

  return (
    <CartContext.Provider value={{ cart: state, addToCart, removeFromCart, updateQty, setShippingAddress, setPaymentMethod, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

export default CartContext
