import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { pricingActions } from 'core/pricing';
import { parsePath } from 'lava';
import pricingCategories from './pricingCategories';
import pricingPackages from './pricingPackages';

export class Pricing extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    pricing: PropTypes.object.isRequired
  }
  componentDidMount() {
    const { pathname } = this.props.location;
    this.path = parsePath(pathname).path; // stores currentCategory
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    this.path = parsePath(pathname).path;
  }
  render() {
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="pricing__container">
            <ul className="pricing__categories">
              {pricingCategories({ props: this.props, category: this.path, scope: this })}
            </ul>
            <div className="pricing__packages_wrapper">
              <div className="pricing__package">
                <ul className="pricing__list">
                  {pricingPackages({ props: this.props, category: this.path, scope: this })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  pricing: state.pricing,
  auth: state.auth
}), Object.assign({}, authActions, pricingActions))(Pricing);
// [ Under Construction ]
