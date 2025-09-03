import styles from "./page.module.css";
import DataLoader from "./components/DataLoader";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>Reliability Data Loader</h1>
      <div style={{ width: "100%" }}>
        <DataLoader />
      </div>
    </main>
  );
}
