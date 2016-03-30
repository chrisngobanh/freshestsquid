import React, { PropTypes } from 'react';

import BaseComponent from './BaseComponent';
import Message from './Message';

const propTypes = {
  url: PropTypes.string.isRequired,
};

const store = { message: '' };

class CopyToClipboard extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;
  }

  showMessage(msg) {
    if (this.props.showMessage) {
      this.props.showMessage(msg);
    } else {
      store.message = msg;
      this.setState(store);
    }
  }

  componentDidMount() {
    // We have to import Clipboard here because Node.js crashes
    // when it tries to import it
    const Clipboard = require('clipboard');
    const clipboard = new Clipboard('.clipboard-btn');

    clipboard.on('success', (e) => {
      this.showMessage('Copied Text to Clipboard!');
      e.clearSelection();
    });

    clipboard.on('error', () => {
      let actionMsg = '';
      if (/iPhone|iPad/i.test(navigator.userAgent)) {
        actionMsg = 'No support :(';
      } else if (/Mac/i.test(navigator.userAgent)) {
        actionMsg = 'Press ⌘-C to Copy Text to Clipboard';
      } else {
        actionMsg = 'Press Ctrl-C to Copy Text to Clipboard';
      }

      this.showMessage(actionMsg);
    });
  }

  render() {
    return (
      <div>
        {!this.props.showMessage ?
          <Message text={this.state.message} />
        : null
        }
        <input id="clipboard-text" value={ this.props.url } readOnly />

        <button className="clipboard-btn" data-clipboard-target="#clipboard-text">Hello</button>
      </div>
    );
  }
}

CopyToClipboard.propTypes = propTypes;

export default CopyToClipboard;
