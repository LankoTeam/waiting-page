'use client'

import Image from "next/image";
import Link from "next/link";
import WaitingListForm from "@/components/WaitingListForm";
import ThemeToggle from "@/components/ThemeToggle";
import styles from '@/app/page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <ThemeToggle />
      <main className={styles.main}>
        <div className={styles.content}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Image
              src="/lanko-main-logo-320x320.svg"
              alt="LANKO蓝扣 Logo"
              width={200}
              height={200}
              priority
            />
          </div>

          {/* 标题和描述 */}
          <div className={styles.headingContainer}>
            <h1 className={styles.title}>LANKO蓝扣</h1>
            <h2 className={styles.subtitle}>即将上线</h2>
            <p className={styles.description}>
              专为国人设计的全新MeetUp活动平台，敬请期待。
            </p>
          </div>

          {/* 邮件订阅表单 */}
          <div className={styles.formContainer}>
            <WaitingListForm />
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} LANKO All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
