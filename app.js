const billInput = document.querySelector('#bill-input');
const peopleInput = document.querySelector('#people-input');

const selectedTip = Array.from(document.querySelectorAll('.calculator__tip-amount'));
const tipLabels = Array.from(document.querySelectorAll('.calculator__tip-option'));

const tipDisplay = document.querySelector('#calculator__tip-amount');
const totalDisplay = document.querySelector('#total');

let tipPercent;

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

selectedTip.forEach(tip => tip.addEventListener('change', getTip));

peopleInput.addEventListener('change', updateTipAmount);
billInput.addEventListener('change', updateTipAmount);
