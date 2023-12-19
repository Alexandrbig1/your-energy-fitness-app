import isEmailRight from "../helpers/email-checker";
import ApiService from "../api-service/index";

const THANKS_FOR_SUBSCRIPT = "✅ Thank you for you subscription";
const PREV_ADDED_EMAIL = "⚠️ This email address was previously added";
const WRONG_EMAIL_FORMAT = "⚠️ Your email has wrong format";

const subscribeForm = {
  form: document.querySelector(".footer__form"),
  emailInput: document.querySelector(".footer__form__input"),
  message: document.querySelector(".footer__form__message"),
  btn: document.querySelector(".footer__form__btn"),
};

subscribeForm.form.addEventListener("submit", handlerFormSubmit);

async function handlerFormSubmit(ev) {
  ev.preventDefault();

  const email = ev.target.elements.email.value.trim().toLowerCase();

  if (isEmailRight(email)) {
    try {
      const fetch = new ApiService();
      fetch.email = email;
      await fetch.subscribe();
      subscribeForm.message.textContent = THANKS_FOR_SUBSCRIPT;
      subscribeForm.message.classList.remove(
        "full_hidden",
        "footer__form__message_waring"
      );
      subscribeForm.message.classList.add("footer__form__message_ok");
      ev.target.reset();
    } catch (error) {
      subscribeForm.message.textContent = PREV_ADDED_EMAIL;
      subscribeForm.message.classList.remove(
        "full_hidden",
        "footer__form__message_ok"
      );
      subscribeForm.message.classList.add("footer__form__message_warning");
    }
  } else {
    subscribeForm.message.textContent = WRONG_EMAIL_FORMAT;
    subscribeForm.message.classList.remove(
      "full_hidden",
      "footer__form__message_ok"
    );
    subscribeForm.message.classList.add("footer__form__message_warning");
  }
}

subscribeForm.emailInput.addEventListener("input", handlerEmailInput);

function handlerEmailInput(ev) {
  ev.target.value.trim()
    ? (subscribeForm.btn.disabled = false)
    : (subscribeForm.btn.disabled = true);
}

subscribeForm.emailInput.addEventListener("focus", handlerEmailFocus);

function handlerEmailFocus() {
  subscribeForm.message.classList.add("full_hidden");
}
