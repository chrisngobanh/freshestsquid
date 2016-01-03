/* eslint id-length: 0 */

import _ from 'lodash';
import React, { PropTypes } from 'react';

import util from '../util';

import BaseComponent from '../BaseComponent';
import Image from '../Image';
import StatBar from './StatBar';

import statTypes from '../../../shared/data/stat-types.json';

const propTypes = {
  item: PropTypes.object.isRequired,
};

class WeaponInfoPanel extends BaseComponent {

  render() {
    if (_.isEmpty(this.props.item)) return null;

    return (
      <div className="weapons-info-panel-a">

        <Image className="hidden-img" src="img/info-a-weapons.png" />

        {/* Item Name */}
        <span className="item-name">{ this.props.item.name }</span>

        {/* Stats */}
        <span className="stat-label stat-a">{statTypes[this.props.item.type].statA}</span>
        <span className="stat-label stat-b">{statTypes[this.props.item.type].statB}</span>
        <span className="stat-label stat-c">{statTypes[this.props.item.type].statC}</span>

        {/* Stats Bars */}
        <StatBar type="a" val={this.props.item.statA} />
        <StatBar type="b" val={this.props.item.statB} />
        <StatBar type="c" val={this.props.item.statC} />

        {/* Sub Label */}
        <span className="weapon-text sub-label">Sub</span>

        {/* Special Label */}
        <span className="weapon-text special-label">Special</span>


        {/* Sub Name */}
        <span className="weapon-text sub-name">{this.props.item.sub}</span>
        {/* Special Name */}
        <span className="weapon-text special-name">{this.props.item.special}</span>

        {/* Item Image */}
        <Image
          className="item-image"
          src={ util.getImgSrc(this.props.item.name, 'weapons') }
        />


        {/* Sub Image */}
        <Image
          className="sub-image"
          src={ util.getImgSrc(this.props.item.sub, 'sub') }
        />

        {/* Special Image */}
        <Image
          className="special-image"
          src={ util.getImgSrc(this.props.item.special, 'special', this.props.item.sub) }
        />

      </div>

    );
  }
}

WeaponInfoPanel.propTypes = propTypes;

export default WeaponInfoPanel;
