/* eslint id-length: 0 */

import React, { PropTypes } from 'react';
import _ from 'lodash';

import util from '../util';

import Ability from '../Ability';
import BaseComponent from '../BaseComponent';
import Image from '../Image';

class GearInfoPanel extends BaseComponent {

  constructor(props) {
    super(props);
  }

  render() {
    if (_.isEmpty(this.props.item) || !this.props.type) {
      return null;
    }

    const abilityElementsList = [];
    const slotStars = [];

    for (let i = 1; i < this.props.item.slots + 1; i++) {
      abilityElementsList.push(
        <Ability
          className={`ability-${i}`}
          key={`ability${i}`}
        />
      );

      slotStars.push(
        <Image
          className="star"
          src="img/slot-star.png"
          key={`slot-star-${i}`}
        />
      );
    }
    return (
      <div className={`gear-info-panel-a ${this.props.type}`}>

        <Image className="hidden-img" src={`img/info-a-${this.props.type}.png`} />

        {/* Item Name */}
        <h3 className="item-name">{ this.props.item.name }</h3>

        {/* Item Image */}
        <Image
          className="item-image"
          src={ util.getImgSrc(this.props.item.name, this.props.type) }
        />

        {/* Brand Name */}
        <h4 className="brand-name">{ this.props.item.brand }</h4>

        {/* Brand Image */}
        <Image
          className="brand-image"
          src={ util.getImgSrc(this.props.item.brand, 'brands') }
        />

        {/* Main Ability Icon */}
        <Ability
          className="main-ability"
          abilityName={this.props.item.ability}
        />

        {/* Main Ability Name */}
        <h6 className="ability-name">{ this.props.item.ability }</h6>

        {/* Other Abilities Icons */}

        { abilityElementsList }

        {/* Slot Stars */}
        <div className="slot-stars">
          { slotStars }
        </div>
      </div>

    );
  }
}

const propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

GearInfoPanel.propTypes = propTypes;

export default GearInfoPanel;
