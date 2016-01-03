/* eslint id-length: 0 */

import $ from 'jquery';
import React, { PropTypes } from 'react';

import BaseComponent from '../BaseComponent';
import Image from '../Image';
import ItemBox from './ItemBox';

import itemsData from '../../../shared/data/items.json';

const ITEMS_PER_PAGE = 12;

const store = {
  lastPage: 1,
  page: 1,
  type: 'weapons',
};


class ItemPanel extends BaseComponent {

  constructor(props) {
    super(props);
    store.lastPage = Math.ceil(itemsData[props.type].length / ITEMS_PER_PAGE);
    store.type = props.type;
    this.state = store;
    this.bind('handleEquipItem', 'onLeftButtonPress', 'onRightButtonPress');
  }

  componentDidMount() {
    const $document = $(document);

    // Handle `keydown` event on document
    $document.keydown((e) => {
      switch (e.keyCode) {
        case 37:
        case 76:

          // 37: Left Arrow
          // 76: L
          this.onLeftButtonPress();
          break;
        case 39:
        case 82:

          // 39: Right Arrow
          // 82: R
          this.onRightButtonPress();
          break;
        case 27:
        case 66:

          // 8: Esc
          // 66: B
          // this.onBackButtonPress();
          break;
        default:

          // Do nothing
      }
    });
  }

  componentWillReceiveProps(props) {
    if (this.state.type !== props.type) {
      store.page = props.savedPage;
      store.lastPage = Math.ceil(itemsData[props.type].length / ITEMS_PER_PAGE);

      // Cache the type
      store.type = props.type;

      this.setState(store);
    }
  }

  onLeftButtonPress() {
    store.page--;

    if (store.page < 1) store.page = this.state.lastPage;

    this.setState(store);
    this.handleActiveItemChange(store.page);
  }

  onRightButtonPress() {
    store.page++;

    // If the curPage is greater than the lastPage, then change it to 1
    if (store.page > this.state.lastPage) store.page = 1;

    this.setState(store);
    this.handleActiveItemChange(store.page);
  }

  // TODO: Change name
  handleActiveItemChange(page) {
    const lower = (page - 1) * ITEMS_PER_PAGE;
    const item = itemsData[this.props.type][lower];
    this.props.changeActiveItem(item);
  }

  handleEquipItem(item) {
    this.props.equipItem(this.state.page, item, this.state.type);
  }

  render() {
    const itemElementsList = [];

    const lower = (this.state.page - 1) * ITEMS_PER_PAGE;
    const higher = this.state.page * ITEMS_PER_PAGE;

    const itemsOnPage = this.props.itemList.slice(lower, higher);

    itemsOnPage.forEach((item) => {
      const itemBox = (
        <ItemBox
          changeActiveItem={ this.props.changeActiveItem }
          equipItem={ this.handleEquipItem }
          item={ item }
          key={ item.name }
          type={ this.props.type }
          isEquipped={ this.props.equippedItem.name === item.name }
        />
      );

      itemElementsList.push(itemBox);
    });

    const circles = [];
    for (let i = 1; i < this.state.lastPage + 1; i++) {
      let className = `circle ${this.state.type}`;

      if (i === this.state.page) className += ' active';
      circles.push(
        <div
          className={ className }
          key={`circle-${i}`}
        />
      );
    }

    return (
      <div className="item-panel">
        <Image className="hidden-img" src="img/item-panel.png" />

        <div className="item-container">
          { itemElementsList }
        </div>


        <Image
          alt="Left Bumper"
          className="pagination-btn lb"
          key="lb"
          onClick={ this.onLeftButtonPress }
          src="img/lb.png"
        />

        <Image
          alt="Right Bumper"
          className="pagination-btn rb"
          key="rb"
          onClick={ this.onRightButtonPress }
          src="img/rb.png"
        />
        <div className="page-circles">
          { circles }
        </div>
        {/*
        <Image
          alt="Back Button"
          className="back-btn"
          key="bb"
          onClick={ this.onBackButtonPress }
          src="img/back-btn.png"
        />
        */}

      </div>
    );
  }
}

const propTypes = {
  type: PropTypes.string,
};

ItemPanel.propTypes = propTypes;

export default ItemPanel;
