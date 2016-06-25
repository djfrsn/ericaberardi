import forEach from 'lodash.foreach';

// Looks for the closest element with data-textedittarget, hides this el & appends an html input after it
export default function textEdit(opts) {
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
    option.currentTarget.remove();
    if (typeof opts.callback === 'function') {
      opts.callback({
        e: opts.e,
        updatedText: currentTargetValue,
        textInputType: textInputType
      });
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
