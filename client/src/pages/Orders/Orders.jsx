import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { formatCurrency } from '../../utils/currency'

const statusLabel = (status) => {
  switch (status) {
    case 'Placed': return 'Placed'
    case 'Confirmed': return 'Confirmed'
    case 'Shipped': return 'Shipped'
    case 'Delivered': return 'Delivered'
    case 'Cancelled': return 'Cancelled'
    default: return 'Unknown'
  }
}

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await api.get('/orders')
        setOrders(res.data.orders)
      }catch(err){ setError(err.response?.data?.message || 'Unable to load orders') }
      setLoading(false)
    }
    load()
  },[])

  if(loading) return <div className="container"><h2>My Orders</h2><p>Loading orders...</p></div>
  if(error) return <div className="container"><h2>My Orders</h2><p>{error}</p></div>
  if(orders.length===0) return <div className="container"><h2>My Orders</h2><p>No past orders found.</p></div>

  return (
    <div className="container" style={{maxWidth:900}}>
      <h2>My Orders</h2>
      <div style={{display:'grid',gap:18}}>
        {orders.map(order => (
          <article key={order._id} style={{padding:20,background:'#fff',borderRadius:12,boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:14,color:'#6B7280'}}>Order {order.orderId}</div>
                <div style={{fontSize:18,fontWeight:700}}>{formatCurrency(order.total)}</div>
              </div>
              <div style={{fontSize:14,color:'#6B7280'}}>{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{marginTop:16,display:'grid',gap:8}}>
              {order.items.map(item => (
                <div key={item.productId} style={{display:'flex',justifyContent:'space-between'}}>
                  <span>{item.title} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:16, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span>Status: <strong>{statusLabel(order.status)}</strong></span>
              <Link to={`/orders/track/${order._id}`} style={{ color: '#1d4ed8' }}>Track order</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
