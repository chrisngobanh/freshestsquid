import React, { PropTypes } from 'react';

import util from '../util';

import BaseComponent from '../BaseComponent';
import Ability from '../Ability';
import Image from '../Image';

class ItemBox extends BaseComponent {

  constructor(props) {
    super(props);
    this.bind('onClick', 'onHover');
  }

  onClick() {
    this.props.equipItem(this.props.item);
  }

  onHover() {
    this.props.changeActiveItem(this.props.item);
  }

  render() {
    const abilityElementsList = [];

    abilityElementsList.push(
      <Ability
        className="main-ability"
        abilityName={this.props.item.ability}
        key="main-ability"
      />
    );

    if (this.props.type !== 'weapons') {
      for (let i = 1; i < this.props.item.slots + 1; i++) {
        abilityElementsList.push(
          <Ability
            className={`ability-${i}`}
            key={`ability${i}`}
          />
        );
      }
    }

    return (
      <div
        className={ `item-box ${this.props.type}` }
        onClick={ this.onClick }
        onMouseEnter={ this.onHover }
      >

        { this.props.isEquipped ?
          <Image className="splat" src="img/splat.png" />
          : null
        }

        <Image
          alt={this.props.item.name}
          className="hidden-img"
          src={`img/item-box-${this.props.type}.png`}
        />

        <Image
          alt={this.props.item.name}
          className="item-image"
          src={util.getImgSrc(this.props.item.name, this.props.type)}
        />

        { this.props.type === 'weapons' ?
          [
            <Image
              className="sub-image"
              key="sub"
              src={ util.getImgSrc(this.props.item.sub, 'sub') }
            />,

            <Image
              className="special-image"
              key="special"
              src={ util.getImgSrc(this.props.item.special, 'special', this.props.item.sub) }
            />,
          ] : { abilityElementsList }

        }
      </div>
    );
  }
}

const propTypes = {
  item: PropTypes.object.isRequired,
};

ItemBox.propTypes = propTypes;

export default ItemBox;
