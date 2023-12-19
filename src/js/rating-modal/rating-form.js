import isEmailRight from "../helpers/email-checker";
import ApiService from "../api-service/index";
import { ratingWindow } from "./rating-modal";

const subscribeForm = {
  form: document.querySelector(".modal-form"),
  ratings: document.querySelectorAll(".rating-stars input"),
  emailInput: document.querySelector(".modal-form-email"),
  validateEmailMessage: document.querySelector(".modal-email-validate"),
  btn: document.querySelector(".feedback-submit"),
};

subscribeForm.form.addEventListener("submit", handlerFormSubmit);

async function handlerFormSubmit(ev) {
  ev.preventDefault();

  const email = ev.target.elements.email.value.trim().toLowerCase();

  if (isEmailRight(email)) {
    try {
      const fetch = new ApiService();

      let ratingCheckedEl = Array.from(subscribeForm.ratings).find(
        (rating) => rating.dataset.dataChecked
      );
      const { _id } = ratingWindow.modalConfig.exercise;

      fetch.rating = parseInt(ratingCheckedEl.value);
      fetch.email = email;
      fetch.review = subscribeForm.validateEmailMessage.value;
      fetch.exerciseId = _id;
      await fetch.addRating();
      subscribeForm.validateEmailMessage.textContent =
        "✅ Thank you for you feedback";
      subscribeForm.validateEmailMessage.classList.remove(
        "full_hidden",
        "validate-form-message"
      );
      subscribeForm.validateEmailMessage.classList.add(
        "validate-form-message_ok"
      );
      ev.target.reset();
    } catch (error) {
      console.log(error);
      subscribeForm.validateEmailMessage.textContent =
        "⚠️ This email address was previously added";
      subscribeForm.validateEmailMessage.classList.remove(
        "full_hidden",
        "validate-form-message_ok"
      );
      subscribeForm.validateEmailMessage.classList.add(
        "validate-form-message_warning"
      );
    }
  } else {
    subscribeForm.validateEmailMessage.textContent =
      "⚠️ Your email has wrong format";
    subscribeForm.validateEmailMessage.classList.remove(
      "full_hidden",
      "validate-form-message_ok"
    );
    subscribeForm.validateEmailMessage.classList.add(
      "validate-form-message_warning"
    );
  }

  setTimeout(() => {
    subscribeForm.validateEmailMessage.classList.add("full_hidden");
  }, 2000);
}

subscribeForm.emailInput.addEventListener("input", handlerEmailInput);

function handlerEmailInput(ev) {
  ev.target.value.trim()
    ? (subscribeForm.btn.disabled = false)
    : (subscribeForm.btn.disabled = true);
}

subscribeForm.emailInput.addEventListener("focus", handlerEmailFocus);

function handlerEmailFocus() {
  subscribeForm.validateEmailMessage.classList.add("full_hidden");
}
