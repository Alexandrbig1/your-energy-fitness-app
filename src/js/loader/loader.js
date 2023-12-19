const loader = document.querySelector('.loader');
const content = document.querySelector('.content-wrapper');

export function handleHideLoader() {
  loader.classList.add('hide');
  content.classList.remove('hide');
}