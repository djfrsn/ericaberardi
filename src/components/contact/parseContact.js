import forIn from 'lodash.forin';

export default opts => {
  let equal = true;
  let newContact = { ...opts.prevContact.content };
  // Check email/form title for any changes
  forIn(opts.newContact, (contact, type) => {
    const typeData = type.split('-');
    const contactType = typeData[0];
    const contactId = typeData[1];
    const prevContact = opts.prevContact.content[contactType][contactId];

    const prevText = prevContact.pendingtext ? prevContact.pendingtext : prevContact.text; // use pendingtext or original content
    if (contact.text !== prevText) { // for comparison with contact.text
      newContact[contactType][contactId].pending = true; // update contact with pending text
      newContact[contactType][contactId].pendingtext = contact.text;
      equal = false;
    }
  });
  // Check socialicons for changes
  forIn(opts.scope.state.socialicons, (icon, iconId) => {
    const prevIcon = opts.prevContact.content.socialicons[iconId];
    const prevIconSrc = prevIcon.pendingsrc ? prevIcon.pendingsrc : prevIcon.src; // use pendingsrc or original content
    if (icon.src !== prevIconSrc) {
      newContact.socialicons[iconId].pending = true;
      newContact.socialicons[iconId].pendingsrc = icon.src;
      equal = false;
    }
  });

  return { equal, newContact };
};
