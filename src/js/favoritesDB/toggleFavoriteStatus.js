import { favoritesDB } from '.';

export const toggleFavoriteStatus = async function (exercise) {
  const { _id } = exercise;
  try {
    const isFavoriteValue = await favoritesDB.idIsFavorite(_id);

    if (isFavoriteValue) {
      // Видалити об'єкт зі списку улюблених
      const response = await favoritesDB.remove(_id);

      localStorage.setItem('isDataOld', JSON.stringify(true));
      return false;
    } else {
      // Додати об'єкт на сервер та отримати відповідь
      localStorage.setItem('isDataOld', JSON.stringify(true));
      const response = await favoritesDB.add(_id, exercise);

      return response;
    }
  } catch (error) {
    return false;
  }
};
