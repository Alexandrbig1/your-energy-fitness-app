const paginationContainer = document.querySelector(".js-pages");

function showPages(currentPage, totalPages) {
    const pages = [];
    const pageRange = 3;

    if(totalPages > 1){
        for (let i = currentPage - pageRange; i <= currentPage + pageRange; i++) {
            if (i > 0 && i <= totalPages) {
                const pageClass = i === currentPage ? "exercise-cards__wrapper-page exercise-cards__current-page" : "exercise-cards__wrapper-page js-pages";
                pages.push(`
                    <div class="${pageClass}">
                        <a class="exercise-cards__page js-page" data-page="${i}" href="">
                            ${i}
                        </a>
                    </div>
                `);
            }
        }
        paginationContainer.innerHTML = '';

        for (const page of pages) {
            paginationContainer.insertAdjacentHTML("beforeend", page);
        }
    }
    }
    
    

function cleanerPages(){
    paginationContainer.innerHTML = "";
}

export {showPages, cleanerPages};