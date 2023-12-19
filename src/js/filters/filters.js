import exp from "constants";
import ApiService from "../api-service";
import { params, pageFilter, cardsHandler } from "../exercises-cards-service/card-holder";
import _ from 'lodash';
import { getFiltersFromPage } from "../exercises-cards-service/cards-service";

const searchEl = document.querySelector(".search__wrapper")
const inputEl = document.querySelector(".search__input");
const categoriesListEl = document.querySelector(".filters__list")
const currentCategoryEl = document.querySelector(".filters__category")

const debouncedHandleInput = _.debounce(handleInput, 500);


async function setCategoriesIntoMarkup(fetch) {
  try{
    const data = await fetch.fetchFilters();

    const categories = [...new Set(data.map(({ filter }) => filter))]

    const categoriesItemsMarkup = categories.map((category, index) => {
      const categoryId = category.toLowerCase().split(" ").join("-")
      if (index === 0) {
        return `<li id=${categoryId} class="filters__item active">${category}</li>`
      }
      return `<li id=${categoryId} class="filters__item">${category}</li>`
    }).join("")

    categoriesListEl.insertAdjacentHTML("afterbegin", categoriesItemsMarkup)
    cardsHandler();
  } catch(error){
    console.log('Error fetching filters:', error);
  }
}

export function setActiveCategory(category) {
  const formatedCategory = category.charAt(0).toUpperCase() + category.slice(1, category.length);

  currentCategoryEl.innerHTML = `<div>/</div>${formatedCategory}`

  currentCategoryEl.classList.add("active")
  searchEl.classList.add("active")
}

function removeActiveCategory() {
  currentCategoryEl.classList.remove("active")
  searchEl.classList.remove("active")
}

async function handleInput(e) {
  const query = e.target.value.toLowerCase().trim();
  params.keyword = query;

  cardsHandler();
}

function handleCategories(e) {
  const categoryEl = e.target;
  const categoryId = e.target.id;

  if (categoryEl.classList.contains("active")) {
    const params = {
      filter: categoryId,
      bodypart: '',
      keyword: '',
      muscles: '',
      equipment: '',
    };
    getFiltersFromPage(params, pageFilter);
    cardsHandler()
  };

  [...categoriesListEl.children].forEach((item) => {
    item.classList.remove("active")
  })

  categoryEl.classList.add("active")


  removeActiveCategory();

  pageFilter.currentPage = 1;
  cardsHandler();
}

function filterOn(){
  if (pageFilter.endPoint != 1 ){
    const fetch = new ApiService();
    setCategoriesIntoMarkup(fetch);
    
  }
}

if (inputEl){
  inputEl.addEventListener("input", debouncedHandleInput);
}
if(categoriesListEl){
  categoriesListEl.addEventListener("click", handleCategories);
}

export {filterOn};