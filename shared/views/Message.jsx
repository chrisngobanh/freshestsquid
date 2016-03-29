import React, { PropTypes } from 'react';

import BaseComponent from './BaseComponent';
import { TransitionMotion, spring } from 'react-motion';

const emptyObj = { key: '', style: { x: 0 }, data: { text: '' } };

let backTimer;

const propTypes = {
  text: PropTypes.string.isRequired,
};

const store = { num: 0, arr: [] };

class Message extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;

    this.bind('goBack');
  }

  componentWillReceiveProps({ text }) {
    store.arr[this.state.num - 1] = emptyObj;
    store.arr.push({ key: this.state.num.toString(), style: { x: spring(-28) }, data: { text } });
    store.num++;
    this.setState(store);

    clearTimeout(backTimer);
    backTimer = setTimeout(() => this.goBack(), 10000);
  }

  goBack() {
    store.arr[this.state.num - 1] = emptyObj;
    this.setState(store);
  }

  willEnter() {
    return { x: 0 };
  }

  willLeave() {
    return { x: spring(0) };
  }

  render() {
    return (
      <TransitionMotion
        willEnter={this.willEnter}
        willLeave={this.willLeave}
        styles={this.state.arr}
      >
        {styles =>
          <div>
            {styles.map(config => {
              if (!config.key) return null;
              return (
                <div
                  key={config.key}
                  className="message"
                  onClick={this.goBack}
                  style={{
                    WebkitTransform: `translate3d(${config.style.x}em, 0, 0)`,
                    transform: `translate3d(${config.style.x}em, 0, 0)`,
                  }}
                >
                  <span className="message-close">&times;</span>
                  <span className="message-txt">{ config.data.text }</span>
                </div>
              );
            })}
          </div>
        }
      </TransitionMotion>
    );
  }
}

Message.propTypes = propTypes;

export default Message;
