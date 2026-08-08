import { createContext, useContext, useEffect, useReducer } from 'react'

const WishlistContext = createContext()
const LOCAL_KEY = 'Amazon_wishlist'

const initialState = { items: [] }

function reducer(state, action){
  switch(action.type){
    case 'ADD':{
      const exists = state.items.find(i=>i.id===action.payload.id)
      if(exists) return state
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE':{
      return { ...state, items: state.items.filter(i=>i.id!==action.payload) }
    }
    case 'SET':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export const WishlistProvider = ({ children }) =>{
  const init = ()=>{
    try{ const raw = localStorage.getItem(LOCAL_KEY); return raw ? { items: JSON.parse(raw) } : initialState }catch(e){ return initialState }
  }

  const [state, dispatch] = useReducer(reducer, initialState, init)

  useEffect(()=>{ try{ localStorage.setItem(LOCAL_KEY, JSON.stringify(state.items)) }catch(e){} },[state.items])

  const add = (product) => dispatch({ type: 'ADD', payload: { id: product.id, title: product.title, price: product.price, images: product.images } })
  const remove = (id) => dispatch({ type: 'REMOVE', payload: id })
  const toggle = (product) => {
    const exists = state.items.find(i=>i.id===product.id)
    if(exists) remove(product.id)
    else add(product)
  }
  const isIn = (id) => !!state.items.find(i=>i.id===id)

  return (
    <WishlistContext.Provider value={{ wishlist: state, add, remove, toggle, isIn }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = ()=> useContext(WishlistContext)

export default WishlistContext
