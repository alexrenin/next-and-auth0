import React, { useEffect, useCallback } from 'react';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

import { NextPageContext } from 'next';

// import Layout from '../../components/layout';

const getInitialProps = async (context: NextPageContext) => ({
  query: context.query,
});

const CallbackPage = ({ query }: { query: { code: string, error: any }}) => {
  const { push } = useRouter();
  const cookies = parseCookies();
  const redirectPath = (cookies.redirectPath || '/') as string;
  const codeVerifier =  cookies.codeVerifier;

  const fetchTokens = useCallback(async () => {
    // If we don't have code and error it means that user is redirected after logout and we can redirect him to landing page
    if (!query.code && !query.error) {
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL as string;
      return;
    }

    // When code/codeVerifier doesn't exist or IS returns error we can redirect back to landing page
    if (!query.code || query.error || !codeVerifier) {
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL as string;
      return;
    }

    const tokensRequest = await fetch(`/api/auth/fetchToken`, {
      method: 'POST',
      body: new URLSearchParams({
        code: query.code,
        codeVerifier,
        redirectPath,
      }),
    });
    const { redirectTo } = await tokensRequest.json();
    push(redirectTo);

  }, [query]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  return (
    <h1 style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }} >Loading...</h1>
  );
};

CallbackPage.getInitialProps = getInitialProps;

export default CallbackPage;
