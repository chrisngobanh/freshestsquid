import { Component } from 'react';

class BaseComponent extends Component {
  bind(...methods) {
    methods.forEach((method) => this[method] = this[method].bind(this));
  }
}

export default BaseComponent;
