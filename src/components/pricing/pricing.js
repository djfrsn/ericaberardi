import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { authActions } from 'core/auth';
import { pricingActions } from 'core/pricing';
import { parsePath } from 'lava';
import pricingCategories from './pricingCategories';
import pricingPackages from './pricingPackages';
import { textEdit, textEditCanvas } from 'helpers/textEdit';
import forIn from 'lodash.forin';

// determine if any packages have had their text changed
// & returned new package object with any pending data
function parsePackages(opts) {
  let equal = true;
  const prevPkgsCategory = opts.prevPkgsCategory;
  let newPkgsCategory = { ...prevPkgsCategory };
  let newPkgs = {};
  // TODO: update details & pkgs with orderBy
  // loop  through packages & compare with data returned by textEdit to determine if any packages are pending
  forIn(prevPkgsCategory.packages, pkg => {
    let newPkg = { ...pkg };
    let newDetails = {};
    let newTitleText = opts.newPkgs[pkg.id].text;
    if (newTitleText !== pkg.title) {
      newPkg.titlePending = true;
      newPkg.pendingTitle = newTitleText;
      equal = false; // signify data has changed
    }
    forIn(pkg.details, detail => {
      const detailId = detail.id;
      const newDetailText = opts.newPkgs[detailId].text;
      if (detail.text !== newDetailText) {
        newPkg.detailsPending = true; // update details with new text if unequal
        newDetails[detailId] = { ...detail, text: newDetailText };
      }
      else {
        newDetails[detailId] = detail;
      }
    });
    if (newPkg.detailsPending) {
      newPkg.pendingDetails = newDetails;
      equal = false; // signify data has changed
    }
    newPkgs[pkg.id] = newPkg;
  });
  // add newPkgs with pendingDetails/Title if they exist
  newPkgsCategory.packages = newPkgs;

  return { equal, newPkgsCategory };
}

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
    this.path = parsePath(pathname).path;
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
    textEdit({e, callback: this.textEditTargetReverted, meta: { type: 'category' }});
  }
  editPricingPackages = e => {
    // canvas find all data-textedittarget's in a given parent & makes them text editable
    textEditCanvas({e, inputParent: 'li', callback: this.textEditTargetReverted, meta: { type: 'packages' }});
  }
  render() {
    const authenticated = this.props.auth.authenticated;
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
                  {authenticated && Object.keys(this.props.pricing.categories).length > 0 ? <i onClick={this.editPricingPackages} className="fa fa-pencil-square-o pricing__categories_edit" aria-hidden="true"></i> : null}
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
