const attackValue = 10
const strongAttackValue = 15
const monsterAttackValue = 14
const healValue = 20

const MODE_ATTACK = 'ATTACK'
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK'
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK'
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK'
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL'
const LOG_EVENT_GAME_OVER = 'GAME_OVER'

const enteredValue = prompt('Maximum life for you and the monster.', '100')

let chosenMaxLife = parseInt(enteredValue)
let battleLog = []

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100
}

let currentMonsterHealth = chosenMaxLife
let currentPlayerHealth = chosenMaxLife
let hasBonusLife = true

adjustHealthBars(chosenMaxLife)

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry = {
    event,
    value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  }
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = 'MONSTER'
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = 'MONSTER'
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry = {
      event,
      value,
      target: 'PLAYER',
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth
    }
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry = {
      event,
      value,
      target: 'PLAYER',
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth
    }
  } else if (event === LOG_EVENT_GAME_OVER) {
    logEntry = {
      event,
      value,
      finalMonsterHealth: monsterHealth,
      finalPlayerHealth: playerHealth
    }
  }

  battleLog.push(logEntry)
}

function reset() {
  currentMonsterHealth = chosenMaxLife
  currentPlayerHealth = chosenMaxLife
  resetGame(chosenMaxLife)
}

function endRound () {
  const initialPlayerHealth = currentPlayerHealth
  const playerDamage = dealPlayerDamage(monsterAttackValue)
  currentPlayerHealth -= playerDamage
  writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth)

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false
    removeBonusLife()
    currentPlayerHealth = initialPlayerHealth
    setPlayerHealth(initialPlayerHealth)
    alert('You would be dead but the bonus life saved you!')
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!')
    writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth)
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!')
    writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth)
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw!')
    writeToLog(LOG_EVENT_GAME_OVER, 'DRAW', currentMonsterHealth, currentPlayerHealth)
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset()
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? attackValue : strongAttackValue
  const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK
  // if (mode === MODE_ATTACK) {
  //   maxDamage = attackValue
  //   logEvent = LOG_EVENT_PLAYER_ATTACK
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = strongAttackValue
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK
  // }

  const damage = dealMonsterDamage(maxDamage)
  currentMonsterHealth -= damage
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth)
  endRound()
}

function attackHandler() {
  attackMonster(MODE_ATTACK)
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK)
}

function healPlayerHandler () {
  let currentHealValue;
  if (currentPlayerHealth >= chosenMaxLife - healValue) {
    alert('You can\'t heal to more than your max initial health!')
    currentHealValue = chosenMaxLife - currentPlayerHealth
  } else {
    currentHealValue = healValue
  }

  increasePlayerHealth(currentHealValue)
  currentPlayerHealth += currentHealValue
  writeToLog(LOG_EVENT_PLAYER_HEAL, currentHealValue, currentMonsterHealth, currentPlayerHealth)
  endRound()
}

function printLogHandler() {
  console.log(battleLog)
}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)