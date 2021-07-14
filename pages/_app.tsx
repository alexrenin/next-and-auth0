import React from "react";
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0';

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  // If you've used `withAuth`, pageProps.user can pre-populate the hook
  // if you haven't used `withAuth`, pageProps.user is undefined so the hook
  // fetches the user from the API routes
  const { user } = pageProps;

  return (
    <UserProvider user={user}>
      <Component {...pageProps} />
    </UserProvider>
  );
}
export default MyApp
