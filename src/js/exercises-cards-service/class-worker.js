const classes = {
    exerciseWrapper: "js-cards",
    workoutWrapper: "workout-cards__wrapper",
    favoriteWrapper: "favorite-cards__wrapper",
    visuallyHidden: "visually-hidden",
    emptyParag: "exercise-cards__parag-empty",
    emptyWrapper: "exercise-cards__wrapper-empty"

}
const defaultStrings = {
    stringHome: `
                <p class="exercise-cards__parag-empty">
                    Sorry, but we don't have anything for you with such filter. Please try another search
                </p>`,
    stringFavorite: `<p class="exercise-cards__parag-empty">
                        It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises
                        that you
                        like to your favorites for easier access in the future.
                    </p>`,
}

function addInnerOfElement(string, element){
    const tag = document.querySelector("." + element);
    if(tag){
        tag.innerHTML = string;
    } else {
        return;
    }
   
}

function addClass(string, element){
    const tag = document.querySelector("." + element);
    if(tag){
        tag.classList.add(string);
    } else {
        return;
    };
}

function deleteClass(string, element){
    const tag = document.querySelector("." + element);
    if (tag) {
        tag.classList.remove(string);
    } else {
        return;
    }
}

export {classes, defaultStrings,
     addInnerOfElement, addClass, deleteClass};