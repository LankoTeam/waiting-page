'use client'

import Image from "next/image";
import Link from "next/link";
import WaitingListForm from "@/components/WaitingListForm";
import styles from '@/app/page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
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
              我们正在开发一个全新的创新项目，敬请期待。现在加入我们的Waiting List，成为第一批体验者，获取发布通知和独家优惠。
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
            © {new Date().getFullYear()} LANKO蓝扣. 保留所有权利.
          </p>
          <div className={styles.links}>
            <Link href="#" className={styles.link}>关于我们</Link>
            <Link href="#" className={styles.link}>隐私政策</Link>
            <Link href="#" className={styles.link}>联系我们</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
