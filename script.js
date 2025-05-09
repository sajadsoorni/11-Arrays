'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'basic',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0

  const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;
  console.log(moves);

  moves.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
       <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements.filter((mov) => mov < 0).reduce((acc, int) => acc + int);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 0;
    })
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Evenet handler

let currentAccount;

const updateUI = function (acc) {
  // Dsiplay movments
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find((acc) => acc?.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear the inpt fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Updat UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);
  // Clear inputs
  inputTransferTo.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    console.log('Transfer valid');
    // Doing the transfer

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const eligibility = currentAccount.movements.some((mov) => mov >= amount * 0.1);
  if (amount > 0 && eligibility) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex((acc) => acc.username === currentAccount.username);
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sortedState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortedState);
  sortedState = !sortedState;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVETRSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);

// JOIN

console.log(letters.join(' - '));
*/
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting the last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log('sajad'.at(0));
console.log('sajad'.at(-1));
*/
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited  ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('---FOREACH-----------');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});

// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...
*/
/*
// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
*/
///////////////////////////////////////
// Coding Challenge #1

/* 

Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and 
stored the data into an array (one array for each).For now, they are just interested in knowing whether 
a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's
less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does 
the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So 
create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a 
bad practice to mutate function parameters)

2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old")
 or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀

// const checkDogs = function (dogsJulia, dogsKate) {
  //   const mergedData = [...dogsJulia, ...dogsKate];
  
  //   mergedData.forEach(function (age, i) {
    //     console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
    //   });
    // };
    
    // const juliasData = [3, 5, 2, 12, 7];
    // const katesData = [4, 1, 15, 8, 3];
    
    // const correctedJuliasData = [...juliasData.slice(1, 3)];
    
    // checkDogs(correctedJuliasData, katesData);
    
    const checkDogs = function (dogsJulia, dogsKate) {
      const correctedDogsJulia = dogsJulia.slice();
      correctedDogsJulia.splice(0, 1);
      correctedDogsJulia.splice(-2);
      
      const mergedData = correctedDogsJulia.concat(dogsKate);
      
      mergedData.forEach(function (age, i) {
        const type = age >= 3 ? 'adult 🐕' : 'puppy 🐶';
        console.log(`Dog number ${i + 1} is an ${type}, and is ${age} years old`);
      });
    };
    
    const juliasData = [3, 5, 2, 12, 7];
    const katesData = [4, 1, 15, 8, 3];
    
    checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
    
    */
/* 

///////////////////////////////////////
// Coding Challenge #2

Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human
ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the
 following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, 
humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are
 at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges 
how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

const calcAverageHumanAge = function (dogAges) {
  const humanAges = dogAges.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter((age) => age >= 18);
  console.log(humanAges);
  console.log(adults);
  
  // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  const average = adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  
  // 2 3. ( 2 + 3 ) / 2 = 2.5 === 2/2+2/3 = 2.5
  
  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2);
*/

/*
const eurToUsd = 1.1;

const movementUSD = movements.map((mov) => mov * eurToUsd);
console.log(movements);
console.log(movementUSD);

const movementUSDfor = [];
for (const mov of movements) movementUSDfor.push(mov * eurToUsd);

console.log(movementUSDfor);

const movementsDescriptions = movements.map((mov, i) => {
  return `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;
});

console.log(movementsDescriptions);
*/

// const accounts = [account1, account2, account3, account4];

/*
// 159-filter-method

// deposits
const deposits = movements.filter((mov) => mov > 0);
console.log(deposits);

// depositsFor
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

// withdrawals
const withdrawals = movements.filter((mov) => mov < 0);
console.log(withdrawals);

// withdrawalsFor
const withdrawalsFor = [];
for (const mov of movements) if (mov < 0) withdrawalsFor.push(mov);
console.log(withdrawalsFor);
*/
/*
console.log(movements);

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

let balanceFor = 0;
for (const mov of movements) balanceFor += mov;

console.log(balanceFor);

// Maximum value

const max = movements.reduce((acc, cur) => {
  if (cur > acc) return cur;
  return acc;
});

console.log(max);

const maxInline = movements.reduce((acc, cur) => (cur > acc ? cur : acc));
console.log(maxInline);
*/
/*
// 162-magic-of-chaining

const eurToUsd = 1.1;
console.log(movements);

// PIPELINE
const totalDepositsUSD = movements
  .filter((mov) => mov > 1)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  // .map((mov) => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);
*/

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow
function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

