import React, { PropTypes } from 'react';

import BaseComponent from '../BaseComponent';
import Helmet from '../Helmet';
import Message from '../Message';

import AbilitiesMenu from './AbilitiesMenu';
import Loadout from './Loadout';

const propTypes = {
  loadout: PropTypes.object.isRequired,
};

const store = {
  message: '',
  mode: 'loadout',
  loadout: {},
  abilitiesMenuData: {
    slot: 0,
    type: '',
    prevAbility: '',
  },
};

class LoadoutPage extends BaseComponent {

  constructor(props) {
    super(props);
    store.loadout = this.props.loadout;
    this.state = store;

    this.bind('showMessage', 'renderAbilitiesMenu', 'renderLoadout');
  }

  renderAbilitiesMenu(slot, type, prevAbility) {
    store.message = '';
    store.mode = 'abilities';
    store.abilitiesMenuData = { slot, type, prevAbility };
    this.setState(store);
  }

  renderLoadout(message, slot, type, ability) {
    store.message = message;
    store.mode = 'loadout';
    store.loadout[type][`ability${slot}`] = ability;
    this.setState(store);
  }

  showMessage(message) {
    store.message = message;
    this.setState(store);
  }

  render() {
    let center;
    switch (this.state.mode) {
      case 'abilities':
        center = (
          <AbilitiesMenu
            loadout={this.state.loadout}
            data={this.state.abilitiesMenuData}
            renderLoadout={this.renderLoadout}
            showMessage={this.showMessage}
          />
        );
        break;
      case 'loadout':
      default:
        center = (
          <Loadout
            loadout={this.state.loadout}
            username={this.props.username}
            renderAbilitiesMenu={this.renderAbilitiesMenu}
            showMessage={this.showMessage}
          />
        );
    }

    const description = `${this.state.loadout.name} by ${this.state.loadout.user.username}. ` +
                        `Check it out on Freshest Squid.`;

    return (
      <div>
        <Helmet
          title={this.state.loadout.name}
          description={description}
        />
          <Message text={this.state.message} />

        { center }

      </div>
    );
  }
}

LoadoutPage.propTypes = propTypes;
export default LoadoutPage;
