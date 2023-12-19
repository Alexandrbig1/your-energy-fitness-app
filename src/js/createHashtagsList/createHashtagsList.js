function createHashtagsList() {
  const container = document.querySelector('.hero__hashtags-wrap');
  const list = document.createElement('ul');
  list.classList.add('hashtags__list');
  const items = ['Sport', 'Healthy', 'Workout', 'Diet'].map(el => `
  <li class='hashtags__item'>#${el}</li>
`).join('');
  list.innerHTML = items;
  container.insertAdjacentElement('beforeend', list);
}

export default createHashtagsList;