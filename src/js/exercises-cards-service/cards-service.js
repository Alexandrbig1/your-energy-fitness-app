import { createCardsSkeleton, addMarkupToHtml } from '../createSkeleton/index.js';
import { favoritesDB } from '../favoritesDB/favoritesDB.js';

const list = document.querySelector('.js-cards');

//It`s looking what endpoint and viewSize is, then give a number of cards to show
function calculateObjects(endPoint, viewSize) {
  if (viewSize >= 768) {
    if (endPoint != 3) {
      addMarkupToHtml(list, createCardsSkeleton(10, list));
      return 10;
    }
    addMarkupToHtml(list, createCardsSkeleton(12, list));
    return 12;
  } else if (viewSize < 768) {
    if (endPoint === 1) {
      addMarkupToHtml(list, createCardsSkeleton(8, list));
      return 8;
    } else if (endPoint === 2 || endPoint === 1) {
      addMarkupToHtml(list, createCardsSkeleton(8, list));
      return 8;
    }
  }
  addMarkupToHtml(list, createCardsSkeleton(9, list));
  return 9;
}


function areParamsDifferent(params) {
  const defaultParams = {
    filter: 'Body%20parts',
    bodypart: '',
    keyword: '',
    muscles: '',
    equipment: '',
  };
  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== defaultParams[key]) {
      return true;
    }
  }

  return false;
}

function checkWorkoutParams(currentPage, endPoint, fetch, params, connection, viewPort) {
  if (areParamsDifferent(params)) {
    fetch.bodyPart = params.bodypart;
    fetch.searchQuery = params.keyword;
    fetch.muscles = params.muscles;
    fetch.equipment = params.equipment;
    connection = getConnection(currentPage, endPoint, fetch, viewPort).fetchFilteredExercises();
  } else {

    connection = getConnection(currentPage, endPoint, fetch, viewPort).fetchExercise();
  }
  return connection;
}

function checkExerciseParams(currentPage, endPoint, fetch, params, connection, viewPort) {
  if (areParamsDifferent(params)) {
    fetch.filter = params.filter;
    connection = getConnection(currentPage, endPoint, fetch, viewPort).fetchMuscles();
  } else {
    connection = getConnection(currentPage, endPoint, fetch, viewPort).fetchMuscles();
  }
  return connection;
}

function getConnection(currentPage, endPoint, fetch, viewPort) {
  const perPage = calculateObjects(endPoint, viewPort);
  fetch.pageCounter = currentPage;
  fetch.limit = perPage;
  return fetch;
}

function getData(promise) {
  return promise
  .then(result => {
    return result;
  })
  .catch(error => {
    console.error('Error in getData:', error);
    throw error;
  });
}

function getFiltersFromPage(params, pageFilter) {
  const filters = document.querySelector('.filters__list .active');

  if (filters) {
    const id = filters.id.includes('-') ? (filters.id.charAt(0).toUpperCase()
        + filters.id.slice(1)).replace('-', '%20')
      : filters.id.charAt(0).toUpperCase() + filters.id.slice(1);
    ;
    if (id != params.filter || params.filter === '') {
      params.filter = id;
      for (const key in params) {
        if (key !== 'filter') {
          params[key] = '';
        }
      }
      pageFilter.currentPage = 1;
      pageFilter.endPoint = 3;
    }
  }
}

async function getFavoriteData({currentPage, endPoint}, viewPort){
  let result;
  const maxCards = calculateObjects(endPoint, viewPort);
  const favoriteData = localStorage.getItem('favoriteData');
  const isDataOld = localStorage.getItem('isDataOld');
  const storedData = isDataOld ? JSON.parse(isDataOld) : [];
  if (storedData || storedData.length === 1) {
    try { 
    const data = await favoritesDB.get();
    result = sliceCardsPages(data, maxCards);
    
    localStorage.setItem('favoriteData', JSON.stringify(data));
    if (favoriteData){
      localStorage.setItem('isDataOld', JSON.stringify(false));
    }
    const currentData = reduceData(currentPage, result);

    return { totalPages: result.totalPages, currentData: currentData };
    } catch (error) {
      console.log("Favorite data error: ", error);
    }
  } else {
    const storedData = favoriteData ? JSON.parse(favoriteData) : [];
    const result = sliceCardsPages(storedData, maxCards);
    const currentData = reduceData(currentPage, result);
    return { totalPages: result.totalPages, currentData: currentData };
    }
} 

function sliceCardsPages(data, cardsToShow){
  const length = data.length;
  if (length <= cardsToShow){
    return {totalPages: 1, slicedData: data};
  } else if (length > cardsToShow){
    const maxPages = Math.ceil(length / cardsToShow);
    let slicedData = [];
    for (let i = 0; i < maxPages; i++) {
      const start = i * cardsToShow;
      const end = (i + 1) * cardsToShow;
      slicedData.push(data.slice(start, end));
    }
    return {totalPages: maxPages, slicedData: slicedData};
  }
}

function reduceData(currentPage, {totalPages, slicedData}){
  return totalPages === 1 ? slicedData : slicedData[currentPage - 1];
}

export {
  getData,
  getConnection,
  checkExerciseParams,
  checkWorkoutParams,
  areParamsDifferent,
  calculateObjects,
  getFiltersFromPage,
  getFavoriteData
};