function add(num1, num2) {
  return num1 + num2
}

console.log(add(1, 5)) // 6
console.log(add(12, 15)) // 27

function addRandom(num1) {
  return num1 + Math.random()
}

console.log(addRandom(2))

let previousResult = 0

function addMoreNumbers(num1, num2) {
  const sum = num1 + num2
  previousResult = sum
  return sum
}

addMoreNumbers(2, 4)

const hobbies = ['Sports', 'Cooking']

function printHobbies (hobby) {
  hobby.push('NEW HOBBY')
  console.log(hobby)
}

printHobbies(hobbies)

let multiplier = 1.1

function createTaxCalculator (tax) {
  function calculateTax (amount) {
    return amount * tax * multiplier
  }

  return calculateTax
}

const calculateVatAmount = createTaxCalculator(0.19)
const incomeTaxAmount = createTaxCalculator(0.25)

// multiplier = 1.2

console.log(calculateVatAmount(100))
console.log(calculateVatAmount(200))

let userName = 'Syauqi'

function greetUser() {
  let name = 'Anna'
  console.log('hi ' + name)
}

let name = 'Aziz'

userName = 'Ahmed'

greetUser()

// function powerOf(x, n) {
//   let result = 1

//   for (let i = 0; i < n; i++) {
//     result *= x
//   }

//   return result
// }

function powerOf(x, n) {
  // if (n === 1) {
  //   return x
  // }

  // return x * powerOf(x, n - 1)
  return n === 1 ? x : x * powerOf(x, n - 1)
}

console.log(powerOf(2, 3)) // 2 * 2 * 2

const myself = {
  name: 'Syauqi',
  friends: [
    {
      name: 'Aziz',
      friends: [
        {
          name: 'Pauk',
          friends: [
            {
              name: 'Maman'
            },
            {
              name: 'Tohir'
            }
          ]
        }
      ]
    },
    {
      name: 'Julia'
    }
  ]
}

function getFriendNames (person) {
  const collectedNames = []

  if (!person.friends) {
    return []
  }

  for (const friend of person.friends) {
    collectedNames.push(friend.name)
    collectedNames.push(...getFriendNames(friend))
  }

  return collectedNames
}

console.log(getFriendNames(myself))
