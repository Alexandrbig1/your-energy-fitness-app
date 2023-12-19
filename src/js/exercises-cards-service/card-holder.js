import {
  showFavoriteCards,
  showInitialCards,
  showWorkoutCards,
  cleanerCardWrapper,
} from "../templates/exercise-cards";
import {
  getData,
  checkExerciseParams,
  checkWorkoutParams,
  getFiltersFromPage,
  getFavoriteData,
} from "./cards-service";
import {
  classes,
  defaultStrings,
  addInnerOfElement,
  addClass,
  deleteClass,
} from "./class-worker";
import ApiService from "../api-service";
import { cleanerPages, showPages } from "../templates/pages";
import { checkCard, checkWorkoutCard, checkPage } from "./checker";
import { favoritesDB } from "../favoritesDB";
import { openModalExercise } from "../exercise-modal";
import adaptHeight from "./height-adapter.js";
import _ from "lodash";
import { updateViewPort } from "./update-view-port";
import { setActiveCategory, filterOn } from "../filters";
import scrollUpToSection from "../helpers/scroll-up.js";

import { isEmpty } from "lodash";

window.addEventListener("resize", _.debounce(cardsHandler, 1000));
const DESKTOP_WIDTH = 1440;

//Default parameteres for search
let params = {
  filter: "Muscles",
  bodypart: "",
  keyword: "",
  muscles: "",
  equipment: "",
};

const pageFilter = {
  currentPage: 1,
  endPoint: 3,
};

const listen = {
  cardsLinks: null,
  pageLinks: null,
  workoutLinks: null,
};

//There are 3 endpoints: 1 - favorites, 2 - exercises (target of search), 3 - filter

async function cardsHandler() {
  const element = document.querySelector(".exercise-cards__section");
  element.offsetHeight;
  const fetch = new ApiService();
  const viewPort = updateViewPort();
  let data;
  let connection;
  getFiltersFromPage(params, pageFilter);
  addClass(classes.visuallyHidden, classes.emptyParag);
  deleteClass(classes.emptyWrapper, classes.exerciseWrapper);
  adaptHeight(pageFilter.endPoint, viewPort);
  try {
    switch (pageFilter.endPoint) {
      // If the endpoint has /favorites do the next
      case 1:
        addClass(classes.favoriteWrapper, classes.exerciseWrapper);
        deleteClass(classes.workoutWrapper, classes.exerciseWrapper);
        data = await getFavoriteData(pageFilter, viewPort);
        if (data.currentData.length < 1) {
          throw new Error("No data");
        }
        cleanerCardWrapper();
        cleanerPages();
        showFavoriteCards(data.currentData);
        if (viewPort < DESKTOP_WIDTH) {
          showPages(pageFilter.currentPage, data.totalPages);
        }

        listenPages(pageFilter.endPoint);
        break;
      // If the endpoint has /exercise do the next
      case 2:
        deleteClass(classes.favoriteWrapper, classes.exerciseWrapper);
        addClass(classes.workoutWrapper, classes.exerciseWrapper);
        scrollUpToSection(".exercises");
        connection = checkWorkoutParams(
          pageFilter.currentPage,
          pageFilter.endPoint,
          fetch,
          params,
          connection,
          viewPort
        );
        data = await getData(connection);
        if (data.length < 1) {
          throw new Error("No data");
        }
        cleanerCardWrapper();
        cleanerPages();
        showWorkoutCards(data);
        showPages(pageFilter.currentPage, fetch.maxPages);

        listenPages(pageFilter.endPoint);
        listenWorkoutCards();
        break;
      // If the endpoint has /filter do the next
      case 3:
        deleteClass(classes.workoutWrapper, classes.exerciseWrapper);
        deleteClass(classes.favoriteWrapper, classes.exerciseWrapper);
        connection = checkExerciseParams(
          pageFilter.currentPage,
          pageFilter.endPoint,
          fetch,
          params,
          connection,
          viewPort
        );
        data = await getData(connection);
        cleanerCardWrapper();
        cleanerPages();

        showInitialCards(data);
        showPages(pageFilter.currentPage, fetch.maxPages);

        listenCards();
        listenPages(pageFilter.endPoint);
        break;
    }
  } catch (error) {
    cleanerCardWrapper();
    cleanerPages();
    addClass(classes.emptyWrapper, classes.exerciseWrapper);
    if (pageFilter.endPoint != 1) {
      addInnerOfElement(defaultStrings.stringHome, classes.exerciseWrapper);
    } else {
      addInnerOfElement(defaultStrings.stringFavorite, classes.exerciseWrapper);
    }
    deleteClass(classes.visuallyHidden, classes.emptyParag);
  }
}

function listenCards() {
  listen.cardsLinks = document.querySelector(".js-cards");
  if (listen.cardsLinks) {
    listen.cardsLinks.addEventListener("click", targetHandler);
  } else {
    console.error("Element with class 'js-cards' not found.");
  }
}

function targetHandler(evt) {
  const result = checkCard(evt);
  setActiveCategory(result);
  changeToValidUrl(result);
  if (result != null || undefined || NaN)
    if (params.filter === "Muscles") {
      pageFilter.endPoint = 2;
      params.muscles = result;
    } else if (params.filter === "Body%20parts") {
      pageFilter.endPoint = 2;
      params.bodypart = result;
    } else if (params.filter === "Equipment") {
      pageFilter.endPoint = 2;
      params.equipment = result;
    }
  listen.cardsLinks.removeEventListener("click", targetHandler);
  pageFilter.currentPage = 1;
  cardsHandler();
}

function changeToValidUrl(string) {
  return string.includes(" ") ? string.replace(" ", "%20") : string;
}

function listenPages() {
  listen.pageLinks = document.querySelector(".js-pages");
  if (listen.pageLinks) {
    listen.pageLinks.addEventListener("click", pagesHandler);
  } else {
    console.error("Element with class 'js-pages' not found.");
  }
}

function pagesHandler(evt) {
  const clickedPage = checkPage(evt);
  scrollUpToSection(
    window.location.href.includes("/favorites") ? ".favorites" : ".exercises"
  );
  if (
    pageFilter.currentPage != clickedPage &&
    (clickedPage != null || undefined || NaN)
  ) {
    pageFilter.currentPage = +clickedPage;
    cardsHandler();
  }
}

function listenWorkoutCards() {
  listen.workoutLinks = document.querySelector(".js-cards");
  if (listen.workoutLinks) {
    listen.workoutLinks.addEventListener("click", workoutHandler);
  } else {
    console.error("Element with class 'js-cards' not found for workout.");
  }
}

async function workoutHandler(evt) {
  const exerciseId = checkWorkoutCard(evt);
  if (!exerciseId) {
    return;
  }

  const apiService = new ApiService();

  try {
    apiService.id = exerciseId;
    const exercise = await apiService.fetchExerciseById();

    if (isEmpty(exercise)) {
      throw new Error("Exercise not found!");
    }

    exercise.isFavorite = await favoritesDB.idIsFavorite(exerciseId);
    openModalExercise(exercise);
  } catch (error) {
    console.error(error);
  }
}

export function startEngine() {
  if (window.location.href.includes("/favorite")) {
    pageFilter.endPoint = 1;
    cardsHandler();
  } else {
    filterOn();
  }
}

startEngine();

export { params, pageFilter, cardsHandler, workoutHandler };
