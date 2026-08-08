import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="container" style={{textAlign:'center',padding:40}}>
      <h1>404</h1>
      <p>Page not found</p>
      <p><Link to="/">Go home</Link></p>
    </div>
  )
}
