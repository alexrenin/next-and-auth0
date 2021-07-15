import { NextPageContext } from 'next';
import { destroyCookie, parseCookies } from 'nookies';

const getLogoutUrl = () => {
  const url = new URL(`${process.env.NEXT_PUBLIC_IDENTITY_ENDPOINT}/v2/logout?`);
  url.searchParams.append('client_id', process.env.AUTH0_CLIENT_ID as string);
  url.searchParams.append('returnTo', process.env.NEXT_PUBLIC_BASE_URL as string);

  return url.href;
};

const getInitialProps = async (context: NextPageContext) => {
  const cookies = parseCookies(context);

  if (context.res) {
    destroyCookie(context, 'accessToken', { path: '/' });
    destroyCookie(context, 'idToken', { path: '/' });
    destroyCookie(context, 'appSession', { path: '/' });

    context.res.writeHead(302, {
      Location: getLogoutUrl(),
    });

    context.res.end();
  }

  return {};
};

const LogoutPage = () => null;

LogoutPage.getInitialProps = getInitialProps;

export default LogoutPage;
