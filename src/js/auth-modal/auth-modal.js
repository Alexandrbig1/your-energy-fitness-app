import { createUser, signIn, signOut, db } from '../firebase-service';
import { toggleModalClose, toggleModalOpen } from '../helpers/toggleModal';
import isEmailRight from '../helpers/email-checker';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const authFormMessages = {
  name: document.querySelector('.js__auth-modal__name__message'),
  email: document.querySelector('.js__auth-modal__email__message'),
  password: document.querySelector('.js__auth-modal__password__message'),
};

const backdropRef = document.querySelector('.backdrop');
/**
 * Represent a additional config object for modal window.
 * @param {string} exercise required if subscribe on before/after
 */
const modalConfig = {
  exercise: {},
  beforeOpen: null,
  afterOpen: null,
  beforeClose: null,
  afterClose: null,
};

const loginButtons = document.querySelectorAll('.header__auth_btn');
const authModal = document.querySelector('.authModal__content');
const closeButton = document.querySelector('.authModal__content .x-button');
const authForm = document.querySelector('.authForm');
const actionText = document.querySelector('.action__text');
const btnChangeForm = document.querySelector('.action__button');
const usernameFieldset = document.querySelector('.authForm__fieldset.username');
const title = document.querySelector('.authForm__title');

const headerGroup = document.querySelectorAll('.header__nav-authorized');
const authLinkEl = document.querySelectorAll('.header__nav__item.auth');
const btnLogOut = document.querySelectorAll('.header__logout_btn');

let isRegMode = true;

const closeModal = () => {
  if (modalConfig.beforeClose) {
    modalConfig.beforeClose(modalConfig.exercise);
    modalConfig.beforeClose = null;
  }
  toggleModalClose(authModal);
  closeButton.removeEventListener('click', closeModal);
  loginButtons.forEach(btn => btn.addEventListener('click', openModal));
  document.body.style.overflow = 'visible';
  if (modalConfig.afterClose) {
    modalConfig.afterClose(modalConfig.exercise);
    modalConfig.afterClose = null;
  }
  backdropRef.removeEventListener('click', handleCloseOnBackdrop);
  document.removeEventListener('keydown', handleCloseOnEscape);
};

const openModal = () => {
  if (modalConfig.beforeOpen) {
    modalConfig.beforeOpen(modalConfig.exercise);
    modalConfig.beforeOpen = null;
  }
  toggleModalOpen(authModal);
  closeButton.addEventListener('click', closeModal);
  loginButtons.forEach(btn => btn.removeEventListener('click', openModal));
  document.body.style.overflow = 'hidden';
  if (modalConfig.afterOpen) {
    modalConfig.afterOpen(modalConfig.exercise);
    modalConfig.afterOpen = null;
  }

  backdropRef.addEventListener('click', handleCloseOnBackdrop);
  document.addEventListener('keydown', handleCloseOnEscape);
};

const resetForm = () => {
  authForm.reset();
};

const handleSubmit = async event => {
  event.preventDefault();

  if (
    isRegMode &&
    (!authForm.elements.name.value || authForm.elements.name.value.length < 3)
  ) {
    authFormMessages.name.classList.remove('hidden');
    return;
  }

  if (
    !authForm.elements.email.value ||
    !isEmailRight(authForm.elements.email.value)
  ) {
    authFormMessages.email.classList.remove('hidden');
    return;
  }

  if (
    !authForm.elements.password.value ||
    authForm.elements.password.value.length < 6
  ) {
    authFormMessages.password.classList.remove('hidden');
    return;
  }

  const formData = [...authForm.elements].reduce((formData, element) => {
    if (element.name) {
      formData[element.name] = element.value;
    }
    return formData;
  }, {});

  if (isRegMode) {
    try {
      await createUser(formData);
    } catch (error) {
      iziToast.error({
        position: 'topRight',
        message: `This email is already in use`,
      });
      return;
    }

    const currentUserName = (await db.auth().currentUser)?.displayName

    iziToast.success({
      title: '🤩',
      position: 'topRight',
      message: `Hello, ${currentUserName}`,
    });

  }

  await signIn(formData);
  resetForm();
  authForm.elements.regSubmitBtn.disabled = true;
  const currentUserName = (await db.auth().currentUser)?.displayName

  iziToast.success({
    position: 'topRight',
    message: `Hello, ${currentUserName}`,
  });
  closeModal();
};


