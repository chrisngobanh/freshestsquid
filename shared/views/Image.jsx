/**
 * This is a wrapper for images
 * If this.props.onClick is defined, it'll show the image with the <input> tag
 * Otherwise, it'll show the image with the <img> tag
 */

import React, { PropTypes } from 'react';

import BaseComponent from './BaseComponent';

import { CDN_ROOT } from '../config/env';

class Image extends BaseComponent {

  render() {
    return (
      this.props.onClick
      ?
      <input
        type="image"
        className={ this.props.className }
        onClick={ this.props.onClick }
        onMouseEnter={ this.props.onHover }
        src={ CDN_ROOT + this.props.src }
        alt={ this.props.alt }
      />
      :
      <img
        className={ this.props.className }
        onMouseEnter={ this.props.onHover }
        src={ CDN_ROOT + this.props.src }
        alt={ this.props.alt }
      />
    );
  }

}

const defaultProps = {
  alt: '',
};

const propTypes = {
  className: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
};

Image.propTypes = propTypes;
Image.defaultProps = defaultProps;

export default Image;
