import $ from 'jquery';
import _ from 'lodash';
import director from 'director';
import Helmet from 'react-helmet';
import React from 'react';

import routes from './routes';

import axios from '../config/axios';

const isServer = !process.browser;

const Router = (isServer ? director.http.Router : director.Router);

function handleServerRoute(routeHandler) {
  return function serverRouteHandler(...params) {
    const username = (this.req.session.user ? this.req.session.user.username : '');
    const cookie = this.req.headers.cookie;
    routeHandler({ username, cookie, params }, (url, reactComponent, props) => {
      if (url) return this.res.redirect(url);
      const component = React.createFactory(reactComponent);
      const react = React.renderToStaticMarkup(
        React.DOM.div({
          id: 'react',
          className: 'react',
          dangerouslySetInnerHTML: {
            __html: React.renderToString(component(props)),
          },
        })
      );

      const head = Helmet.rewind();
      this.res.render('index.html', { react, head });
    });
  };
}

function handleClientRoute(routeHandler) {
  return (...params) => {
    axios.get('/user')
      .then((res) => {
        let username = '';
        if (res.data.data) username = res.data.data.username;

        routeHandler({ username, params }, (url, reactComponent, props) => {
          if (url) return handleClientRoute(routes[url])(params);
          const $react = $('#react');
          React.render(React.createElement(reactComponent, props), $react.get(0));
        });
      });
  };
}

function parseRoutes(routesObj) {
  let newRoutes = {};
  if (isServer) {
    newRoutes = _.mapValues(routesObj, (routeHandler) => {
      return { get: handleServerRoute(routeHandler) };
    });
  } else {
    newRoutes = _.mapValues(routesObj, (val) => handleClientRoute(val));
  }

  return newRoutes;
}

function initializeRouter() {
  const router = new Router(parseRoutes(routes));

  if (!isServer) {
    const $document = $(document);

    router.configure({ html5history: true });

    // Source: http://stackoverflow.com/a/36295638/4509670
    $document.on('click', 'a', function handleRoutingOnAnchorClick(e) {
      // Clientside redirect
      router.setRoute(this.attributes.href.value);

      // Prevent the <a> tag from redirecting
      e.preventDefault();
    });

    router.init();
  } else {
    // Router will not use route recursion (only calls one route handler)
    router.configure({ recurse: false });
  }

  return router;
}

export default initializeRouter();
