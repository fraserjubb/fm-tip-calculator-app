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
function blurOnEnter(e) {
  if (e.key === 'Enter') {
    e.target.blur();
  }
}

function handleUserInput() {
  let billInputValue = billInput.value;
  let peopleInputValue = peopleInput.value;
  let customTip = customTipInputEl.value;

  // Remove invalid characters (anything that's not digit or dot)
  billInputValue = billInputValue.replace(/[^0-9.]/g, '');

  // Remove invalid characters (anything that's not digit)
  peopleInputValue = peopleInputValue.replace(/[^0-9]/g, '');
  customTip = customTip.replace(/[^0-9]/g, '');

  // Allow only one decimal point
  const parts = billInputValue.split('.');
  if (parts.length > 2) {
    billInputValue = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limit to two decimal places
  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2);
    billInputValue = parts[0] + '.' + parts[1];
  }

  // Expand length if bill is a higher value
  if (parts[0].length >= 4 && billInputValue.includes('.')) {
    billInput.maxLength = parts[0].length + 3;
  } else {
    billInput.maxLength = 6;
  }

  billInput.value = billInputValue;
  peopleInput.value = peopleInputValue;
  customTipInputEl.value = customTip;
}

function handlePeopleValue() {
  const peopleInputValue = peopleInput.value;

  peopleErrorText.classList.toggle('hidden', peopleInputValue !== '0');
  peopleInput.classList.toggle('calculator__input--error', peopleInputValue === '0');
}

function calculateTotals() {
  const peopleInputValue = peopleInput.value;
  const billInputValue = billInput.value;

  const peopleCount = Number(peopleInputValue);
  const billAmount = Number(billInputValue);

  // Which tip source is active: default buttons or custom %
  let activeTipRate = 0;
  if (selectedPresetTipRate > 0) {
    activeTipRate = selectedPresetTipRate;
  } else if (customTipRate > 0) {
    activeTipRate = customTipRate;
  }

  // Reset button should show if any field has *visible* input
  const isAnyFieldFilled = peopleInputValue !== '' || billInputValue !== '' || activeTipRate > 0;
  resetButton.classList.toggle('calculator__reset--active', isAnyFieldFilled);

  // All required values present?
  const hasAllInputs = peopleCount > 0 && billAmount > 0 && activeTipRate > 0;

  // Calculations
  const tipPerPerson = hasAllInputs ? (billAmount * activeTipRate) / peopleCount : 0;
  const totalPayment = hasAllInputs ? tipPerPerson * peopleCount + billAmount : 0;

  tipPerPersonDisplay.textContent = `$${tipPerPerson.toFixed(2)}`;
  totalAmountDisplay.textContent = `$${totalPayment.toFixed(2)}`;
}

function handleTipSelection(e) {
  clearSelectedCustomTip();
  tipRadioInputs.forEach(tip => {
    const tipValue = tip.nextElementSibling;
    tipValue.classList.toggle('calculator__tip-label--selected', tip.checked);
  });
  selectedPresetTipRate = Number(e.currentTarget.value);

  calculateTotals();
}

function handleCustomTipEntry() {
  clearSelectedPresetTip();

  customTipRate = Number(customTipInputEl.value) / 100;
  customTipInputEl.classList.add('calculator__tip-label--selected');
  calculateTotals();
}

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

/* 
********************************
EVENT LISTENERS:
********************************
*/

/* 
*******
Inputs:
*******
*/
[billInput, peopleInput, customTipInputEl].forEach(input => {
  input.addEventListener('input', handleUserInput);
  input.addEventListener('keydown', blurOnEnter);
});
peopleInput.addEventListener('change', handlePeopleValue);

[billInput, peopleInput].forEach(input => input.addEventListener('change', calculateTotals));
tipRadioInputs.forEach(tip => tip.addEventListener('change', handleTipSelection));
customTipInputEl.addEventListener('change', handleCustomTipEntry);

// Custom tip input style when being used
customTipInputEl.addEventListener('focus', () => {
  clearSelectedPresetTip();
  customTipPercentSymbol.style.display = 'block';
  customTipPercentSymbol.style.color = 'var(--clr-grey-550)';
  customTipInputEl.style.color = 'var(--clr-grey-550)';
});

// Custom tip input style changes when clicked out of element.
customTipInputEl.addEventListener('blur', () => {
  if (customTipInputEl.value === '') {
    customTipPercentSymbol.style.display = 'none';
  }
  if (customTipInputEl.value.length >= 1) {
    customTipInputEl.style.color = 'var(--clr-green-900)';
    customTipPercentSymbol.style.color = 'var(--clr-green-900)';
  }
});

// Custom tip input - Dynamic Percent Symbol distance
customTipInputEl.addEventListener('input', () => {
  if (customTipInputEl.value.length === 1) {
    customTipPercentSymbol.style.right = '2.25rem';
  } else if (customTipInputEl.value.length === 2) {
    customTipPercentSymbol.style.right = '1.75rem';
  }
});

/* 
*******
Reset Button:
*******
*/
resetButton.addEventListener('click', () => {
  clearInputs();
  clearSelectedCustomTip();
  clearSelectedPresetTip();
  calculateTotals();
});
