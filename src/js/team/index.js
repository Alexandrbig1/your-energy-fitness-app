import team from './db';

const teamList = document.querySelector('.team__list');
const BASE_URL = import.meta.env.BASE_URL;

(function addTeam() {
  teamList.innerHTML = team
    .map(
      ({ name, role, desc, photo, github, email, linkedin }) =>
        `
       <li class="team__list__item">
           <img class="team__list__item__img" src="${photo}" alt="" />
           <div class="team__list__item__box">
           <h2 class="team__list__item__name">${name}</h2>
           <div class="team__list__item_deco"></div>
           <p class="team__list__item__role">${role}</p>
           <div class="team__list__item_deco"></div>
           <p class="team__list__item__description">${desc}</p>
           <ul class="team__social__list">
             <li class="team__social__list__item">
               <a href="${email}" target="_blank" rel="noopener noreferrer">
                 <svg class="team__social__icon" aria-label="Email icon">
                   <use href="${BASE_URL}images/icons-sprite.svg#email"></use>
                 </svg>
               </a>
             </li>
                <li class="team__social__list__item">
               <a href="${linkedin}" target="_blank" rel="noopener noreferrer">
                 <svg class="team__social__icon" aria-label="Linkedin icon">
                   <use href="${BASE_URL}images/icons-sprite.svg#icon-linkedin"></use>
                 </svg>
               </a>
             </li>
                <li class="team__social__list__item">
               <a href="${github}" target="_blank" rel="noopener noreferrer">
                 <svg class="team__social__icon" aria-label="Instagram icon">
                   <use href="${BASE_URL}images/icons-sprite.svg#icon-github"></use>
                 </svg>
               </a>
             </li>
           </ul>
           </div>
         </li>`
    )
    .join('');
})();
