import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { pricingActions } from 'core/pricing';
import { parsePath } from 'lava';
import pricingCategories from './pricingCategories';
import pricingPackages from './pricingPackages';
import textEdit from 'helpers/textEdit';

export class Pricing extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    pricing: PropTypes.object.isRequired
  }
  componentWillMount() {
    const { pathname } = this.props.location;
    this.path = parsePath(pathname).path; // stores currentCategory
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    this.path = parsePath(pathname).path;
  }
  textEditTargetReverting = opts => {
    // callback textEdit calls to pass relevant data about dom changes to update state
  }
  editPricingCategory = e => {
    textEdit({e, callback: this.textEditTargetReverting});
  }
  render() {
    return (
      <div className="g-row">
        <div className="g-col" >
          <div className="pricing__container">
            <div className="pricing__categories">
              <ul>
                {pricingCategories({ props: this.props, category: this.path, scope: this })}
              </ul>
            </div>
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
