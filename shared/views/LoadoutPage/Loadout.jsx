import _ from 'lodash';
import React, { PropTypes } from 'react';

import util from '../util';

import Ability from '../Ability';
import BaseComponent from '../BaseComponent';
import CopyToClipboard from '../CopyToClipboard';
import Image from '../Image';

import itemsData from '../../../shared/data/items.json';

const propTypes = {
  loadout: PropTypes.object.isRequired,
};

const store = {};

class Loadout extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;

    this.bind('onAbilityClick');
  }

  onAbilityClick(slot, type, prevAbility) {
    if (this.props.username !== this.props.loadout.user.username) return null;
    return () => {
      this.props.renderAbilitiesMenu(slot, type, prevAbility);
    };
  }

  render() {
    // Find the items from the loadout in itemsData
    const weapon = _.find(itemsData.weapons, 'name', this.props.loadout.weapon.name || '') || {};
    const head = _.find(itemsData.head, 'name', this.props.loadout.head.name || '') || {};
    const clothes = _.find(itemsData.clothes, 'name', this.props.loadout.clothes.name || '') || {};
    const shoes = _.find(itemsData.shoes, 'name', this.props.loadout.shoes.name || '') || {};

    const gearItems = { head, clothes, shoes };

    // TODO: Clean this up
    const abilitiesList = _.mapValues(gearItems, (item, type) => {
      const itemAbilities = [];

      for (let i = 1; i < 4; i++) {
        let abilityName;
        const ability = this.props.loadout[type][`ability${i}`];
        if (ability) {
          abilityName = ability;
        } else {
          if (item.slots < i) {
            break;
          }
        }

        itemAbilities.push(
          <Ability
            className={`ability-${i}`}
            key={`ability${i}`}
            abilityName={abilityName}
            onClick={this.onAbilityClick(i, type, abilityName)}
          />
        );

        if (abilityName === 'Locked') break;
      }

      return itemAbilities;
    });

    return (
      <div>
        <h1>{this.props.loadout.name}</h1>
        <CopyToClipboard url={`https://freshestsquid.com/loadouts/${this.props.loadout.id}`} />
        <br />
        <br />
        <h2>Weapon: {weapon.name}</h2>
        { weapon.name ?
          <div>
            <span className="weapon-text sub-name">{weapon.sub}</span>

            <span className="weapon-text special-name">{weapon.special}</span>

            <Image
              className="item-image"
              src={ util.getImgSrc(weapon.name, 'weapons') }
            />

            <Image
              className="sub-image"
              src={ util.getImgSrc(weapon.sub, 'sub') }
            />

            <Image
              className="special-image"
              src={ util.getImgSrc(weapon.special, 'special', weapon.sub) }
            />
          </div>
        : null }
        <br />
        <h2>Head: {head.name}</h2>
        { head.name ?
          <div>
            <Image
              className="item-image"
              src={ util.getImgSrc(head.name, 'head') }
            />
            <Ability
              className="main-ability"
              abilityName={head.ability}
            />

            { abilitiesList.head }

          </div>
        : null }
        <br />
        <h2>Clothes: {clothes.name}</h2>
        { clothes.name ?
          <div>
            <Image
              className="item-image"
              src={ util.getImgSrc(clothes.name, 'clothes') }
            />
            <Ability
              className="main-ability"
              abilityName={clothes.ability}
            />

            { abilitiesList.clothes }

          </div>
        : null }
        <br />
        <h2>Shoes: {shoes.name}</h2>
        { shoes.name ?
          <div>
            <Image
              className="item-image"
              src={ util.getImgSrc(shoes.name, 'shoes') }
            />
            <Ability
              className="main-ability"
              abilityName={shoes.ability}
            />

            { abilitiesList.shoes }

          </div>
        : null }
        <br />
        <a href="/abilities">See abilities</a>
        <br />
        <a href="/loadouts">Back</a>
        <br />

        {/* If the user is the owner of the loadout*/}
        {this.props.username === this.props.loadout.user.username ?
          <a href={`/loadouts/${this.props.loadout.id}/equip`}>
            <input type="button" value="Equip Items" />
          </a>
        : null}
      </div>
    );
  }
}

Loadout.propTypes = propTypes;
export default Loadout;
