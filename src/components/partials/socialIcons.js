import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { contactActions } from 'core/contact';
import forIn from 'lodash.forin';
import forEach from 'lodash.foreach';
import orderBy from 'lodash.orderBy';

export class socialIcons extends Component {
  static propTypes = {
    contact: PropTypes.object.isRequired,
    selectorName: PropTypes.string
  }
  render() {
    const { contact } = this.props;
    const iconsWrapperClass = this.props.selectorName ? `${this.props.selectorName} contact__social_icons` : 'contact__social_icons';
    let icons = [];
    let sortedIcons = [];
    const iconClassDictionary = {
      facebook: 'fa-facebook-official',
      twitter: 'fa-twitter',
      instagram: 'fa-instagram',
      google: 'fa-google-plus'
    };
    if (Object.keys(contact.content).length > 0) {
      forIn(contact.content.socialicons, icon => {
        icons.push(
          <a key={icon.id} orderby={icon.orderby} href={icon.pendingsrc ? icon.pendingsrc : icon.src} target="_blank" className="contact__social_link">
            <i className={`fa ${iconClassDictionary[icon.type]}`} aria-hidden="true"></i>
          </a>);
      });
      forEach(icons, option => { // create new array with value as top lvl prop for easy sorting
        sortedIcons.push({...option, value: option.props.orderby});
      });
      sortedIcons = orderBy(sortedIcons, 'value', 'asc');
    }
    return (
      <div className={iconsWrapperClass}>
        {sortedIcons}
      </div>
    );
  }
}

export default connect(state => ({
  contact: state.contact
}), Object.assign({}, contactActions))(socialIcons);
