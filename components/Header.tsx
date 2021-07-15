import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { parseCookies } from 'nookies';

const Header: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false)

  useEffect(
    () => {
      setIsLogin(!!parseCookies().accessToken);
    },
    [setIsLogin]
  )

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {isLogin ? (
            <>
              <li>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/auth/logout" data-testid="logout">
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/auth/authorize" data-testid="login">
                  Login
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>

      <style jsx>{`
        header {
          padding: 0.2rem;
          color: #fff;
          background-color: #333;
        }
        nav {
          max-width: 42rem;
          margin: 1.5rem auto;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          margin-right: 1rem;
        }
        li:nth-child(2) {
          margin-left: auto;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
        button {
          font-size: 1rem;
          color: #fff;
          cursor: pointer;
          border: none;
          background: none;
        }
      `}</style>
    </header>
  );
};

export default Header;
