import {
  strCapitalizeAllFirstChar,
  strCapitalizeSentence,
  strSplitCamelCase,
} from '../helpers/stringHelper';

import { starRating } from '../star-rating';

import { db } from '../firebase-service';
import { favoritesDB, toggleFavoriteStatus } from '../favoritesDB';

import { ratingWindow } from '../rating-modal/rating-modal';
import { authModalWindow } from '../auth-modal';
import { toggleModalClose, toggleModalOpen } from '../helpers/toggleModal';
import { removeElFromFavorites } from '../exercises-cards-service/favorite-service';

const backdropRef = document.querySelector('.backdrop');
const modalRef = document.querySelector('.modalExercise');
const closeButtonRef = modalRef.querySelector('.js-modal-exit');
const imgWrapperRef = modalRef.querySelector('.modalExercise__img-wrapper');
const contentWrapperRef = modalRef.querySelector('.exercise-content');
const buttonBoxRef = modalRef.querySelector('.button-box');

const BASE_URL = import.meta.env.BASE_URL;
const MAX_RATING = 5;

let toggleFavoritEvent;
let openedExercise = {};

const renderModal = exercise => {
  const { gifUrl, name, rating, _id, isFavorite, description } = exercise;
  const details = getDetails(exercise);
  openedExercise = exercise;

  modalRef.setAttribute('data-id', _id);
  // media
  imgWrapperRef.innerHTML = '';
  imgWrapperRef.insertAdjacentHTML('afterbegin', markupMedia(gifUrl, name));
  // title
  contentWrapperRef.innerHTML = '';
  contentWrapperRef.insertAdjacentHTML('beforeend', markupTitle(name));
  // rating
  contentWrapperRef.insertAdjacentHTML('beforeend', markupRating(rating));
  // details
  contentWrapperRef.insertAdjacentHTML('beforeend', markupDetails(details));
  // description
  contentWrapperRef.insertAdjacentHTML(
    'beforeend',
    markupDescription(description)
  );
  // buttons
  btnBoxRender(isFavorite);
};

const handleClose = event => {
  if (event.key === 'Escape') {
    closeModalExercise();
  }
};

const handleCloseOnBackdrop = event => {
  if (event.target === backdropRef) {
    closeModalExercise();
  }
};

const onGiveRatingClick = event => {
  const user = db.auth().currentUser;

  closeModalExercise();
  if (!user) {
    //need to set exercise obj, to avoid it we can create ModalWindowManager that will manage all modals
    authModalWindow.modalConfig.exercise = openedExercise;
    authModalWindow.modalConfig.afterClose = openModalExercise;
    authModalWindow.openModal(openedExercise);
    return;
  }
  ratingWindow.modalConfig.exercise = openedExercise;
  ratingWindow.openRatingModal();
};

const handleRatingClose = () => {
  document
    .querySelector('.js-give-rating')
    .removeEventListener('click', onGiveRatingClick);
  openModalExercise(openedExercise);
};

const getDetails = exercise => ({
  bodyPart: exercise.bodyPart,
  equipment: exercise.equipment,
  rating: exercise.rating,
  burnedCalories: exercise.burnedCalories,
  time: exercise.time,
  popular: exercise.popularity,
});

const btnBoxRender = (isFavorite = false) => {
  buttonBoxRef.innerHTML = '';

  isFavorite
    ? buttonBoxRef.insertAdjacentHTML('beforeend', markupRemoveFavoritesBtn())
    : buttonBoxRef.insertAdjacentHTML('beforeend', markupAddFavoritesBtn());
  buttonBoxRef.insertAdjacentHTML('beforeend', markupGiveRatingBtn());

  const btnToggle = buttonBoxRef.querySelector('.js-toggle-favorite');
  const btnOpenModalRating = buttonBoxRef.querySelector('.js-give-rating');

  btnToggle.addEventListener('click', onToggleFavorite);
  ratingWindow.modalConfig.afterClose = handleRatingClose;
  document
    .querySelector('.js-give-rating')
    .addEventListener('click', onGiveRatingClick);
};

const markupTitle = title => {
  return `
    <h3 class="title">${strCapitalizeAllFirstChar(title)}</h3>
  `;
};

