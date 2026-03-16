import { Button } from "@/components";
import Header from "@/components/Header";
import Link from "next/link";
import styles from "./ComingSoon.module.scss"

export default function ComingSoon() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Coming soon</h1>

          <Link href="/recipes">
            <Button>Look recipes</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
