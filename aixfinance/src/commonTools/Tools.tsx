import styles from './Tools.module.css';

export const searchBar = (searchQuery: string, setSearchQuery: (value: string) => void, placeholder: string) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className={styles.searchBar}
    />
  );
}
