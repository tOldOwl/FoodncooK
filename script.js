// Keep track of the current sort direction
let ascending = true;

// 1. Core Sorting Function (Triggered by your HTML button)
function toggleSortOrder() {
    const gridRow = document.querySelector('.grid-row');
    if (!gridRow) return;
    
    const recipes = Array.from(gridRow.querySelectorAll('.recipe'));
    const button = document.getElementById('sortBtn');

    recipes.sort((recipeA, recipeB) => {
        const dateStrA = recipeA.getAttribute('data-date') || "";
        const dateStrB = recipeB.getAttribute('data-date') || "";

        if (!dateStrA) return 1;
        if (!dateStrB) return -1;

        const timeA = new Date(dateStrA).getTime() || 0;
        const timeB = new Date(dateStrB).getTime() || 0;

        return ascending ? timeA - timeB : timeB - timeA;
    });

    // Clear and re-append elements safely
    gridRow.innerHTML = '';
    recipes.forEach(recipe => {
        gridRow.appendChild(recipe);
        updateCardTimestampText(recipe);
    });

    // Toggle button direction state and text
    ascending = !ascending;
    if (button) {
        button.textContent = ascending ? "Sort: Oldest First" : "Sort: Newest First";
    }
}

// Helper function to handle text generation so code isn't duplicated
function updateCardTimestampText(recipe) {
    const dateValue = recipe.getAttribute('data-date');
    const timestampElement = recipe.querySelector('.timestamp');
    if (timestampElement) {
        timestampElement.style.cursor = 'pointer'; 
        if (dateValue && dateValue.trim() !== "") {
            timestampElement.textContent = `>LAST MADE: ${dateValue.toUpperCase()}<`;
        } else {
            timestampElement.textContent = ">LAST MADE: NEVER<";
        }
    }
}

// 2. Page Load Initializer
document.addEventListener("DOMContentLoaded", function() {
    const gridRow = document.querySelector('.grid-row');
    if (!gridRow) return;

    const recipes = Array.from(gridRow.querySelectorAll('.recipe'));

    // Load saved dates from LocalStorage using Title as key
    recipes.forEach(recipe => {
        const titleElement = recipe.querySelector('.title');
        if (titleElement) {
            const recipeTitle = titleElement.textContent.trim();
            const savedDate = localStorage.getItem(recipeTitle);
            if (savedDate) {
                recipe.setAttribute('data-date', savedDate);
            }
        }
        updateCardTimestampText(recipe);
    });

    // Initial default sort layout (Earliest Date First)
    recipes.sort((recipeA, recipeB) => {
        const dateStrA = recipeA.getAttribute('data-date') || "";
        const dateStrB = recipeB.getAttribute('data-date') || "";
        if (!dateStrA) return 1;
        if (!dateStrB) return -1;
        const timeA = new Date(dateStrA).getTime() || 0;
        const timeB = new Date(dateStrB).getTime() || 0;
        return timeB - timeA;
    });

    gridRow.innerHTML = '';
    recipes.forEach(recipe => gridRow.appendChild(recipe));
});

// 3. Handles clicking the timestamp string to open the popup edit box
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('timestamp')) {
        const recipeCard = e.target.closest('.recipe');
        if (!recipeCard) return;

        const titleElement = recipeCard.querySelector('.title');
        const currentRawDate = recipeCard.getAttribute('data-date') || "";
        if (!titleElement) return;

        const recipeTitle = titleElement.textContent.trim();
        const newDate = prompt(`Enter a new "Last Made" date for ${recipeTitle}:`, currentRawDate);

        if (newDate !== null) {
            localStorage.setItem(recipeTitle, newDate);
            recipeCard.setAttribute('data-date', newDate);
            
            // Fix: Update the text dynamically right away instead of using location.reload()
            updateCardTimestampText(recipeCard);
            
            // Re-run the active sort so the newly updated date snaps to its correct sorted spot
            ascending = !ascending; 
            toggleSortOrder();
        }
    }
});