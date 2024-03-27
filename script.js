const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipeContainer');
const closeBtn = document.querySelector('.closeBtn');
const recipeContents = document.querySelector('.recipeContents');

//Function to fetch recipes
const fetchRecipes = async (query)=> {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>"
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
    
        recipeContainer.innerHTML = "";
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src = "${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p> <span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `
            const button = document.createElement("button");
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // Adding eventListener to button
            button.addEventListener('click', ()=> {
                recipePopup(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = "<h2>No recipe found for the meal🚫</h2>"
    }
}

// Function to fetch ingredients & measurements
const fetchIngredients = (meal) =>{
    let ingredientList = "";
    for (let i=1; i<=20; i++) {
        const ingredient = meal[`strIngredient${i}`];

        if(ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`
        }
        else {
            break;
        }
    }
    return ingredientList;
}

const recipePopup = (meal) => {
    recipeContents.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>

        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `

    recipeContents.parentElement.style.display = "block";
}

closeBtn.addEventListener('click', ()=> {
    recipeContents.parentElement.style.display = "none";
})

searchBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
   
    if(!searchInput) {
        recipeContainer.innerHTML = "<h2>Please enter the meal in the search box😊</h2>";
        return;
    }

    fetchRecipes(searchInput);
})