import React from 'react';
import Head from 'next/head';
import Image from "next/image";

import Header from './Header';

import styles from "../styles/Layout.module.css";

const Layout = ({ children }) => (
  <>
    <Head>
      <title>Next.js with Auth0</title>
      <meta name="description" content="Testing Next.js and Auth0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />

    <main className={styles.main}>
      {children}
    </main>

    <footer className={styles.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{' '}
        <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
      </a>
    </footer>
  </>
);

export default Layout;
