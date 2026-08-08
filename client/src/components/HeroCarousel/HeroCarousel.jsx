import { AnimatePresence, motion } from 'framer-motion'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import banner1 from '../../assets/1250934-2560x1441-desktop-hd-amazon-wallpaper.jpg'
import banner2 from '../../assets/1251006-1920x1080-desktop-1080p-amazon-background-photo.jpg'
import banner3 from '../../assets/1251068-3072x2048-desktop-hd-amazon-wallpaper-image.jpg'
import banner4 from '../../assets/1251312-3840x2160-desktop-4k-amazon-background-image.jpg'
import banner5 from '../../assets/1251316-1920x1080-desktop-full-hd-amazon-wallpaper-photo.jpg'
import { ProductContext } from '../../context/ProductContext'
import styles from './HeroCarousel.module.css'
const mySlides = [
  {
    id: 1,
    img: banner1,
    title: 'Electronics Sale',
    subtitle: 'Up to 60% Off',
    cta: '/electronics'
  },
  {
    id: 2,
    img: banner2,
    title: 'Fashion Collection',
    subtitle: 'Latest Styles',
    cta: '/fashion'
  },
  {
    id: 3,
    img: banner3,
    title: 'Gaming Zone',
    subtitle: 'Best Gaming Deals',
    cta: '/gaming'
  },
  {
    id: 4,
    img: banner4,
    title: 'Home Essentials',
    subtitle: 'Everything for your home',
    cta: '/home'
  },
  {
    id: 5,
    img: banner5,
    title: 'Kitchen Collection',
    subtitle: 'Upgrade your kitchen',
    cta: '/kitchen'
  }
]

export default function HeroCarousel({ slides = [] }) {
  const { products } = useContext(ProductContext)
  const [index, setIndex] = useState(0)
  const activeSlides = useMemo(() => {
  if (slides && slides.length) return slides
  return mySlides
}, [slides])

  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % activeSlides.length), 5000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  const prev = () => setIndex((current) => (current - 1 + activeSlides.length) % activeSlides.length)
  const next = () => setIndex((current) => (current + 1) % activeSlides.length)

  return (
    <div className={styles.carousel}>
      <div className="container">
        <div className={styles.inner}>
          <AnimatePresence mode="wait">
            {activeSlides.map((slide, position) =>
              position === index ? (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7 }}
                  className={styles.slide}
                >
                  <img src={slide.img} alt={slide.title} loading="eager" />
                  <div className={styles.overlay}>
                    <small>Premium deals</small>
                    <h2>{slide.title}</h2>
                    <p>{slide.subtitle}</p>
                    <div className={styles.ctas}>
                      <Link to={slide.cta} className="btn">Shop Now</Link>
                      <Link to="/today-deals" className="btn btn-light">Today's Deals</Link>
                    </div>
                  </div>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>

          <button className={styles.prev} onClick={prev} aria-label="Previous">‹</button>
          <button className={styles.next} onClick={next} aria-label="Next">›</button>

          <div className={styles.indicators}>
            {activeSlides.map((slide, idx) => (
              <button key={slide.id} className={idx === index ? styles.active : ''} onClick={() => setIndex(idx)} aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
