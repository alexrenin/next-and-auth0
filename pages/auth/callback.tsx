import React, { useEffect, useCallback } from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { useRouter } from 'next/router';

import { NextPageContext } from 'next';

const getInitialProps = async (context: NextPageContext) => ({
  query: context.query,
});

const CallbackPage = ({ query }: { query: { code: string, error: any }}) => {
  const { push } = useRouter();
  const cookies = parseCookies();
  const redirectPath = (cookies.redirectPath || '/') as string;
  const codeVerifier =  cookies.codeVerifier;

  const fetchTokens = useCallback(async () => {
    if (!query.code && !query.error) {
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL as string;
      return;
    }

    if (!query.code || query.error || !codeVerifier) {
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL as string;
      return;
    }

    const tokensRequest = await fetch(`${process.env.NEXT_PUBLIC_IDENTITY_ENDPOINT}/oauth/token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string,
        code_verifier: codeVerifier,
        code: query.code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      }),
    });
    const tokensRequestResult = await tokensRequest.json();

    const { id_token: idToken, access_token: accessToken, expires_in: expiresIn } = tokensRequestResult;

    if (accessToken) {
      setCookie(undefined, 'accessToken', accessToken as string, {
        maxAge: expiresIn,
        path: '/',
      });

      setCookie(undefined, 'idToken', idToken as string, {
        maxAge: expiresIn,
        path: '/',
      });

      destroyCookie(undefined, 'codeVerifier', { path: '/' });
      destroyCookie(undefined, 'redirectPath', { path: '/' });

      push(redirectPath);

    } else {
      destroyCookie(undefined, 'accessToken', { path: '/' });
      destroyCookie(undefined, 'idToken', { path: '/' });
      destroyCookie(undefined, 'redirectPath', { path: '/' });

      push('/');
    }

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
