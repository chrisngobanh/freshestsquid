import React, { PropTypes } from 'react';

import BaseComponent from './BaseComponent';

const propTypes = {
  url: PropTypes.string.isRequired,
};

const store = {};

class CopyToClipboard extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;
  }

  componentDidMount() {
    // We have to import Clipboard here because Node.js crashes
    // when it tries to import it
    const Clipboard = require('clipboard');
    const clipboard = new Clipboard('.clipboard-btn');

    clipboard.on('success', (e) => {
      // TODO: Show this in a message
      // console.log('Copied text to clipboard!');
      e.clearSelection();
    });

    clipboard.on('error', () => {
      // TODO: Show this in a message
      let actionMsg = '';
      if (/iPhone|iPad/i.test(navigator.userAgent)) {
        actionMsg = 'No support :(';
      } else if (/Mac/i.test(navigator.userAgent)) {
        actionMsg = 'Press ⌘-C to Copy';
      } else {
        actionMsg = 'Press Ctrl-C to Copy';
      }

      console.log(actionMsg);
    });
  }

  render() {
    return (
      <div>
        <input id="clipboard-text" value={ this.props.url } readOnly />

        <button className="clipboard-btn" data-clipboard-target="#clipboard-text">Hello</button>
      </div>
    );
  }
}

CopyToClipboard.propTypes = propTypes;

export default CopyToClipboard;
