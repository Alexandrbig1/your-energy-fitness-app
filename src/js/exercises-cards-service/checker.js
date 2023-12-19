function checkCard(evt){
    evt.preventDefault();
    const {target} = evt;
    if (target.classList.contains("js-cards")){
        return;
    }
    const cardElement = target.closest('.js-card');
    if(cardElement){
        return cardElement.dataset.cardName
    } else{
        return;
    }
}

function checkPage(evt){
    evt.preventDefault();
    const {target} = evt;
    if (!target.classList.contains("js-page")){
        return;
    }
    const cardElement = target.closest('.js-page');
    return cardElement.dataset.page;
}

function checkWorkoutCard(evt){
    evt.preventDefault();
    const { target } = evt;

    if (target.classList.contains("js-cards")){
        return;
    }
    const cardElement = target.closest('.js-workout-card');
    if (cardElement){
        return cardElement.dataset.id;
    } else{
        return;
    }
}

export {checkCard, checkPage, checkWorkoutCard};