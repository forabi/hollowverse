import React from 'react';

import classes from './Footer.module.scss';

import Link from 'next/link';

export const Footer = () => (
  <footer className={classes.root}>
    <ul className={classes.list}>
      <li>
        <Link href="/about">
          <a>About</a>
        </Link>
      </li>
      <li>
        <Link href="/privacy-policy">
          <a>Privacy</a>
        </Link>
      </li>
      <li>
        <a href="https://www.facebook.com/The-Hollowverse-206704599442186/">
          Facebook
        </a>
      </li>
    </ul>
    <br />
    <img
      className={classes.logo}
      role="presentation"
      alt={undefined}
      src="/static/favicon.png"
    />
  </footer>
);
