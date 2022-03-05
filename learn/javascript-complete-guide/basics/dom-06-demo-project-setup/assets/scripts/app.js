const addMovieModal = document.getElementById('add-modal')
// const addMovieModal = document.querySelector('#add-modal')
// const addMovieModal = document.body.children[1]

const startAddMovieButton = document.querySelector('header button')
// const startAddMovieButton = document.querySelector('header').lastElementChild

// const backdrop = document.body.firstElementChild
const backdrop = document.getElementById('backdrop')

const cancelAddMovieButton = addMovieModal.querySelector('.btn--passive')
const confirmAddMovieButton = cancelAddMovieButton.nextElementSibling
const userInputs = addMovieModal.querySelectorAll('input')
// const userInputs = addMovieModal.getElementsByTagName('input')
const entryTextSection = document.getElementById('entry-text')

const movies = []

const updateUI = () => {
  if (movies.length === 0) {
    entryTextSection.style.display = 'block'
  } else {
    entryTextSection.style.display = 'none'
  }
}

const renderMovieElement = (title, imageUrl, rating) => {
  const newMovieElement = document.createElement('li')

  newMovieElement.className = 'movie-element'
  newMovieElement.innerHTML = `
    <div class="movie-element__image">
      <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
      <h2>${title}</h2>
      <p>${rating}/5 stars</p>
    </div>
  `

  const listRoot = document.getElementById('movie-list')
  listRoot.appendChild(newMovieElement)
}

const toggleBackdrop = () => {
  backdrop.classList.toggle('visible')
}

const toggleMovieModal = () => {
  addMovieModal.classList.toggle('visible')
  toggleBackdrop()
}

const cancelAddMovieHandler = () => {
  toggleMovieModal()
  clearMovieInputs()
}

const backdropClickHandler = () => {
  toggleMovieModal()
}

const clearMovieInputs = () => {
  for (const userInput of userInputs) {
    userInput.value = ''
  }
}

const addMovieHandler = () => {
  const titleValue = userInputs[0].value
  const imageUrlValue = userInputs[1].value
  const ratingValue = userInputs[2].value

  if (
    titleValue.trim() === '' ||
    imageUrlValue.trim() === '' ||
    ratingValue.trim() === '' ||
    +ratingValue < 1 ||
    +ratingValue > 5
  ) {
    alert('Please enter valid values (rating between 1 and 5)!')

    return
  }

  const newMovie = {
    title: titleValue,
    imageUrl: imageUrlValue,
    rating: ratingValue
  }

  movies.push(newMovie)

  console.log(movies)

  toggleMovieModal()
  clearMovieInputs()
  renderMovieElement(newMovie.title, newMovie.imageUrl, newMovie.rating)
  updateUI()
}

startAddMovieButton.addEventListener('click', toggleMovieModal)
backdrop.addEventListener('click', backdropClickHandler)
cancelAddMovieButton.addEventListener('click', cancelAddMovieHandler)
confirmAddMovieButton.addEventListener('click', addMovieHandler)
