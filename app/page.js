"use client";
import styles from "./page.module.css";
import DataLoader from "./components/DataLoader";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>Reliability Data Loader</h1>
      <div style={{ width: "100%" }}>
        <NextUIProvider>
          <DataLoader />
        </NextUIProvider>
      </div>
    </main>
  );
}
