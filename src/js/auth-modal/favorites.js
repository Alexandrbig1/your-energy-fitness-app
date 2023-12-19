import { signOut, db } from '../firebase-service';

const headerGroup = document.querySelectorAll('.header__nav-authorized');
const authLinkEl = document.querySelectorAll(".header__nav__item.auth")
const btnLogOut = document.querySelectorAll('.header__logout_btn');


const checkCurrentUser = async () => {
  await db.auth().onAuthStateChanged(user => {
    if (user) {
      authLinkEl.forEach(el => {
        el.classList.add('hidden');
      })
      btnLogOut.forEach(el => {
        el.classList.add('visible');
      })
      headerGroup.forEach(el => {
        el.classList.add('visible');
      })


    } else {
      authLinkEl.forEach(el => {
        el.classList.remove('hidden');
      })
      btnLogOut.forEach(el => {
        el.classList.remove('visible');
      })
      headerGroup.forEach(el => {
        el.classList.remove('visible');
      })
    }
  });
};

const handleSignOut = async () => {
  await signOut();
  btnLogOut.forEach(el => {
    el.classList.add('hidden');
  })

  window.location.pathname = '/project-fitness-07/'
};

btnLogOut.forEach(el => {
  el.addEventListener('click', handleSignOut);
})

checkCurrentUser();
