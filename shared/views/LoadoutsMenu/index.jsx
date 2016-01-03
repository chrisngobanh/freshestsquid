import $ from 'jquery';
import React, { PropTypes } from 'react';

import axios from '../../config/axios';

import BaseComponent from '../BaseComponent';
import Helmet from '../Helmet';
import LogoutButton from '../LogoutButton';

const propTypes = {
  loadouts: PropTypes.array.isRequired,
};

const store = { loadouts: [] };

class LoadoutsMenu extends BaseComponent {

  constructor(props) {
    super(props);
    store.loadouts = [...props.loadouts];
    this.state = store;

    this.bind('createLoadoutInstance', 'handleSubmit');
  }

  componentDidMount() {
    const $document = $(document);
    const $name = $('#name');

    $document.keydown((e) => {
      // If the user presses the enter key
      if (e.keyCode === 13) {
        if ($name.is(':focus')) {
          this.handleSubmit();
        }
      }
    });
  }

  createLoadoutInstance(loadout) {
    return (
      <a key={ loadout.id } href={ `/loadouts/${loadout.id}` }><div>{ loadout.name }</div></a>
    );
  }

  handleSubmit() {
    const name = $('#name').val();

    axios.post('/loadout', { name })
      .then(({ data }) => {
        switch (data.code) {
          case 200:
            store.loadouts.push(data.data);
            this.setState(store);
            break;
          case 400:
            $('#name').select();
            break;
          case 500:
            // TODO: Show an error message
            break;
          default:
        }
      })
      .catch(() => {
        // TODO: Show an error message
      });
  }

  render() {
    const loadoutsList = [];
    this.state.loadouts.forEach((loadout) => {
      loadoutsList.push(this.createLoadoutInstance(loadout));
    });
    return (
      <div>
        <Helmet title="My Loadouts" />
        <h1>My Loadouts</h1>
        { loadoutsList }

        <h3>Create a new empty Loadout</h3>
        <input type="text" id="name" placeholder="name" />
        <input type="button" onClick={this.handleSubmit} value="Create" />
        <LogoutButton />
      </div>
    );
  }
}

LoadoutsMenu.propTypes = propTypes;

export default LoadoutsMenu;