/*
// challenge#3-calc-average-human-age

const calcAverageHumanAge = function (dogAges) {
  const humanAges = dogAges
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

  // 2 3. ( 2 + 3 ) / 2 = 2.5 === 2/2+2/3 = 2.5

  return humanAges;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2);
*/

/*
// 164-find-method

const firstWithdrawal = movements.find((mov) => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find((acc) => acc.owner === 'Jessica Davis');

console.log(account);

for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') console.log(acc);
}
*/

/*
// 168-findlast-findlastindex

console.log(movements);

const lastWithdrawal = movements.findLast((mov) => mov < 0);
console.log(lastWithdrawal);

const latestLargeMovementIndex = movements.findLastIndex((mov) => Math.abs(mov) > 2000);
console.log(latestLargeMovementIndex);
console.log(`your latest large movements was ${movements.length - latestLargeMovementIndex} movements ago `);
*/

/*
// 169-some-and-every

// EQUALITY
console.log(movements);
console.log(movements.includes(-130));

// SOME: CONDITION
console.log(movements.some((mov) => mov === -130));

const anyDeposits = movements.some((mov) => mov > 1500);
console.log(anyDeposits);

// EVERY

console.log(movements.every((mov) => mov > 0));
console.log(account4.movements.every((mov) => mov > 0));

// seperate callback
console.log('--------------------------------------------------');
const deposit = (mov) => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

/*
// 170-flat-and-flatmap
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// flat
const overalBalance = accounts
  .map((mov) => mov.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// flatMap
const overalBalance2 = accounts.flatMap((mov) => mov.movements).reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);
*/

///////////////////////////////////////
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). 
HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities 
these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to 
the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method
 along with the ... operator.

TEST DATA:

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

// 1. Store the the average weight of a "Husky" in a variable "huskyWeight"
const huskyWeight = breeds.find((b) => b.breed === 'Husky')?.averageWeight;
console.log(huskyWeight);

// 2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
const dogsBothActivities = breeds.find((b) => b.activities.includes('running') && b.activities.includes('fetch')).breed;
console.log(dogsBothActivities);

// 3. Create an array "allActivities" of all the activities of all the dog breeds
const allActivities = breeds.flatMap((b) => b.activities);
console.log(allActivities);

// 4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions).
const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);

//5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities
const swimAdjacent = new Set(
  // breeds
  //   .filter((breed) => breed.activities.includes('swimming'))
  //   .flatMap((breed) => breed.activities)
  //   .filter((act) => act !== 'swimming')
  
  breeds.flatMap((b) => (b.activities.includes('swimming') ? b.activities.filter((act) => act !== 'swimming') : []))
);
console.log(swimAdjacent);

// 6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
console.log(breeds.every((b) => b.averageWeight >= 10));

// 7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to
// the console whether "true" or "false".
console.log(breeds.some((b) => b.activities.length >= 3));

// BONUS
const fatestFetch = breeds
.filter((b) => b.activities.includes('fetch'))
.reduce((acc, cur) => {
  if (cur.averageWeight > acc.averageWeight) return cur;
  return acc;
}).breed;
console.log(fatestFetch);
console.log('------------------');
// Jonas Solution:

const fetchWeights = breeds.filter((b) => b.activities.includes('fetch')).map((b) => b.averageWeight);

const heaviestFetchBreed = Math.max(...fetchWeights);
console.log(...fetchWeights);
console.log(heaviestFetchBreed);
*/
/*
// 172. Sorting Arrays
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// return < 0, A, B (keep order)
// return > 0, B, A (switch order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
movements.sort((a, b) => b - a);
console.log(movements);
*/
/*
// 173. Array Grouping

console.log(movements);

const groupedMovements = Object.groupBy(movements, (mov) => (mov > 0 ? 'deposits' : 'withdrawals'));

console.log(groupedMovements);

const groupedByActivity = Object.groupBy(accounts, (acc) => {
  const movementCount = acc.movements.length;
  if (movementCount >= 8) return 'very active';
  if (movementCount >= 4) return 'active';
  if (movementCount >= 1) return 'moderate';
  return 'inactive';
});

console.log(groupedByActivity);

// const groupedAccounts = Object.groupBy(accounts, (acc) => acc.type);

const groupedAccounts = Object.groupBy(accounts, ({ type }) => type);
console.log(groupedAccounts);
*/

