import React from "react";
import useSWR from "swr";
import { parseCookies } from "nookies";

import Layout from '../components/layout';

import styles from '../styles/Home.module.css'

const userEndpoint = `${process.env.NEXT_PUBLIC_IDENTITY_ENDPOINT}/userinfo`;
const getUser = async () => {
  const cookies = parseCookies();
  const response = await fetch(userEndpoint, {
    headers: {
    'Authorization': `Bearer ${cookies.accessToken}`,
  }
  });

  const success = response.status === 200;

  if (success) {
    return {
      user: await response.json(),
    }
  }

  return {
    response,
  }
};

export default function Home() {
  const { data, error } = useSWR(userEndpoint, getUser);
  const { user } = data || {};

  const isLoading = !data && !error;

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
