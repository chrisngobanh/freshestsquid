import React, { PropTypes } from 'react';

import BaseComponent from '../BaseComponent';

const propTypes = {
  children: PropTypes.element.isRequired,
};

const store = {};

class Gamepad extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;
  }

  render() {
    return (
      <div>
        { this.props.children}
      </div>
    );
  }
}

Gamepad.propTypes = propTypes;

export default Gamepad;
