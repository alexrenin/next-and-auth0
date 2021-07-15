import React, { useEffect } from 'react';
import { NextPageContext } from 'next';
import { randomBytes, createHash } from 'crypto';
import base64url from 'base64url';
import { setCookie } from 'nookies';

const getLoginUrl = (codeChallenge: string): string => {
  const url = new URL(`${process.env.NEXT_PUBLIC_IDENTITY_ENDPOINT}/authorize?`);
  url.searchParams.append('client_id', process.env.AUTH0_CLIENT_ID as string);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'openid profile email');
  url.searchParams.append('redirect_uri', `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`);
  url.searchParams.append('code_challenge', codeChallenge);
  url.searchParams.append('code_challenge_method', 'S256');

  return url.href;
};

async function getInitialProps(context: NextPageContext) {
  if (context.req && context.res) {
    const codeVerifier = randomBytes(64).toString('hex');
    const hash = createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = base64url.encode(hash);
    const redirectURL = getLoginUrl(codeChallenge);

    return {
      codeVerifier,
      redirectUrl: redirectURL,
    };
  }

  return {};
};

function Authorize({ codeVerifier, redirectUrl }: { codeVerifier?: string; redirectUrl?: string }) {
  useEffect(() => {
    if (codeVerifier && redirectUrl) {
      setCookie(undefined, 'codeVerifier', codeVerifier, {
        maxAge: 86000,
        path: '/',
      });

      window.location.href = redirectUrl;
    } else {
      // We shouldn't redirect to this route using Next.js router (we don't want to use "crypto" on client side)
      // In this case we have to reload the page to receive SSR props

      window.location.reload();
    }
  }, [codeVerifier, redirectUrl]);

  return null;
}

Authorize.getInitialProps = getInitialProps;

export default Authorize;
