import axios from 'axios';
const API_BASE_URL = 'https://your-energy.b.goit.study/api/';

const http = axios.create({
  baseURL: API_BASE_URL,
});

export default class ApiService {
  constructor() {
    this.exerciseId = null;
    this.maxPages = null;
    this.searchQuery = '';
    this.pageCounter = 1;
    this.muscles = '';
    this.equipment = '';
    this.bodyPart = '';
    this.rating = null;
    this.email = '';
    this.review = '';
    this.limit = '';
    this.filter = "Body%20parts";
  }

  async fetchMuscles() {
    const URL = `filters?filter=${this.filter}&page=${this.pageCounter}&limit=${this.limit}`;
    try {
      const response = await http.get(URL);
      this.maxPages = response.data.totalPages;
      return response.data.results;
    } catch (error) {
      console.error('Error fetching muscles:', error);
      throw error;
    }
  }

  async fetchExercise() {
    const URL = `exercises/page=${this.pageCounter}&limit=${this.limit}`;
    try {
      const response = await http.get(URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching Exercise:', error);
    }
  }
  async fetchFilters() {
    const URL = 'filters';
    try {
      const response = await http.get(URL);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw error;
    }
  }

  async fetchExerciseById() {
    const URL = `exercises/${this.exerciseId}`;
    try {
      const response = await http.get(URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching ExerciseById:', error);
      throw error;
    }
  }

  async fetchQuote() {
    const URL = `quote`;
    try {
      const response = await http.get(URL);
      return response.data;
    } catch (error) {
      return error;
    }
  }
  async fetchFilteredExercises() {
    const URL = `exercises?bodypart=${this.bodyPart}&muscles=${this.muscles}&equipment=${this.equipment}&keyword=${this.searchQuery}&page=${this.pageCounter}&limit=${this.limit}`;
    try {
      const response = await http.get(URL);
      this.maxPages = response.data.totalPages;
      return response.data.results;
    } catch (error) {
      console.error('Error fetching FilteredExercises:', error);
      throw error;
    }
  }
  async addRating() {
    const URL = `exercises/${this.exerciseId}/rating`;
    try {
      const response = await http.patch(URL, {
        rate: this.rating,
        email: this.email,
        review: this.review,
      });
      return response.data;
    } catch (error) {
      console.error('Error addRating:', error);
      throw error;
    }
  }

  async subscribe() {
    const URL = `subscription`;
    try {
      const response = await http.post(URL, {
        email: this.email,
      });
      return response.data;
    } catch (error) {
      console.error('Error subscribe:', error);
      throw error;
    }
  }

  get id() {
    return this.exerciseId;
  }

  set id(newExerciseId) {
    return (this.exerciseId = newExerciseId);
  }

  get numberOfPages() {
    return this.maxPages;
  }

  get page() {
    return this.pageCounter;
  }
  
  set page(newPage) {
    return (this.pageCounter = newPage);
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }

  get musclesFeature() {
    return this.muscles;
  }

  set musclesFeature(newMuscles) {
    this.muscles = newMuscles;
  }

  get equipmentFeature() {
    return this.equipment;
  }

  set equipmentFeature(newEquipment) {
    this.equipment = newEquipment;
  }

  get bodyPartFeature() {
    return this.bodyPart;
  }

  set bodyPartFeature(newBodyPart) {
    this.bodyPart = newBodyPart;
  }

  get ratingFeature() {
    return this.rating;
  }

  set ratingFeature(newRating) {
    this.rating = newRating;
  }

  get getLimitPerPage() {
    return this.limit;
  }

  set setLimitPerPage(limit) {
    this.limit = limit;
  }

  get getFilter() {
    return this.filter;
  }

  set setFilter(filter) {
    this.filter = filter;
  }
}

// example how to use in your code
// import ApiService from './js/api-service';
// const fetch = new ApiService();
// fetch.fetchMuscles().then(data => {
//   console.log(data);
// });
// fetch.id = '64f389465ae26083f39b17a2';
// fetch.fetchExerciseById().then(data => {
//   console.log(data);
// });
