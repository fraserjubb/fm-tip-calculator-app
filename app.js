/* 
********************************
DOM SELECTORS:
********************************
*/
const billInput = document.querySelector('#bill-input');
const peopleInput = document.querySelector('#people-input');

const tipRadioInputs = Array.from(document.querySelectorAll('.calculator__tip-input'));

const customTipInputEl = document.querySelector('.calculator__input--custom');
const customTipPercentSymbol = document.querySelector('.calculator__input--custom-container span');

const tipPerPersonDisplay = document.querySelector('#calculator__tip-amount');
const totalAmountDisplay = document.querySelector('#total');

const peopleErrorText = document.querySelector('.calculator__people--error');

const resetButton = document.querySelector('.calculator__reset');

/* 
********************************
GLOBAL VARIABLES:
********************************
*/
let selectedPresetTipRate = 0;
let customTipRate = 0;

/* 
********************************
FUNCTIONS:
********************************
*/
/* 
**********
Sanitizer Functions:
**********
*/
function sanitizeBillInput() {
  let billInputValue = billInput.value;

  // Remove invalid characters (anything that's not digit or dot)
  billInputValue = billInputValue.replace(/[^0-9.]/g, '');

  // Allow only one decimal point
  let [integerPart, decimalPart] = billInputValue.split('.');
  if (decimalPart) {
    decimalPart = decimalPart.slice(0, 2);
    billInputValue = `${integerPart}.${decimalPart}`;
  }

  // Expand length if bill is a higher value
  if (integerPart.length >= 4 && billInputValue.includes('.')) {
    billInput.maxLength = integerPart.length + 3;
  } else {
    billInput.maxLength = 6;
  }

  billInput.value = billInputValue;
}

function sanitizePeopleInput() {
  let peopleInputValue = peopleInput.value;
  // Remove invalid characters (anything that's not digit)
  peopleInputValue = peopleInputValue.replace(/[^0-9]/g, '');

  peopleInput.value = peopleInputValue;
}

function sanitizeCustomTipInput() {
  let customTip = customTipInputEl.value;
  // Remove invalid characters (anything that's not digit)
  customTip = customTip.replace(/[^0-9]/g, '');

  customTipInputEl.value = customTip;
}

/* 
**********
Input / UI Handler Functions:
**********
*/
function handleUserInput() {
  sanitizeBillInput();
  sanitizePeopleInput();
  sanitizeCustomTipInput();
}

function handlePeopleValue() {
  const peopleInputValue = peopleInput.value;

  peopleErrorText.classList.toggle('hidden', peopleInputValue !== '0');
  peopleInput.classList.toggle('calculator__input--error', peopleInputValue === '0');
}

function getActiveTip() {
  let activeTipRate = 0;
  if (selectedPresetTipRate > 0) {
    activeTipRate = selectedPresetTipRate;
  } else if (customTipRate > 0) {
    activeTipRate = customTipRate;
  }
  return activeTipRate;
}

function updateTotals() {
  const peopleCount = Number(peopleInput.value);
  const billAmount = Number(billInput.value);
  const activeTipRate = getActiveTip();

  // Reset button should show if any field has *visible* input
  const isAnyFieldFilled = peopleInput.value.length > 0 || billInput.value.length > 0 || activeTipRate > 0;
  resetButton.classList.toggle('calculator__reset--active', isAnyFieldFilled);

  // All required values present?
  const hasAllInputs = peopleInput.value.length > 0 && billInput.value.length > 0 && activeTipRate > 0;

  if (!hasAllInputs) {
    tipPerPersonDisplay.textContent = `$0.00`;
    totalAmountDisplay.textContent = `$0.00`;
    return;
  }

  // Calculations if all inputs are present
  const tipPerPerson = (billAmount * activeTipRate) / peopleCount;
  const totalPerPerson = billAmount / peopleCount + tipPerPerson;

  tipPerPersonDisplay.textContent = `$${tipPerPerson.toFixed(2)}`;
  totalAmountDisplay.textContent = `$${totalPerPerson.toFixed(2)}`;
}

