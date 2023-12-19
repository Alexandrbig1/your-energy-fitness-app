import { toggleModalClose, toggleModalOpen } from '../helpers/toggleModal';

const BASE_URL = import.meta.env.BASE_URL;

/**
 * Represent a additional config object for modal window.
 * @param {string} exercise required if subscribe on before/after
 */
const modalConfig = {
  exercise: {},
  ratingText: 'Rating',
  iconStar: `${BASE_URL}images/icons-sprite.svg#icon-star`,
  ratingMax: 5,
  closeKeyBoardBtn: 'Escape',
  beforeOpen: null,
  afterOpen: null,
  beforeClose: null,
  afterClose: null,
};

const feedbackForm = document.querySelector('form.modal-form');
const rootRatingModal = document.querySelector('.rating-modal-content');
const closeBtn = document.querySelector('.rating-close');
const backdropRef = document.querySelector('.backdrop');

const createRatingMarkup = () => {
  const starsArray = [];

  for (let count = 0; count < modalConfig.ratingMax; count++) {
    let starIndex = modalConfig.ratingMax - count;
    starsArray.push(`
        <input type="radio" class="visually-hidden" id="star${starIndex}" name="rating" value="${starIndex}">
        <label class="rating-star" for="star${starIndex}">
            <svg class="rating-star-icon">
                <use href=${modalConfig.iconStar} />
            </svg>
        </label>
        `);
  }
  return `
    <div class="rating-wrapper">
        <p class="rating-text">${modalConfig.ratingText}</p>
        <div class="rating-stars">
            ${starsArray.join('')}
            <p class="rating-count">0.0</p>
        </div>
    </div>
    `;
};

const handleClose = event => {
  if (event.key === modalConfig.closeKeyBoardBtn) {
    closeRatingModal();
  }
};

const handleCloseOnBackdrop = event => {
    if (event.target === rootRatingModal) {
        closeRatingModal();
    }
}

const handleRatingChange = event => {
  ratingInputs.forEach(input => {
    delete input.dataset.dataChecked;
  });
  event.target.dataset.dataChecked = 'checked';
  ratingCount.innerHTML = event.target.value;
};

const onReset = () => {
  ratingCount.innerHTML = '0.0';
};

feedbackForm.insertAdjacentHTML('afterbegin', createRatingMarkup());
const ratingInputs = document.querySelectorAll('.rating-stars input');
const ratingCount = document.querySelector('.rating-count');

const closeRatingModal = () => {
  if (modalConfig.beforeClose) {
    modalConfig.beforeClose(modalConfig.exercise);
    modalConfig.beforeClose = null;
  }
  ratingInputs.forEach(input => {
    input.removeEventListener('change', handleRatingChange);
  });
  toggleModalClose(rootRatingModal);

  document.removeEventListener('keydown', handleClose);
  backdropRef.removeEventListener('click', handleCloseOnBackdrop);
  if (modalConfig.afterClose) {
    modalConfig.afterClose(modalConfig.exercise);
    modalConfig.afterClose = null;
  }

  ratingCount.innerHTML = '0.0';
  feedbackForm.reset();
};

const openRatingModal = () => {
  if (modalConfig.beforeOpen) {
    modalConfig.beforeOpen(modalConfig.exercise);
    modalConfig.beforeOpen = null;
  }
  ratingInputs.forEach(input => {
    input.addEventListener('change', handleRatingChange);
  });
  if (modalConfig.afterOpen) {
    modalConfig.afterOpen(modalConfig.exercise);
    modalConfig.afterOpen = null;
  }
  toggleModalOpen(rootRatingModal);
  document.addEventListener('keydown', handleClose);
  backdropRef.addEventListener('click', handleCloseOnBackdrop);
};

closeBtn.addEventListener('click', closeRatingModal);
feedbackForm.addEventListener('reset', onReset);

export const ratingWindow = {
  modalConfig,
  openRatingModal,
  closeRatingModal,
};
