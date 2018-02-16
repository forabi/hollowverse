import * as React from 'react';
import cc from 'classcat';

import * as classes from './TextPage.module.css';

export const TextPage = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cc([className, classes.root])} {...rest} />
);
