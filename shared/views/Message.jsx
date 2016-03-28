import React, { PropTypes } from 'react';

import BaseComponent from './BaseComponent';
import { Motion, spring } from 'react-motion';

const propTypes = {
  text: PropTypes.string.isRequired,
};

const store = { open: true };

class Message extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;

    this.bind('goBack');
  }

  componentDidMount() {
    // When the message is shown, give it 10 seconds before hiding it
    setTimeout(() => this.goBack(), 10000);
  }

  goBack() {
    store.open = false;
    this.setState(store);
  }

  render() {
    return (
      <div>
        <Motion style={{ x: spring(this.state.open ? -28 : 0) }}>
          {({ x }) =>
            <div
              className="message"
              onClick={this.goBack}
              style={{
                WebkitTransform: `translate3d(${x}em, 0, 0)`,
                transform: `translate3d(${x}em, 0, 0)`,
              }}
            >
              <span className="message-close">&times;</span>
              <span className="message-txt">{ this.props.text }</span>
            </div>
          }
        </Motion>
      </div>
    );
  }
}

Message.propTypes = propTypes;

export default Message;
