/* 
********************************
DOM SELECTORS:
********************************
*/
const billInput = document.querySelector('#bill-input');
const peopleInput = document.querySelector('#people-input');

const tipInputs = Array.from(document.querySelectorAll('.calculator__tip-input'));

const customTipInput = document.querySelector('.calculator__input--custom');
const percentSymbol = document.querySelector('.calculator__input--custom-container span');

const tipDisplay = document.querySelector('#calculator__tip-amount');
const totalDisplay = document.querySelector('#total');

const peopleErrorMessage = document.querySelector('.calculator__people--error');

const resetBtn = document.querySelector('.calculator__reset');

/* 
********************************
GLOBAL VARIABLES:
********************************
*/
let tipPercent = 0;
let customTip = 0;

/* 
********************************
FUNCTIONS:
********************************
*/
function removeFocus(e) {
  if (e.key === 'Enter') {
    e.target.blur();
  }
}

function handleUserInput() {
  let bill = billInput.value;
  let people = peopleInput.value;
  let customTip = customTipInput.value;

  // Remove invalid characters (anything that's not digit or dot)
  bill = bill.replace(/[^0-9.]/g, '');

  // Remove invalid characters (anything that's not digit)
  people = people.replace(/[^0-9]/g, '');
  customTip = customTip.replace(/[^0-9]/g, '');

  // Allow only one decimal point
  const parts = bill.split('.');
  if (parts.length > 2) {
    bill = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limit to two decimal places
  if (parts[1]) {
    parts[1] = parts[1].slice(0, 2);
    bill = parts[0] + '.' + parts[1];
  }

  // Expand length if bill is a higher value
  if (parts[0].length >= 4 && bill.includes('.')) {
    billInput.maxLength = parts[0].length + 3;
  } else {
    billInput.maxLength = 6;
  }

  billInput.value = bill;
  peopleInput.value = people;
  customTipInput.value = customTip;
}

function handlePeopleValue() {
  const peopleRaw = peopleInput.value;

  peopleErrorMessage.classList.toggle('hidden', peopleRaw !== '0');
  peopleInput.classList.toggle('calculator__input--error', peopleRaw === '0');
}

function updateTipAmount() {
  const peopleRaw = peopleInput.value;
  const billRaw = billInput.value;

  const people = Number(peopleRaw);
  const bill = Number(billRaw);

  let tipInputActive = 0;
  if (tipPercent > 0) {
    tipInputActive = tipPercent;
  } else if (customTip > 0) {
    tipInputActive = customTip;
  }

  const anyInput = peopleRaw !== '' || billRaw !== '' || tipInputActive > 0;
  resetBtn.classList.toggle('calculator__reset--active', anyInput);

  const inputsComplete = people > 0 && bill > 0 && tipInputActive > 0;

  const tip = inputsComplete ? (bill * tipInputActive) / people : 0;
  const total = inputsComplete ? tip * people + bill : 0;

  tipDisplay.textContent = `$${tip.toFixed(2)}`;
  totalDisplay.textContent = `$${total.toFixed(2)}`;
}

function getTip(e) {
  deselectCustomTip();
  tipInputs.forEach(tip => {
    const tipValue = tip.nextElementSibling;
    tipValue.classList.toggle('calculator__tip-label--selected', tip.checked);
  });
  tipPercent = Number(e.currentTarget.value);

  updateTipAmount();
}

function getCustomTip() {
  deselectDefaultTip();

  customTip = Number(customTipInput.value) / 100;
  customTipInput.classList.add('calculator__tip-label--selected');
  updateTipAmount();
}

function deselectCustomTip() {
  customTip = 0;
  customTipInput.value = '';
  customTipInput.classList.remove('calculator__tip-label--selected');
  percentSymbol.style.display = 'none';
}

function deselectDefaultTip() {
  tipPercent = 0;
  tipInputs.forEach(tip => {
    const tipValue = tip.nextElementSibling;
    tipValue.classList.remove('calculator__tip-label--selected');
    tip.checked = false;
  });
}

function resetInputs() {
  billInput.value = '';
  peopleInput.value = '';
  peopleErrorMessage.classList.add('hidden');
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
[billInput, peopleInput, customTipInput].forEach(input => {
  input.addEventListener('input', handleUserInput);
  input.addEventListener('keydown', removeFocus);
});
peopleInput.addEventListener('change', handlePeopleValue);

[billInput, peopleInput].forEach(input => input.addEventListener('change', updateTipAmount));
tipInputs.forEach(tip => tip.addEventListener('change', getTip));
customTipInput.addEventListener('change', getCustomTip);

// Custom tip input style when being used
customTipInput.addEventListener('focus', () => {
  deselectDefaultTip();
  percentSymbol.style.display = 'block';
  percentSymbol.style.color = 'var(--clr-grey-550)';
  customTipInput.style.color = 'var(--clr-grey-550)';
});

// Custom tip input style changes when clicked out of element.
customTipInput.addEventListener('blur', () => {
  if (customTipInput.value === '') {
    percentSymbol.style.display = 'none';
  }
  if (customTipInput.value.length >= 1) {
    customTipInput.style.color = 'var(--clr-green-900)';
    percentSymbol.style.color = 'var(--clr-green-900)';
  }
});

// Custom tip input - Dynamic Percent Symbol distance
customTipInput.addEventListener('input', () => {
  if (customTipInput.value.length === 1) {
    percentSymbol.style.right = '2.25rem';
  } else if (customTipInput.value.length === 2) {
    percentSymbol.style.right = '1.75rem';
  }
});

/* 
*******
Reset Button:
*******
*/
resetBtn.addEventListener('click', () => {
  resetInputs();
  deselectCustomTip();
  deselectDefaultTip();
  updateTipAmount();
});