function handleTipSelection(e) {
  clearSelectedCustomTip();
  tipRadioInputs.forEach(tip => {
    const tipValue = tip.nextElementSibling;
    tipValue.classList.toggle('calculator__tip-label--selected', tip.checked);
  });
  selectedPresetTipRate = Number(e.currentTarget.value);

  updateTotals();
}

function handleCustomTipEntry() {
  clearSelectedPresetTip();

  customTipRate = Number(customTipInputEl.value) / 100;
  customTipInputEl.classList.add('calculator__tip-label--selected');
  updateTotals();
}

/* 
**********
Selection / Clearing Functions:
**********
*/
function clearSelectedCustomTip() {
  customTipRate = 0;
  customTipInputEl.value = '';
  customTipInputEl.classList.remove('calculator__tip-label--selected');
  customTipPercentSymbol.style.display = 'none';
}

function clearSelectedPresetTip() {
  selectedPresetTipRate = 0;
  tipRadioInputs.forEach(tip => {
    const tipValue = tip.nextElementSibling;
    tipValue.classList.remove('calculator__tip-label--selected');
    tip.checked = false;
  });
}

function clearInputs() {
  billInput.value = '';
  peopleInput.value = '';
  peopleErrorText.classList.add('hidden');
  peopleInput.classList.remove('calculator__input--error');
}

function handleResetClick() {
  clearInputs();
  clearSelectedCustomTip();
  clearSelectedPresetTip();
  updateTotals();
}

/* 
**********
UI Styling / Focus / Blur Functions:
**********
*/
function handleCustomTipFocus() {
  clearSelectedPresetTip();
  customTipPercentSymbol.style.display = 'block';
  customTipPercentSymbol.style.color = 'var(--clr-grey-550)';
  customTipInputEl.style.color = 'var(--clr-grey-550)';
}

function handleCustomTipBlur() {
  if (customTipInputEl.value === '') {
    customTipPercentSymbol.style.display = 'none';
  }
  if (customTipInputEl.value.length >= 1) {
    customTipInputEl.style.color = 'var(--clr-green-900)';
    customTipPercentSymbol.style.color = 'var(--clr-green-900)';
  }
}

function adjustCustomTipSymbolPosition() {
  if (customTipInputEl.value.length === 1) {
    customTipPercentSymbol.style.right = '2.25rem';
  } else if (customTipInputEl.value.length === 2) {
    customTipPercentSymbol.style.right = '1.75rem';
  }
}

/* 
**********
Utility Functions:
**********
*/
function blurOnEnter(e) {
  if (e.key === 'Enter') {
    e.target.blur();
  }
}

function removeTrailingDot() {
  if (billInput.value[billInput.value.length - 1] === '.') {
    billInput.value = billInput.value.slice(0, -1);
  }
}

/* 
********************************
EVENT LISTENERS:
********************************
*/

/* 
*******
Input Elements – General input handling:
*******
*/
[billInput, peopleInput, customTipInputEl].forEach(input => {
  input.addEventListener('input', handleUserInput);
  input.addEventListener('keydown', blurOnEnter);
});

/* 
*******
People input specific:
*******
*/
peopleInput.addEventListener('change', handlePeopleValue);

/* 
*******
Trigger calculations on change:
*******
*/
[billInput, peopleInput].forEach(input => input.addEventListener('change', updateTotals));
tipRadioInputs.forEach(tip => tip.addEventListener('change', handleTipSelection));
customTipInputEl.addEventListener('change', handleCustomTipEntry);

/* 
*******
Bill input – remove trailing dot:
*******
*/
billInput.addEventListener('change', removeTrailingDot);

/* 
*******
Custom tip input – UI styling / focus / blur:
*******
*/
// Style when being used
customTipInputEl.addEventListener('focus', () => {
  handleCustomTipFocus();
});

// Style changes when clicked out of element.
customTipInputEl.addEventListener('blur', () => {
  handleCustomTipBlur();
});

// Dynamic Percent Symbol distance
customTipInputEl.addEventListener('input', () => {
  adjustCustomTipSymbolPosition();
});

/* 
*******
Reset Button:
*******
*/
resetButton.addEventListener('click', () => {
  handleResetClick();
});
