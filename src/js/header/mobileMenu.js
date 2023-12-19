export const mobileToggle = function () {
  const refs = {
    toggleMobileMenuBTN: document.querySelector('[data-mobile-menu-btn]'),
    bodyAddClass: document.querySelector('body'),
    mobileMenu: document.querySelector('[data-mobile-menu]'),
    mobileMenuContent: document.querySelector('[data-mobile-menu-content]'),
    loginBTN: document.querySelector('[data-login-btn]'),
    closeLogFormEL: document.querySelector('.authModal__content .x-button'),
    backdrop: document.querySelector('.backdrop'),
  };

  refs.toggleMobileMenuBTN.addEventListener('click', toggleMobileMenu);
  refs.mobileMenu.addEventListener('click', toggleMobileMenu);
  refs.loginBTN.addEventListener('click', closeMobileMenuOpenLogForm);
  refs.mobileMenuContent.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  if (!window.location.pathname.includes('favorites')) {
    refs.closeLogFormEL.addEventListener('click', closeMobileLoginForm);
  }
  function closeMobileMenuOpenLogForm() {
    const burger = document.getElementById('MobileBTN');
    const loginForm = document.querySelector('.authModal__content');
    refs.bodyAddClass.classList.remove('is-hidden');
    refs.mobileMenu.classList.add('is-hidden');
    burger.classList.remove('active');
    loginForm.classList.add('open');
  }
  function closeMobileLoginForm() {
    const loginForm = document.querySelector('.authModal__content');
    refs.backdrop.classList.toggle('open');
    loginForm.classList.remove('open');
  }

  function toggleMobileMenu() {
    refs.bodyAddClass.classList.toggle('is-hidden');
    refs.mobileMenu.classList.toggle('is-hidden');
  }
};
