import { NextApiRequest, NextApiResponse } from 'next';
import { destroyCookie, setCookie } from 'nookies';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    code,
    codeVerifier,
    redirectPath,
  } = req.body;

  const tokensRequest = await fetch(`${process.env.NEXT_PUBLIC_IDENTITY_ENDPOINT}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: new URLSearchParams({
      client_id: process.env.AUTH0_CLIENT_ID as string,
      client_secret: process.env.AUTH0_CLIENT_SECRET as string,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
    }),
  });
  const tokensRequestResult = await tokensRequest.json()
  const { id_token: idToken, access_token: accessToken, expires_in: expiresIn } = tokensRequestResult;

  let path = '/';
  if (accessToken) {
    setCookie({ res }, 'accessToken', accessToken as string, {
      maxAge: expiresIn,
      path: '/',
    });

    setCookie({ res }, 'idToken', idToken as string, {
      maxAge: expiresIn,
      path: '/',
    });

    destroyCookie({ res }, 'codeVerifier', { path: '/' });
    destroyCookie({ res }, 'redirectPath', { path: '/' });

    path = redirectPath;

  } else {
    destroyCookie({ res }, 'accessToken', { path: '/' });
    destroyCookie({ res }, 'idToken', { path: '/' });
    destroyCookie({ res }, 'redirectPath', { path: '/' });
  }

  res
    .status(200)
    .json({
      redirectTo: path
    });
};
