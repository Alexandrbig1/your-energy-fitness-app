//M. Startsev
// додає властивість isFavorite в в кожен об'єкт масиву

export const updateFavoritesStatus = (serverArr, favoritesDBArr) => {
  // Створюємо об'єкт для швидкого пошуку за _id в favoritesDBArr
  const arr2Map = {};
  Object.values(favoritesDBArr).forEach(obj => {
    arr2Map[obj._id] = obj;
  });

  // Перевіряємо кожен елемент serverArr та додаємо властивість isFavorite для співпадаючих _id
  const updatedArr = serverArr.map(obj => {
    const matchingObj = arr2Map[obj._id];
    if (matchingObj) {
      return { ...obj, isFavorite: true };
    }
    return { ...obj, isFavorite: false };
  });

  return updatedArr;
};
