import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { pricingActions } from 'core/pricing';
import { parsePath } from 'lava';
// import pricingCategories from './pricingCategories';
// import pricingPackages from './pricingPackages';
import { textEdit, textEditCanvas } from 'helpers/textEdit';
import parsePackages from './parsePackages';

export class Pricing extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
    editPricingCategory: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    pricing: PropTypes.object.isRequired
  }
  componentWillMount() {
    const { pathname } = this.props.location;
    this.path = parsePath(pathname).path; // stores currentCategory
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    const newPathname = parsePath(pathname).path;
    this.path = newPathname;
  }
  textEditTargetReverted = opts => {
    let dispatchType;
    let valueChanged = false;
    let data = {};
    if (opts.meta.type === 'category') {
      dispatchType = 'editPricingCategory';
      const categoryProp = this.props.pricing.categories[opts.el.parentElement.id];
      const valueKey = categoryProp.pending ? 'pendingCategory' : 'category'; // if value isn't pending
      valueChanged = opts.updatedText !== categoryProp[valueKey]; // check category key, otherwise compare to pendingCategory value
      data = { id: opts.el.parentElement.id, text: opts.updatedText };
    }
    if (opts.meta.type === 'packages') {
      dispatchType = 'editPricingPackages';
      const parsedPackages = parsePackages({ newPkgs: opts.data, prevPkgsCategory: this.props.pricing.packages[this.activeCategoryId] });
      valueChanged = !parsedPackages.equal;
      data = { newPkgsCategory: parsedPackages.newPkgsCategory };
    }

    if (valueChanged) {
      this.props[dispatchType](data);
    }
  }
  editPricingCategory = e => {
    textEdit({e, className: 'textEdit-category', callback: this.textEditTargetReverted, meta: { type: 'category' }});
  }
  editPricingPackages = e => {
    // canvas find all data-textedittarget's in a given parent & makes them text editable
    textEditCanvas({e, className: 'textEdit-package', inputParent: 'li', callback: this.textEditTargetReverted, meta: { type: 'packages' }});
  }
  render() {
    // const authenticated = this.props.auth.authenticated;
    return (
      <div className="g-row">
        <div className="g-col" >
          <div style={{textAlign: 'center', marginTop: '60px'}}>
            [ Under Construction ]
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

// <div className="pricing__container">
//   <div className="pricing__categories">
//     <ul>
//       {pricingCategories({ props: this.props, category: this.path, scope: this })}
//     </ul>
//   </div>
//   <div className="pricing__packages_wrapper">
//     <div className="pricing__package">
//       <ul className="pricing__list">
//         {authenticated && Object.keys(this.props.pricing.categories).length > 0 ? <i onClick={this.editPricingPackages} className="fa fa-pencil-square-o pricing__categories_edit" aria-hidden="true"></i> : null}
//         {pricingPackages({ props: this.props, category: this.path, scope: this })}
//       </ul>
//     </div>
//   </div>
// </div>
