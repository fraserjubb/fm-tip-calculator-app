const billInput = document.querySelector('#bill-input');
const peopleInput = document.querySelector('#people-input');

const selectedTip = Array.from(document.querySelectorAll('.calculator__tip-amount'));

const tipDisplay = document.querySelector('#calculator__tip-amount');
const totalDisplay = document.querySelector('#total');

const resetBtn = document.querySelector('.calculator__reset');

let tipPercent = 0;

function handleUserInput() {
  let bill = billInput.value;
  let people = peopleInput.value;

  // Remove invalid characters (anything that's not digit or dot)
  bill = bill.replace(/[^0-9.]/g, '');

  // Remove invalid characters (anything that's not digit)
  people = people.replace(/[^0-9]/g, '');

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
}

function updateTipAmount() {
  const people = Number(peopleInput.value);
  const bill = Number(billInput.value);
  const tip = people > 0 && bill > 0 && tipPercent > 0 ? (bill * tipPercent) / people : 0;
  const total = tip * people + bill;

  tipDisplay.textContent = `$${tip.toFixed(2)}`;
  totalDisplay.textContent = `$${total.toFixed(2)}`;
}

function getTip(e) {
  selectedTip.forEach(tip => {
    const tipValue = tip.nextElementSibling;
    tipValue.classList.toggle('calculator__tip-option--selected', tip.checked);
  });
  tipPercent = Number(e.currentTarget.value);

  updateTipAmount();
}

[billInput, peopleInput].forEach(input => input.addEventListener('input', handleUserInput));

billInput.addEventListener('change', updateTipAmount);
selectedTip.forEach(tip => tip.addEventListener('change', getTip));
peopleInput.addEventListener('change', updateTipAmount);

resetBtn.addEventListener('click', () => {
  billInput.value = '';
  peopleInput.value = '';
  tipPercent = 0;

  selectedTip.forEach(tip => {
    const tipValue = tip.nextElementSibling;
    tipValue.classList.remove('calculator__tip-option--selected');
    tip.checked = false;
  });
  updateTipAmount();
});
