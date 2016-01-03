/**
 * Wrapper for React Helmet
 *
 * README: Any non-changing head tags should be defined in index.html
 * eg. meta tag that specifies charset, link tag to load styles.min.css
 */

import ReactHelmet from 'react-helmet';
import React, { PropTypes } from 'react';

import BaseComponent from './BaseComponent';

const propTypes = {
  description: PropTypes.string,
  title: PropTypes.string,
  script: PropTypes.array,
};

const defaultProps = {
  description: 'Freshest Squid is a tool for Splatoon players to ' +
                'create and share their freshest inklings.',
  title: 'Freshest Squid - Create the squid of your dreams, today!',
  script: [],
};


class Helmet extends BaseComponent {

  constructor(props) {
    super(props);
  }

  render() {
    let title = this.props.title;
    if (this.props.title !== defaultProps.title) title += ' | Freshest Squid';

    return (
      <ReactHelmet
        title={ title }
        meta={[
          { name: 'description', content: this.props.description },
          { property: 'og:description', content: this.props.description },
          { property: 'og:title', content: title },
          { name: 'twitter:description', content: this.props.description },
          { name: 'twitter:title', content: title },
        ]}
        script={ this.props.script }
      />
    );
  }
}

Helmet.propTypes = propTypes;
Helmet.defaultProps = defaultProps;

export default Helmet;
