import React, { PropTypes } from 'react';

import BaseComponent from '../BaseComponent';
import Image from '../Image';

const propTypes = {
  val: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

function widthOfStatBar(stat) {
  return `${30 * (stat / 100)}%`;
}

class StatBar extends BaseComponent {

  render() {
    return (
      <div
        className={`stat-bar stat-${this.props.type}`}
        style={{ width: widthOfStatBar(this.props.val) }}
      >
        <Image className="stat-bar-img" src="img/stat-bar.png" />
      </div>
    );
  }
}

StatBar.propTypes = propTypes;

export default StatBar;
