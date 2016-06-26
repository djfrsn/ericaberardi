import forEach from 'lodash.foreach';
import delay from 'lodash.delay';
import utils from 'utils';
// Looks for the closest element with data-textedittarget, hides this el & appends an html input after it
export function textEditCanvas(opts) {
  let textInputType = 'input';
  const inputParent = opts.inputParent;
  if (opts.textInputType) {
    textInputType = opts.textInputType; // pass textarea as an option for larger text editing
  }
  const textEditInputClassName = `textEdit-${textInputType}`;
  const currentTarget = opts.e.currentTarget;
  const parentElement = currentTarget.parentElement;
  let textEditTargets = [];

  // find closest textEditTarget in parentElement.children, if the target isn't found in the first parentElement we could recursively search crawl up the dom and search children if there is a use case for it
  forEach(parentElement.children, el => {
    if (el.dataset.textedittargetparent) {
      forEach(el.children, child => {
        if (child.dataset.textedittarget) {
          textEditTargets.push(el);
        }
      });
    }
    else if (el.dataset.textedittarget) {
      textEditTargets.push(el);
    }
  });

  const revertElements = () => {
    let callbackData = {};
    forEach(textEditTargets, target => {
      // target.classList.remove('hidden');
      if (target.classList.contains('textEditActiveParent')) {
        forEach(target.children, child => {
          if (child) {
            const isInputParent = child.dataset.texteditinputparent;
            if (child.dataset.texteditinputid || isInputParent) {
              // use inputs id to find corresponding textEditTarget then, update text, unhide & remove input
              child = isInputParent ? child.children[0] : child;
              let childId = child.dataset.texteditinputid;
              const parent = isInputParent ? child.parentElement.parentElement : child.parentElement;
              // if ( parent.classList.contains('textEditActiveParent')){
              //   parent.classList.remove('textEditActiveParent');
              // }
              forEach(parent.children, sibling => {
                if (sibling) {
                  if (sibling.dataset.textedittargetid === childId) {
                    sibling.innerText = child.value;
                    sibling.classList.remove('hidden');
                    sibling.setAttribute('data-texteditinputid', false);
                    callbackData[sibling.dataset.texteditid] = { text: child.value, id: sibling.dataset.texteditid };
                    let input = isInputParent ? child.parentElement : child;
                    input.remove();
                  }
                }
              });
            }
          }
        });
        delay(() => { // ensure this is the last function to run in this code block
          target.classList.remove('textEditActiveParent'); // otherwise all inputs arent reverted
        }, 0);
      }
    });
    delay(() => { // ensure callbacks runs after above processing
      currentTarget.classList.remove('textEditActive');
      if (typeof opts.callback === 'function') {
        let callbackParams = { el: currentTarget, data: callbackData, textInputType: textInputType };
        if (opts.meta) { callbackParams = { ...callbackParams, meta: opts.meta }; }
        opts.callback(callbackParams);
      }
    }, 0);
  };

  const setTextEditInput = target => {
    let textTextInputWrapped;
    const targetId = utils.uuid();
    target.classList.add('hidden');
    target.setAttribute('data-textedittargetid', targetId);
    let textEditInput = document.createElement(textInputType);
    textEditInput.className = textEditInputClassName;
    textEditInput.setAttribute('data-texteditinputid', targetId);
    textEditInput.value = target.innerText;
    if (inputParent) {
      textTextInputWrapped = document.createElement(inputParent);
      textTextInputWrapped.className = `${textEditInputClassName}-${inputParent}`;
      textTextInputWrapped.setAttribute('data-texteditinputparent', true);
      textTextInputWrapped.appendChild(textEditInput);
    }
    // add textEditInput after target
    target.parentElement.appendChild(textTextInputWrapped || textEditInput);
  };

  var textEditActive = currentTarget.classList.contains('textEditActive');
  currentTarget.classList.toggle('textEditActive');

  if (!textEditActive) {
    forEach(textEditTargets, target => {
      if (target.dataset.textedittargetparent && !target.classList.contains('textEditActiveParent')) {
        target.classList.add('textEditActiveParent');
        forEach(target.children, child => {
          if (child.dataset.textedittarget) {
            setTextEditInput(child);
          }
        });
      }
      else if (target.dataset.textedittarget) {
        setTextEditInput(target);
      }
    });

  }
  else {
    // this block runs if textEdit is called on an element being actively edited
    revertElements({currentTarget, updateText: true});
  }

  // Revert on esc key
  currentTarget.addEventListener( 'keydown', e => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 27) {
      // execute submit without update if esc key & revert element
      revertElements({currentTarget: e.currentTarget});
    }
  } );
}

export function textEdit(opts) {
  let textInputType = 'input';
  if (opts.textInputType) {
    textInputType = opts.textInputType; // pass textarea as an option for larger text editing
  }
  const textEditInputClassName = `textEdit-${textInputType}`;
  const currentTarget = opts.e.currentTarget;
  const parentElement = currentTarget.parentElement;
  let textEditInput;
  let textEditTarget;

  // find closest textEditTarget in parentElement.children, if the target isn't found in the first parentElement we could recursively search crawl up the dom and search children if there is a use case for it
  forEach(parentElement.children, el => {
    if (el.dataset.textedittarget) {
      textEditTarget = el;
    }
    else if (el.classList.contains(textEditInputClassName)) {
      textEditInput = el;
    }
  });

  const revertElements = option => {
    const currentTargetValue = option.currentTarget.value;
    if (option.updateText) {
      textEditTarget.innerText = currentTargetValue;
    }
    textEditTarget.classList.remove('hidden');
    currentTarget.classList.remove('textEditActive');
    option.currentTarget.remove(); // remove textEditInput
    if (typeof opts.callback === 'function') {
      let callbackParams = { el: currentTarget, updatedText: currentTargetValue, textInputType: textInputType };
      if (opts.meta) { callbackParams = { ...callbackParams, meta: opts.meta }; }
      opts.callback(callbackParams);
    }
  };

  var textEditActive = currentTarget.classList.contains('textEditActive');
  currentTarget.classList.toggle('textEditActive');

  if (!textEditActive) { // add textEditInput & hide textEditTarget
    // Hide target
    textEditTarget.classList.add('hidden');

    textEditInput = document.createElement(textInputType);
    textEditInput.className = textEditInputClassName;
    textEditInput.value = textEditTarget.innerText;
    // add textEditInput after textEditTarget
    textEditTarget.parentNode.insertBefore(textEditInput, textEditTarget.nextSibling);

    // track key events on input to revert on esc or enter key
    textEditInput.addEventListener( 'keydown', e => {
      const keyCode = e.keyCode || e.which;
      if (keyCode === 13) {
        // execute submit event & revert element
        revertElements({currentTarget: e.currentTarget, updateText: true});
      }
      else if (keyCode === 27) {
        // execute submit without update if esc key & revert element
        revertElements({currentTarget: e.currentTarget});
      }
    } );

  }
  else {
    // this block runs if textEdit is called on an element being actively edited
    revertElements({currentTarget: textEditInput, updateText: true});
  }
}
