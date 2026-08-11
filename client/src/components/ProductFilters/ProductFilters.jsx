import styles from './ProductFilters.module.css'

export default function ProductFilters({ filters, categories, onChange, onReset }) {
  return (
    <div className={styles.filterCard}>
      <div className={styles.filterHeader}>
        <h3>Refine results</h3>
        <button type="button" onClick={onReset} className={styles.resetButton}>
          Clear filters
        </button>
      </div>

      <div className={styles.filterRow}>
        <label>Category</label>
        <select name="category" value={filters.category} onChange={onChange}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterRow}>
        <label>Price range</label>
        <div className={styles.priceRange}>
          <input name="minPrice" type="number" min="0" value={filters.minPrice} onChange={onChange} placeholder="Min" />
          <span>–</span>
          <input name="maxPrice" type="number" min="0" value={filters.maxPrice} onChange={onChange} placeholder="Max" />
        </div>
      </div>

      <div className={styles.filterRow}>
        <label>Minimum rating</label>
        <select name="rating" value={filters.rating} onChange={onChange}>
          <option value="">Any</option>
          <option value="1">1 star & up</option>
          <option value="2">2 stars & up</option>
          <option value="3">3 stars & up</option>
          <option value="4">4 stars & up</option>
          <option value="5">5 stars</option>
        </select>
      </div>

      <div className={styles.filterRow}>
        <label>
          <input type="checkbox" name="inStock" checked={filters.inStock} onChange={(e) => onChange({ target: { name: 'inStock', value: e.target.checked } })} />
          In-stock only
        </label>
      </div>

      <div className={styles.filterRow}>
        <label>Sort by</label>
        <select name="sort" value={filters.sort} onChange={onChange}>
          <option value="newest">Newest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="ratingDesc">Best rated</option>
        </select>
      </div>
    </div>
  )
}
