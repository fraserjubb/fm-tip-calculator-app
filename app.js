const bill = document.querySelector('#bill-input');
const people = document.querySelector('#people-input');

const selectedTip = Array.from(document.querySelectorAll('.calculator__tip-amount'));

const tipAmount = document.querySelector('#calculator__tip-amount');
const totalString = document.querySelector('#total');

const tipValue = Number(tipAmount.innerText.slice(1));
const total = Number(totalString.innerText.slice(1));

let peopleNum;
function getPeople() {
  if (!people.value) {
    peopleNum = 0;
  } else {
    peopleNum = people.value;
  }
}

let tipCalc;
function updateTipAmount() {
  getPeople();
  if ((peopleNum === 0) | !bill.value | (myTip === 0)) {
    tipCalc = 0;
    // tipAmount.textContent = `$${tipCalc.toFixed(2)}`;
  } else {
    tipCalc = (bill.value * myTip) / peopleNum;
  }
  tipAmount.textContent = `$${tipCalc.toFixed(2)}`;
}

// const selected = document.querySelector('input[name="tip"]:checked');
// console.log(selected);
// if (selected) {
//   console.log(selected.value);
// }

let myTip = 0;
selectedTip.forEach(tip => {
  tip.addEventListener('change', () => {
    myTip = tip.value;
    updateTipAmount();
  });
});

people.addEventListener('change', updateTipAmount);
bill.addEventListener('change', updateTipAmount);
// updateTipAmount();
