import React, { PropTypes } from 'react';

import util from './util';

import BaseComponent from './BaseComponent';
import Image from './Image';

class Ability extends BaseComponent {

  render() {
    return (
      <Image
        className={this.props.className}
        onClick={ this.props.onClick }
        src={ util.getImgSrc(this.props.abilityName, 'abilities') }
      />
    );
  }

}

const defaultProps = {
  abilityName: 'Locked',
};

const propTypes = {
  className: PropTypes.string.isRequired,
  abilityName: PropTypes.string,
  onClick: PropTypes.func,
};

Ability.defaultProps = defaultProps;
Ability.propTypes = propTypes;

export default Ability;