const changeForm = () => {
  if (isRegMode) {
    btnChangeForm.textContent = 'Registration';
    usernameFieldset.classList.add('hidden');
    btnChangeForm.setAttribute('data-action', 'log_in');
    title.textContent = 'Log in';
    actionText.textContent = "Don't have an account?";
    resetForm();
    isRegMode = false;
  } else {
    btnChangeForm.textContent = 'Log in';
    btnChangeForm.setAttribute('data-action', 'reg');
    usernameFieldset.classList.remove('hidden');
    title.textContent = 'Registration';
    actionText.textContent = 'Already have an account?';
    resetForm();
    isRegMode = true;
  }
  authForm.elements.name.toggleAttribute('required');
};

const checkCurrentUser = async () => {
  await db.auth().onAuthStateChanged(user => {
    if (user) {
      // userName.textContent = user.displayName;
      // userName.classList.remove('hidden');
      authLinkEl.forEach(el => {
        el.classList.add('hidden');
      });
      btnLogOut.forEach(el => {
        el.classList.add('visible');
      });
      headerGroup.forEach(el => {
        el.classList.add('visible');
      });
    } else {
      authLinkEl.forEach(el => {
        el.classList.remove('hidden');
      });
      btnLogOut.forEach(el => {
        el.classList.remove('visible');
      });
      headerGroup.forEach(el => {
        el.classList.remove('visible');
      });
    }
  });
};

const handleCloseOnEscape = event => {
  if (event.key === 'Escape') {
    closeModal();
  }
};

const handleCloseOnBackdrop = event => {
  if (event.target.classList.contains("backdrop")) {
    closeModal();
  }
};

const handleSignOut = async () => {
  await signOut();
  btnLogOut.forEach(el => {
    el.classList.add('hidden');
  });

  iziToast.info({
    position: 'topRight',
    message: `Successfully log out!`,
  });

  setTimeout(() => {
    window.location.pathname = '/project-fitness-07/';
  }, 1000)

};

backdropRef.addEventListener('click', handleCloseOnBackdrop);
loginButtons.forEach(btn => btn.addEventListener('click', openModal));
authForm.addEventListener('submit', handleSubmit);
btnChangeForm.addEventListener('click', changeForm);
btnLogOut.forEach(el => {
  el.addEventListener('click', handleSignOut);
});

checkCurrentUser();

authForm.elements.name.addEventListener('focus', handlerNameFocus);

function handlerNameFocus() {
  authFormMessages.name.classList.add('hidden');
}

authForm.elements.email.addEventListener('focus', handlerEmailFocus);

function handlerEmailFocus() {
  authFormMessages.email.classList.add('hidden');
}

authForm.elements.password.addEventListener('focus', handlerPasswordFocus);

function handlerPasswordFocus() {
  authFormMessages.password.classList.add('hidden');
}

authForm.elements.name.addEventListener('input', handlerInputData);

authForm.elements.email.addEventListener('input', handlerInputData);

authForm.elements.password.addEventListener('input', handlerInputData);

function handlerInputData() {
  (isRegMode &&
    authForm.elements.name.value &&
    authForm.elements.email.value &&
    authForm.elements.password.value) ||
    (!isRegMode &&
      authForm.elements.email.value &&
      authForm.elements.password.value)
    ? (authForm.elements.regSubmitBtn.disabled = false)
    : (authForm.elements.regSubmitBtn.disabled = true);
}

export const authModalWindow = {
  modalConfig,
  openModal,
};
