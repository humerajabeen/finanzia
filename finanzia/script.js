'use strict';

const account1 = {
  owner: 'Humera Jabeen',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1234,
};

const account2 = {
  owner: 'Bushra Jabeen',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 5678,
};

const account3 = {
  owner: 'Khateeja Bee',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 1234,
};

const account4 = {
  owner: 'Md Zakir Hussain',
  movements: [430, 1000, 700, 50, 90, -300],
  interestRate: 1,
  pin: 5678,
};

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const time = setInterval(function () {
  const now = new Date();
  const date = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const hour = `${now.getHours()}`.padStart(2, 0);
  const min = `${now.getMinutes()}`.padStart(2, 0);
  const sec = `${now.getSeconds()}`.padStart(2, 0);
  labelDate.textContent = `${date}/${month}/${year} ${hour}:${min}:${sec}`;
}, 1000);


const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort(function (a, b) {
    return a - b;
  }) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html =
      `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} ₹</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//print total balance for account
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance} ₹`
};

const calcDisplaySummary = function (acc) {
  //calculate summary in
  const income = acc.movements.filter(function (mov) {
    return mov > 0;
  }).reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelSumIn.textContent = `${income} ₹`;

  //calculate summary out
  const out = acc.movements.filter(function (mov) {
    return mov < 0;
  }).reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelSumOut.textContent = `${Math.abs(out)} ₹`;

  //calculate summary interest
  const interest = acc.movements.filter(function (mov) {
    return mov > 0;
  }).map(function (dep) {
    return ((dep * acc.interestRate) / 100);
  }).filter(function (int) {
    return int >= 1;
  }).reduce(function (acc, int) {
    return acc + int;
  }, 0);
  labelSumInterest.textContent = `${interest} ₹`
};


//creating shortnames for users to login
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.split(' ').map(function (name) {
      return name[0];
    }).join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySummary(acc);
};

//same code as above
// accounts.forEach(function (acc) {
//   acc.username = acc.owner.toLowerCase().split(' ').map(function (name) {
//     return name[0];
//   }).join('');
// });
// console.log(accounts);

//login
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  // console.log(currentAccount);

  if (currentAccount && currentAccount.pin == Number(inputLoginPin.value)) {
    const nows = new Date();
    let hours = nows.getHours();
    let days = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const timer = hours;
    const pop = function () {
      if (timer >= 6 && timer <= 12) {
        labelWelcome.textContent = `Good ${days[0]}, ${currentAccount.owner}`;
      } else if (timer >= 12 && timer <= 16) {
        labelWelcome.textContent = `Good ${days[1]}, ${currentAccount.owner}`;
      } else if (timer >= 16 && timer <= 19) {
        labelWelcome.textContent = `Good ${days[2]}, ${currentAccount.owner}`;
      } else {
        labelWelcome.textContent = `Good ${days[3]}, ${currentAccount.owner}`;
      }
    };
    pop();

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

//transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  // console.log(amount, recieverAcc);

  if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username) {
    // console.log(currentAccount);
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

//close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//take loan from bank
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loan = Number(inputLoanAmount.value);
  if (loan > 0 && currentAccount.movements.some(function (mov) {
    return mov >= loan * 0.1;
  })) {
    setTimeout(() => {
      currentAccount.movements.push(loan);
      updateUI(currentAccount);
    }, 1200);
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});