/*
// 174. More Ways of Creating and Filling Arrays

// answers: new Array(4).fill(0),

// Empety arrays + fill method
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));
x.fill(1);
// x.fill('*', 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => '*');
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const dice = Array.from({ length: 10 }, (_, i) => Math.floor(Math.random() * 6) + 1);
console.log(dice);

console.log(Object.groupBy(dice, (d) => (d <= 5 ? 'A' : 'B')));

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), (el) =>
    Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];

  console.log(movementsUI2);
});
*/

/*
// 175. Non-Destructive Alternatives: toReversed, toSorted, toSpliced, with
console.log(movements);
const reversedMov = movements.toReversed();
console.log(reversedMov);

// toSorted (sort). toSpliced (splice)
// movements[1] = 2000;
const newMovments = movements.with(1, 2000);
console.log(newMovments);
console.log(movements);
*/
/*
///////////////////////////////////////
// 177- Array Methods Practice

// 1.
const banKDepositSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);

console.log(banKDepositSum);

// 2.
// const numDeposits1000 = accounts.flatMap((acc) => acc.movements).filter((m) => m > 1000).length;
const numDeposits1000 = accounts.flatMap((acc) => acc.movements).reduce((acc, cur) => (cur > 1000 ? ++acc : acc), 0);
console.log(numDeposits1000);

// Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// 3.
// const sums = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (acc, cur) => ({
//       deposits: cur > 0 ? acc.deposits + cur : acc.deposits,
//       withdrawals: cur < 0 ? acc.withdrawals + cur : acc.withdrawals,
//     }),
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sums);

// const sums = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((acc, cur) => {
//     acc.deposits = (acc.deposits || 0) + (cur > 0 ? cur : 0);
//     acc.withdrawals = (acc.withdrawals || 0) + (cur < 0 ? cur : 0);
//     return acc;
//   }, {});
// console.log(sums);

// const { deposits, withdrawals } = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (acc, cur) => {
//       // cur > 0 ? (acc.deposits += cur) : (acc.withdrawals += cur);
//       acc[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return acc;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

const { deposits, withdrawals } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (acc, cur) => {
      acc[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

// 4.
// this is a nice title => This Is a Nice Title

const convertTitleCase = function (title) {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'be', 'and'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map((word, index) => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
console.log(convertTitleCase('A java script code musT be clean allways'));
*/

///////////////////////////////////////
// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too 
much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams 
of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little 
is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended 
portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) 
and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this 
before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple 
users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of 
dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too 
much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating 
too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < 
(recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
// const recommendedFood0 = dogs.map((d) => ({ ...d, recFood: Math.floor(d.weight ** 0.75 * 28) })); // map
const recommendedFood = dogs.forEach((d) => (d.recFood = Math.floor(d.weight ** 0.75 * 28)));
console.log(dogs);

// 2.
const sarahDogs = dogs.find((d) => d.owners.includes('Sarah'));
console.log(`Sarah's dog eats ${sarahDogs.curFood > sarahDogs.recFood ? 'much' : 'litle'}`);

// 3.
// const ownersTooMuch = Object.groupBy(dogs, (d) => (d.curFood > d.recFood ? 'much' : 'litle'));
const ownersTooMuch = dogs.filter((d) => d.curFood > d.recFood).flatMap((d) => d.owners);
const ownersTooLittle = dogs.filter((d) => d.curFood < d.recFood).flatMap((d) => d.owners);
console.log(ownersTooMuch);
console.log(ownersTooLittle);

// 4.
console.log(`${ownersTooMuch.join(' and ')}'s dogs eat too 
much! and ${ownersTooLittle.join(' and ')}'s dogs eat too 
little!`);

// 5.
console.log(dogs.some((d) => d.curFood === d.recFood));

// 6.
// console.log(dogs.every((d) => d.curFood > d.recFood * 0.9 && d.curFood < d.recFood * 1.1));
const checkEatingOkey = (d) => d.curFood > d.recFood * 0.9 && d.curFood < d.recFood * 1.1;
console.log(dogs.every(checkEatingOkey));

// 7.
const dogsEatingOkey = dogs.filter(checkEatingOkey);
console.log(dogsEatingOkey);

// 8.
const groupedByPortion = Object.groupBy(dogs, (d) => {
  if (d.curFood > d.recFood) return 'too-much';
  else if (d.curFood < d.recFood) return 'too-litle';
  else {
    return 'exact';
  }
});
console.log(groupedByPortion);

// 9.
const groupedByOwner = Object.groupBy(dogs, (d) => `${d.owners.length}-Owners`);
console.log(groupedByOwner);

// 10.
const soretdByRecfood = dogs.toSorted((a, b) => a.recFood - b.recFood);
console.log(soretdByRecfood);
