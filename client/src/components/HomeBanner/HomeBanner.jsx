import banner2 from '../../assets/banner2.jpg'
import styles from './HomeBanner.module.css'

export default function HomeBanner() {
  return (
    <section className={styles.homeBanner}>
      <img
        className={styles.homeBannerImg}
        src={banner2}
        alt="Amazon hero banner"
      />
    </section>
  )
}
