import styles from './HomeDetails.module.css'

export default function HomeDetails() {
  return (
    <section className={styles.homeDetails}>
      <div className={styles.homeDetailLongCard}>
        <div className={styles.homeDetailLongCardTitle}>Today’s Deals</div>
        <div className={styles.homeDetailLongCardItems}>
          <div className={styles.scrollDiv}>
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className={styles.homeDetailLongCardItem}>
                <img
                  className={styles.homeDetailLongCardItemImg}
                  src="https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg"
                  alt="Deal item"
                />
                <div className={styles.homeDetailLongCardItemImgDetail}>
                  <div className={styles.homeDetailLongCardItemImgTopDetail}>
                    <div className={styles.homeDetailPercentageOff}>Up to 20% off</div>
                    <div className={styles.limitedTimeDeal}>Limited Time Deal</div>
                  </div>
                  <div className={styles.bottomHomeDetail}>iQOO Z9 5G | Starting @17999 Includ…</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.homeDetailLongCard}>
        <div className={styles.homeDetailLongCardTitle}>Today’s Offer</div>
        <div className={styles.homeDetailLongCardItems}>
          <div className={styles.scrollDiv}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={styles.homeDetailLongCardItem}>
                <img
                  className={styles.homeDetailLongCardItemImg}
                  src="https://m.media-amazon.com/images/I/41WnWm3IjiL._AC_SY200_.jpg"
                  alt="Offer item"
                />
                <div className={styles.homeDetailLongCardItemImgDetail}>
                  <div className={styles.homeDetailLongCardItemImgTopDetail}>
                    <div className={styles.homeDetailPercentageOff}>Up to 20% off</div>
                    <div className={styles.limitedTimeDeal}>Limited Time Deal</div>
                  </div>
                  <div className={styles.bottomHomeDetail}>iQOO Z9 5G | Starting @17999 Includ…</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
