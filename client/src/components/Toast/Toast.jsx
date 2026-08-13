import styles from './Toast.module.css'

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null

  return (
    <div className={`${styles.toast} ${styles[type]}`} onClick={onClose}>
      <span>{message}</span>
      <button className={styles.close} type="button">×</button>
    </div>
  )
}
