/* eslint id-length: 0 */

import _ from 'lodash';
import React, { PropTypes } from 'react';

import axios from '../../config/axios';
import router from '../../router';

import BaseComponent from '../BaseComponent';
import Helmet from '../Helmet';
import Message from '../Message';

import GearInfoPanel from './GearInfoPanel';
import ItemPanel from './ItemPanel';
import WeaponInfoPanel from './WeaponInfoPanel';

import itemsData from '../../../shared/data/items.json';

const propTypes = {
  loadout: PropTypes.object,
};

const defaultProps = {
  loadout: {
    weapons: {},
    head: {},
    clothes: {},
    shoes: {},
  },
};

const store = {
  activeItem: {},
  equippedItems: {
    weapons: {},
    head: {},
    clothes: {},
    shoes: {},
  },
  itemsList: itemsData,
  savedPages: {
    weapons: 1,
    head: 1,
    clothes: 1,
    shoes: 1,
  },
  type: 'weapons',
  message: '',
};

function initializeStoreItemsList(props) {
  store.itemsList = _.mapValues(itemsData,
    (_itemList, type) => {
      let itemList = [..._itemList];

      // If there is an item equipped from the loadout
      if (props.loadout[type].name) {
        // Find the loadout item in the array
        const loadoutItemInList = _.find(itemList, 'name', props.loadout[type].name);

        // Remove the loadout item
        itemList = _.pull(itemList, loadoutItemInList);

        // Move the loadout item to the front of the array
        itemList.unshift(loadoutItemInList);
      }

      return itemList;
    }
  );
}

class BrowseMenu extends BaseComponent {

  constructor(props) {
    super(props);

    const { weapons, head, clothes, shoes } = props.loadout;
    store.equippedItems = { weapons, head, clothes, shoes };

    initializeStoreItemsList(props);

    store.type = 'weapons';
    store.activeItem = store.itemsList.weapons[0];

    this.state = store;

    this.bind('onCategoryBtnClick', 'equipItem', 'handleActiveItemChange',
              'handleItemEquip', 'onBackClick');
  }

  showMessage(msg) {
    store.message = msg;
    this.setState(store);

    store.message = '';
    this.setState(store);
  }

  onCategoryBtnClick(event) {
    if (store.type !== event.target.name) {
      store.type = event.target.name;
      store.activeItem = _.find(this.state.itemsList[store.type],
                                'name',
                                this.state.equippedItems[store.type].name
                                ) || this.state.itemsList[store.type][0];
    }

    this.setState(store);
  }

  handleActiveItemChange(item) {
    store.activeItem = item;

    // If item object is empty
    if (_.isEmpty(item)) store.type = '';

    this.setState(store);
  }

  onBackClick() {
    if (this.props.loadout.id) {
      router.setRoute(`/loadouts/${this.props.loadout.id}`);
    } else {
      router.setRoute('/');
    }
  }

  equipItem(page, item, type) {
    const name = item.name;
    store.equippedItems[type] = { name };
    store.savedPages[type] = page;
    this.setState(store);
  }

  handleItemEquip(page, item, type) {
    if (!this.props.loadout.id) return this.equipItem(page, item, type);

    const name = item.name;
    axios
      .post(`/loadout/${this.props.loadout.id}/equip`, { name, type })
      .then(({ data }) => {
        switch (data.code) {
          case 200:
            this.equipItem(page, item, type);
            this.showMessage(`You have equipped ${item.name}!`);
            break;
          case 400:
          case 500:
          default:
            this.showMessage(data.message);
        }
      })
      .catch(() => {
        this.showMessage('Something went wrong. Please try again!');
      });
  }

  render() {
    let title = '';

    if (this.props.loadout.id) {
      title = `Equip Items for ${this.props.loadout.name}`;
    } else {
      title = 'Browse Items';
    }

    return (
      <div className={`browse-menu ${this.state.type}`}>
        <Helmet title={ title } />

        <Message text={this.state.message} />

        <ItemPanel
          changeActiveItem={ this.handleActiveItemChange }
          equipItem={ this.handleItemEquip }
          type={ this.state.type }
          itemList={ this.state.itemsList[this.state.type] }
          savedPage={ this.state.savedPages[this.state.type] }
          equippedItem={ this.state.equippedItems[this.state.type]}
        />

        { this.state.type === 'weapons' ?

          // TODO: Change this to `WeaponInfoPanel`
          <WeaponInfoPanel
            item={this.state.activeItem}
            type={this.state.type}
          />
          :
          <GearInfoPanel
            item={this.state.activeItem}
            type={this.state.type}
          />
        }

        <br />

        <div className="category-container">
          <input
            type="button"
            value="Weapons"
            name="weapons"
            onClick={this.onCategoryBtnClick}
          />

          <input
            type="button"
            value="Head"
            name="head"
            onClick={this.onCategoryBtnClick}
          />

          <input
            type="button"
            value="Clothes"
            name="clothes"
            onClick={this.onCategoryBtnClick}
          />

          <input
            type="button"
            value="Shoes"
            name="shoes"
            onClick={this.onCategoryBtnClick}
          />
          <br />
          <p>Weapon: {this.state.equippedItems.weapons.name}</p>
          <p>| Head: {this.state.equippedItems.head.name}</p>
          <p>| Clothes: {this.state.equippedItems.clothes.name}</p>
          <p>| Shoes: {this.state.equippedItems.shoes.name}</p>
        </div>

        <button onClick={this.onBackClick}>Go Back</button>

        <div className="wave" />
      </div>
    );
  }
}

BrowseMenu.propTypes = propTypes;
BrowseMenu.defaultProps = defaultProps;

export default BrowseMenu;
