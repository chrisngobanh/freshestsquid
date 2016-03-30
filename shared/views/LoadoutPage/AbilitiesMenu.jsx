import React, { PropTypes } from 'react';

import axios from '../../config/axios';

import Ability from '../Ability';
import BaseComponent from '../BaseComponent';

import abilitiesList from '../../../shared/data/abilities';

const propTypes = {
  loadout: PropTypes.object.isRequired,
};

const store = {};

class AbilitiesMenu extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;

    this.bind('onAbilityClick', 'onBack');
  }

  onAbilityClick(ability) {
    if (ability.type !== 'Any') return null;
    return () => {
      const { name } = ability;
      const { slot, type } = this.props.data;
      axios
        .post(`/loadout/${this.props.loadout.id}/addability`, { name, slot, type })
        .then(({ data }) => {
          switch (data.code) {
            case 200:
              this.props.renderLoadout(data.message, slot, type, name);
              break;
            case 400:
            case 500:
            default:
              this.props.showMessage(data.message);
          }
        })
        .catch(() => {
          this.props.showMessage('Something went wrong. Please try again!');
        });
    };
  }

  onBack() {
    this.props.renderLoadout();
  }

  render() {
    const abilities = [];

    abilitiesList.forEach((ability) => {
      abilities.push(
        <Ability
          className="ability-menu"
          key={ability.name}
          abilityName={ability.name}
          onClick={this.onAbilityClick(ability)}
        />
      );
    });
    return (
      <div>
        {abilities}
        <input
          onClick={this.onBack}
          type="button"
          value="Go Back"
        />
      </div>
    );
  }
}

AbilitiesMenu.propTypes = propTypes;
export default AbilitiesMenu;
