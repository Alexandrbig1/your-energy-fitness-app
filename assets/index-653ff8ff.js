import{i as r,A as n}from"./index-42cf7671.js";import{r as o}from"./observer-f05ca51f.js";import"./index-643bc2f7.js";function m(){const t=document.querySelector(".hero__hashtags-wrap"),s=document.createElement("ul");s.classList.add("hashtags__list");const a=["Sport","Healthy","Workout","Diet"].map(i=>`
  <li class='hashtags__item'>#${i}</li>
`).join("");s.innerHTML=a,t.insertAdjacentElement("beforeend",s)}window.addEventListener("load",m);const e={form:document.querySelector(".modal-form"),ratings:document.querySelectorAll(".rating-stars input"),emailInput:document.querySelector(".modal-form-email"),validateEmailMessage:document.querySelector(".modal-email-validate"),btn:document.querySelector(".feedback-submit")};e.form.addEventListener("submit",c);async function c(t){t.preventDefault();const s=t.target.elements.email.value.trim().toLowerCase();if(r(s))try{const a=new n;let i=Array.from(e.ratings).find(d=>d.dataset.dataChecked);const{_id:l}=o.modalConfig.exercise;a.rating=parseInt(i.value),a.email=s,a.review=e.validateEmailMessage.value,a.exerciseId=l,await a.addRating(),e.validateEmailMessage.textContent="✅ Thank you for you feedback",e.validateEmailMessage.classList.remove("full_hidden","validate-form-message"),e.validateEmailMessage.classList.add("validate-form-message_ok"),t.target.reset()}catch(a){console.log(a),e.validateEmailMessage.textContent="⚠️ This email address was previously added",e.validateEmailMessage.classList.remove("full_hidden","validate-form-message_ok"),e.validateEmailMessage.classList.add("validate-form-message_warning")}else e.validateEmailMessage.textContent="⚠️ Your email has wrong format",e.validateEmailMessage.classList.remove("full_hidden","validate-form-message_ok"),e.validateEmailMessage.classList.add("validate-form-message_warning");setTimeout(()=>{e.validateEmailMessage.classList.add("full_hidden")},2e3)}e.emailInput.addEventListener("input",u);function u(t){t.target.value.trim()?e.btn.disabled=!1:e.btn.disabled=!0}e.emailInput.addEventListener("focus",g);function g(){e.validateEmailMessage.classList.add("full_hidden")}
