import React from "react";
import Head from 'next/head'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0';

import Layout from '../components/layout';

import styles from '../styles/Home.module.css'

export default function Home() {
  const { user, error, isLoading } = useUser();

  function onClick(): void {
  }

  return (
    <Layout>
      <h1>Next.js and Auth0 </h1>

      {isLoading && <p>Loading login info...</p>}

      {error && (
        <>
          <h4>Error</h4>
          <pre>{error.message}</pre>
        </>
      )}

      {user && (
        <>
          <h4>Rendered user info on the client</h4>
          <pre
            data-testid="profile"
            className={styles.profileInfo}
          >
            {JSON.stringify(user, null, 2)}
          </pre>
        </>
      )}

      {!isLoading && !error && !user && (
        <>
          <p>
            To test the login click in <i>Login</i>
          </p>
          <p>
            Once you have logged in you should be able to click in <i>Protected Page</i> and <i>Logout</i>
          </p>
        </>
      )}

    </Layout>
  );
}
