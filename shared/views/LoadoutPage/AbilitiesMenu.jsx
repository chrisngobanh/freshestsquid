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

    this.bind('onAbilityClick');
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
              this.props.renderLoadout(slot, type, name);
              break;
            case 400:
              // TODO: Handle Error
              break;
            case 500:
            default:
              // TODO: Handle Error
          }
        })
        .catch(() => {
          // TODO: Handle Error
        });
    };
  }

  render() {
    const abilities = [];

    abilitiesList.forEach((ability) => {
      abilities.push(
        <Ability
          key={ability.name}
          abilityName={ability.name}
          onClick={this.onAbilityClick(ability)}
        />
      );
    });
    return (
      <div>
        {abilities}
      </div>
    );
  }
}

AbilitiesMenu.propTypes = propTypes;
export default AbilitiesMenu;
