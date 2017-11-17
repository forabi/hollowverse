import * as React from 'react';
import { NavBar } from 'components/NavBar/NavBar';
import { Route, Switch } from 'react-router-dom';

import './styles.global.scss';
import classes from './App.module.scss';

import NotablePersonPage from 'pages/NotablePerson/NotablePerson';

/** Main app component */
export class App extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div className={classes.app}>
        <NavBar title="Hollowverse" />
        <div className={classes['app-view']}>
          <Switch>
            <Route path="/:slug" component={NotablePersonPage} />
          </Switch>
        </div>
      </div>
    );
  }
}