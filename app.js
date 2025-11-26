const billInput = document.querySelector('#bill-input');
const peopleInput = document.querySelector('#people-input');

const selectedTip = Array.from(document.querySelectorAll('.calculator__tip-amount'));
const tipLabels = Array.from(document.querySelectorAll('.calculator__tip-option'));

const tipDisplay = document.querySelector('#calculator__tip-amount');
const totalString = document.querySelector('#total');

const total = Number(totalString.innerText.slice(1));

let people;
let bill;
let tip;
let tipPercent = 0;

function getInputs() {
  people = Number(peopleInput.value);
  bill = Number(billInput.value);
}

function updateTipAmount() {
  getInputs();
  if (people === 0 || bill === 0 || tipPercent === 0) {
    tip = 0;
  } else {
    tip = (bill * tipPercent) / people;
  }
  tipDisplay.textContent = `$${tip.toFixed(2)}`;
}

function getTip(e) {
  selectedTip.forEach(tip => {
    const tipValue = tip.nextElementSibling;
    tipValue.classList.toggle('calculator__tip-option--selected', tip.checked);
  });
  tipPercent = e.currentTarget.value;

  updateTipAmount();
}

selectedTip.forEach(tip => tip.addEventListener('change', e => getTip(e)));

peopleInput.addEventListener('change', updateTipAmount);
billInput.addEventListener('change', updateTipAmount);
