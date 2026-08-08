import { Link } from 'react-router-dom'
import amazonLogo from '../../assets/amazonLogo.png'
import styles from './Footer.module.css'

export default function Footer(){
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <h4>Amazon</h4>
            <p>Premium marketplace UI built for learning and portfolios.</p>
          </div>
          <div>
            <h5>Help</h5>
            <ul>
              <li><Link to="/customer-service">Customer Service</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
            </ul>
          </div>
          <div>
            <h5>About</h5>
            <ul>
              <li><Link to="/company">Company</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>© {new Date().getFullYear()} Amazon. All rights reserved.</div>
      </div>
      <div className={styles.amazonImg}>
        <img className={styles.amazonImgFooter} src={amazonLogo} alt="Amazon Logo" />
      </div>
    </footer>
  )
}
