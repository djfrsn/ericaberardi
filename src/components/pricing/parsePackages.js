import forIn from 'lodash.forin';
// determine if any packages have had their text changed
// & returned new package object with any pending data
export default opts => {
  let equal = true;
  const prevPkgsCategory = opts.prevPkgsCategory;
  let newPkgsCategory = { ...prevPkgsCategory };
  let newPkgs = {};
  // TODO: update details & pkgs with orderBy
  // loop  through packages & compare with data returned by textEdit to determine if any packages are pending
  forIn(prevPkgsCategory.packages, pkg => {
    let newPkg = { ...pkg };
    let newDetails = {};
    let detailsPending;
    let newTitleText = opts.newPkgs[pkg.id].text;
    if (newTitleText !== pkg.title) {
      newPkgsCategory.pending = true;
      newPkg.pendingTitle = newTitleText;
      equal = false; // signify data has changed
    }
    forIn(pkg.details, detail => {
      const detailId = detail.id;
      const newDetailText = opts.newPkgs[detailId].text;
      if (detail.text !== newDetailText) {
        detailsPending = true; // update details with new text if unequal
        newDetails[detailId] = { ...detail, text: newDetailText };
      }
      else {
        newDetails[detailId] = detail;
      }
    });
    if (detailsPending) {
      newPkg.pendingDetails = newDetails;
      newPkgsCategory.pending = true;
      equal = false; // signify data has changed
    }
    newPkgs[pkg.id] = newPkg;
  });
  // add newPkgs with pendingDetails/Title if they exist
  newPkgsCategory.packages = newPkgs;

  return { equal, newPkgsCategory };
}
