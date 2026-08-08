import { Link } from 'react-router-dom'

export default function StaticPage({ title, description }){
  return (
    <div className="container" style={{maxWidth:900}}>
      <h2>{title}</h2>
      <p style={{color:'#6B7280'}}>{description || 'Explore this section for curated selections and deals.'}</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:20}}>
        <div style={{padding:20,background:'var(--cards)',borderRadius:12}}>Sample content for {title}</div>
        <div style={{padding:20,background:'var(--cards)',borderRadius:12}}>Sample content for {title}</div>
        <div style={{padding:20,background:'var(--cards)',borderRadius:12}}>Sample content for {title}</div>
      </div>
      <p style={{marginTop:20}}><Link to="/products" className="btn">Browse products</Link></p>
    </div>
  )
}