const markupRating = rating => {
  const markup = [];
  const value = Math.round(rating * 10) / 10;
  markup.push(`<li class="rating__item value">${value}</li>`);
  const percent = Math.round((rating / MAX_RATING) * 100);
  const iconStar = `${BASE_URL}images/icons-sprite.svg#icon-star`;
  markup.push(`<li ${starRating(percent)}</li>`);

  return `<ul class="rating">${markup.join('')}</ul>`;
};

const markupMedia = (url, alt) => {
  return `
    <img src="${url}" alt="${alt}"/>
  `;
};

const markupDetails = ({ burnedCalories, time, ...rest }) => {
  const markup = [];
  for (const [key, value] of Object.entries(rest)) {
    const splitKey = strSplitCamelCase(key);
    const keyName = strCapitalizeSentence(splitKey);
    const capValue = strCapitalizeSentence(value);
    markup.push(`
      <li class="exercise_details-item">
        <p class="detail-name">${keyName}</p>
        <p class="detail-value">${capValue}</p>
      </li>
    `);
  }

  markup.push(`
      <li class="exercise_details-item">
        <p class="detail-name">Burned Calories</p>
        <p class="detail-value">${burnedCalories}/${time} min</p>
      </li>
  `);

  return `<ul class="exercise_details">${markup.join('')}</ul>`;
};

const markupDescription = text => {
  return `
    <p class="exercise_description">${text}</p>
  `;
};

const markupAddFavoritesBtn = () =>
  markupButton({
    text: 'Add to favorites',
    iconId: 'icon-heart',
    className: 'js-toggle-favorite',
  });

const markupRemoveFavoritesBtn = () =>
  markupButton({
    text: 'Remove from favorites',
    iconId: 'icon-trash',
    className: 'js-toggle-favorite',
  });

const markupGiveRatingBtn = () =>
  markupButton({
    text: 'Give a rating',
    className: 'js-give-rating ghost',
  });

const markupButton = ({ text, iconId, className = '' }) => {
  let iconMarkup;
  if (iconId) {
    iconMarkup = `
      <svg class="btn-icon">
        <use href=${BASE_URL}images/icons-sprite.svg#${iconId} />
      </svg>
    `;
  }

  return `
    <button id="js-toggle-favorite" type="button" class="button ${className}">
      <span>${text}</span>
      ${iconId ? iconMarkup : ''}
    </button>
  `;
};

const closeModalExercise = () => {
  toggleModalClose(modalRef);
  closeButtonRef.removeEventListener('click', closeModalExercise);
  document.body.style.overflow = 'visible';

  const toggleID = 'js-toggle-favorite';
  try {
    const toggleBtn = document.getElementById(toggleID);
    toggleBtn.removeEventListener('click', toggleFavoritEvent);
    document.removeEventListener('keydown', handleClose);
    backdropRef.removeEventListener('click', handleCloseOnBackdrop);
    setTimeout(() => (modalRef.style.display = 'none'), 1000);
  } catch (error) {
    console.error(`${toggleID} not found!`);
  }
};

const openModalExercise = async exercise => {
  const { _id } = exercise;

  exercise.isFavorite = await favoritesDB.idIsFavorite(_id);
  renderModal(exercise);

  modalRef.style.display = '';
  toggleModalOpen(modalRef);
  closeButtonRef.addEventListener('click', closeModalExercise);
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleClose);
  backdropRef.addEventListener('click', handleCloseOnBackdrop);
};

const onToggleFavorite = async event => {
  const user = db.auth().currentUser;

  if (!user) {
    closeModalExercise();
    //need to set exercise obj, to avoid it we can create ModalWindowManager that will manage all modals
    authModalWindow.modalConfig.exercise = openedExercise;
    authModalWindow.modalConfig.afterClose = openModalExercise;
    authModalWindow.openModal(openedExercise);
    return;
  }

  const { target } = event;
  try {
    if (window.location.pathname.includes('favorites')) {
      closeModalExercise();
      removeElFromFavorites(openedExercise);
    }
    const isFavorite = await toggleFavoriteStatus(openedExercise);
    target.removeEventListener('click', onToggleFavorite);
    btnBoxRender(isFavorite);
  } catch (error) {
    console.error(error);
  }
};

export { openModalExercise, btnBoxRender, closeModalExercise };
