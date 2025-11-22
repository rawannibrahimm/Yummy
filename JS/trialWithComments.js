// Initial States

const sideNavMenu = document.querySelector(".side-nav-menu");
const menuIcon = document.querySelector("#openMenuIcon");
const mealsRaw = document.querySelector("#rowData");
const loader = document.querySelector(".loading-screen");

// Variables
const searchContainer = document.querySelector("#searchContainer");
const searchBtn = document.querySelector("#searchBtn");
const CategoriesBtn = document.querySelector("#CategoriesBtn");
const areaBtn = document.querySelector("#areaBtn");
const ingredientsBtn = document.querySelector("#ingredientsBtn");
const contactBtn = document.querySelector("#contactBtn");

let currentMeals = [];
// On loading the page

window.addEventListener("load", () => {
    getMeals();
});

// Logic

function toggleSideNavMenu() {
    sideNavMenu.classList.toggle("open");
    menuIcon.classList.toggle("fa-align-justify");
    menuIcon.classList.toggle("fa-xmark");
}

// Fetching For The Meals
async function getMeals() {
    // Show loader before the API fetch
    loader.classList.add("active");
    const MIN_TIME = 1500; // keep loader at least 1.5 second
    const start = Date.now();
    try {
        // Using the search by name API only not dragging a name
        let mealsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        let data = await mealsResponse.json();
        // console.log(data);
        let meals = data.meals;
        // To display the first 20 meals only
        let firstTwentyMeals = meals.slice(0, 20);
        // Still won't show the meals right after the fetch finishes
        // Calculate how long the fetch took
        const elapsed = Date.now() - start;
        // Determine how much extra time we need to keep the loader visible
        // so it stays at least MIN_TIME milliseconds.
        // If the fetch took longer than MIN_TIME, wait will be 0 as max will choose 0 over negative value.
        const wait = Math.max(0, MIN_TIME - elapsed);
        setTimeout(() => {
            loader.classList.remove("active");
            setTimeout(() => {
                displayMeals(firstTwentyMeals);
            }, 500); // matches CSS 0.5s fade-out
        }, wait);
    } catch (error) {
        console.log(error);
    }
}

// Displaying the data returned from API

function displayMeals(mealsData) {
    // This variable will help in applying event delegation for Displaying each meal info later on
    // As it keeps a copy of data received so we can desturct and display
    currentMeals = mealsData;

    let mealsBox = "";
    let mealsDatalength = mealsData.length;
    for (let i = 0; i < mealsDatalength; i++) {
        mealsBox += `<div class="col-md-3">
                        <div class="meal position-relative overflow-hidden rounded-2" data-id="${mealsData[i].idMeal}">
                            <div class="img-holder">
                                <img src="${mealsData[i].strMealThumb}" alt="" />
                                <div class="meal-overlayer position-absolute d-flex align-items-center text-dark p-2">
                                    <h3>${mealsData[i].strMeal}</h3>
                                </div>
                            </div>
                        </div>
                    </div>`;
    }
    mealsRaw.innerHTML = mealsBox;
}

// Displaying the search inputs

function displaySearchInputs() {
    toggleSideNavMenu();
    mealsRaw.innerHTML = "";
    let searchInputs = `<div class="row py-4 g-4 offset-1">
                <div class="col-md-6">
                    <input id="searchName" data-index="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name" />
                </div>
                <div class="col-md-6">
                    <input id="searchLetter" data-index="2" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter" />
                </div>
            </div>`;
    searchContainer.innerHTML = searchInputs;
}

function removeSearchInputs() {
    searchContainer.innerHTML = "";
}

// Search Function

async function handleSearch(query, index) {
    mealsRaw.innerHTML = "";
    loader.classList.add("active");

    const MIN_TIME = 1500;
    const start = Date.now();

    let url;

    // index: 1 == search by name
    // index: 2 == search by first letter
    if (index === "1") {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    } else {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`;
    }

    try {
        let searchedMealsResponse = await fetch(url);
        let data = await searchedMealsResponse.json();
        let meals = data.meals ? data.meals.slice(0, 20) : [];

        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_TIME - elapsed);

        setTimeout(() => {
            loader.classList.remove("active");
            setTimeout(() => {
                displayMeals(meals);
            }, 500);
        }, wait);
    } catch (error) {
        console.log(error);
    }
}

// Displaying the data returned from caregories API

function displayCategories(mealsData) {
    let mealsBox = "";
    let mealsDatalength = mealsData.length;
    for (let i = 0; i < mealsDatalength; i++) {
        mealsBox += `<div class="col-md-4">
                        <div class="meal category-card position-relative overflow-hidden rounded-2" data-category="${mealsData[i].strCategory}">
                            <div class="img-holder">
                                <img src="${mealsData[i].strCategoryThumb}" alt="" />
                                <div class="meal-overlayer position-absolute d-flex flex-column text-center align-items-center overflow-hidden text-dark p-2">
                                    <h3>${mealsData[i].strCategory}</h3>
                                    <p>${mealsData[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
    }
    mealsRaw.innerHTML = mealsBox;
}

// Fetching For The Categories

async function getCategories() {
    mealsRaw.innerHTML = "";
    toggleSideNavMenu();
    loader.classList.add("active");
    const MIN_TIME = 1500;
    const start = Date.now();
    try {
        let categoriesResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let data = await categoriesResponse.json();
        console.log(data);
        let Categories = data.categories;

        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_TIME - elapsed);
        setTimeout(() => {
            loader.classList.remove("active");
            setTimeout(() => {
                displayCategories(Categories);
            }, 500);
        }, wait);
    } catch (error) {
        console.log(error);
    }
}

// Fetching/Filtring Meals Based On Category

async function getCategoryMeals(categoryName) {
    mealsRaw.innerHTML = "";
    loader.classList.add("active");
    const MIN_TIME = 1500;
    const start = Date.now();
    try {
        let categoryMealsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
        let data = await categoryMealsResponse.json();
        // console.log(data);
        let meals = data.meals;
        let firstTwentyMeals = meals.slice(0, 20);
        currentMeals = firstTwentyMeals;
        // console.log(currentMeals);
        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_TIME - elapsed);
        setTimeout(() => {
            loader.classList.remove("active");
            setTimeout(() => {
                displayMeals(firstTwentyMeals);
            }, 500);
        }, wait);
    } catch (error) {
        console.log(error);
    }
}

function displayAreas(mealsData) {
    let mealsBox = "";
    let mealsDatalength = mealsData.length;
    for (let i = 0; i < mealsDatalength; i++) {
        mealsBox += `<div class="col-md-3">
                        <div class="meal d-flex flex-column gap-3 align-items-center">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3>${mealsData[i].strArea}</h3>
                        </div>
                    </div>`;
    }
    mealsRaw.innerHTML = mealsBox;
}

// Fetching For the Areas

async function getArea() {
    mealsRaw.innerHTML = "";
    toggleSideNavMenu();
    loader.classList.add("active");
    const MIN_TIME = 1500;
    const start = Date.now();
    try {
        let areaResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        let data = await areaResponse.json();
        // console.log(data);
        let areas = data.meals;

        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_TIME - elapsed);
        setTimeout(() => {
            loader.classList.remove("active");
            setTimeout(() => {
                displayAreas(areas);
            }, 500);
        }, wait);
    } catch (error) {
        console.log(error);
    }
}

function displayIngrdients(mealsData) {
    let mealsBox = "";
    let mealsDatalength = mealsData.length;
    for (let i = 0; i < mealsDatalength; i++) {
        mealsBox += `<div class="col-md-4">
        <div class="meal d-flex flex-column align-items-center gap-3 rounded-2 text-center ">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${mealsData[i].strIngredient}</h3>
            <p>${mealsData[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
    </div>`;
    }
    mealsRaw.innerHTML = mealsBox;
}

// Fetching For the Ingredients

async function getIngredients() {
    mealsRaw.innerHTML = "";
    toggleSideNavMenu();
    loader.classList.add("active");
    const MIN_TIME = 1500;
    const start = Date.now();
    try {
        let ingredientsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        let data = await ingredientsResponse.json();

        // console.log(data);
        let ingredients = data.meals;
        let firstTwentyMeals = ingredients.slice(0, 20);

        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_TIME - elapsed);
        setTimeout(() => {
            loader.classList.remove("active");
            setTimeout(() => {
                displayIngrdients(firstTwentyMeals);
            }, 500);
        }, wait);
    } catch (error) {
        console.log(error);
    }
}

function prepareMealData(meal) {
    // Destruct needed data from the array
    const { strMeal, strArea, strCategory, strMealThumb, strInstructions, strSource, strYoutube } = meal;

    // Destructing ingriedients
    const ingredientsOfMeal = [];

    // object.keys(obj) : Returns An array of strings, each is the key of the oject's keys (each property name of the object).
    Object.keys(meal).forEach((key) => {
        // Checks whether this key begins with "strIngredient"
        // And accesses the value of the key dynamically
        // And .trim() converts both "" and " " to an empty string
        // This avoids pushing empty ingredients
        if (key.startsWith("strIngredient") && meal[key] && meal[key].trim() !== "") {
            // This replaces the string given and returns a new string that will carry the number
            const index = key.replace("strIngredient", "");
            // Getting the measure of the same number
            const measure = meal[`strMeasure${index}`];
            // Push the measure+ingredient into the array
            ingredientsOfMeal.push(`${measure} ${meal[key]}`.trim());
        }
    });
    // console.log(meal);
    mealsRaw.innerHTML = "";
    removeSearchInputs();
    loader.classList.add("active");
    return {
        name: strMeal,
        area: strArea,
        category: strCategory,
        image: strMealThumb,
        instructions: strInstructions,
        source: strSource,
        youtube: strYoutube,
        ingredientsOfMeal,
    };
}

function displayMealDetails({ name, image, area, category, instructions, ingredientsOfMeal, source, youtube }) {
    // mealsRaw.innerHTML = "";
    let mealInformation = `
        <div class="meal-details">
                    <div class="row"> 
                        <div class="col-md-5 text-center">
                            <img class="rounded-3" src="${image}" />
                            <h2 class="text-center mt-2">${name}</h2>
                        </div>

                        <div class="col-md-7">
                            <h3 class="mb-2">Instructions</h3>
                            <p>${instructions}</p>
                            
                            <h3 class="mb-2">Meal's Origin: <p class="d-inline fw-light">${area}</p></h3>
                            <h3 class="mb-2">Meal's Category: <p class="d-inline fw-light">${category}</p></h3>
                            
                            <h3 class="mb-2">Ingredients</h3>
                            <ul class="ingredients-list p-0">
                                ${ingredientsOfMeal.map((i) => `<li class="text-white py-2 px-3 mb-2 rounded-3 fw-medium list-unstyled">${i}</li>`).join("")}
                            </ul>
                            <div class="mt-3">
                                <h3 class="mb-2">Tags: </h3>
                                ${source ? `<a href="${source}" target="_blank" class="btn btn-primary">Source</a>` : ""}
                                ${youtube ? `<a href="${youtube}" target="_blank" class="btn btn-danger">YouTube</a>` : ""}
                            </div>
                        </div>
                    </div>
                        
                </div>
    `;
    mealsRaw.innerHTML = mealInformation;
}

// Events

// When user clicks on the align-justify(menu) icon to open the sidebar
// Using classList.toggle() to switch classes
menuIcon.addEventListener("click", toggleSideNavMenu);

// When user clicks on Search Li
searchBtn.addEventListener("click", displaySearchInputs);

// Using Event Delegation to handle search
// As the inputs are added if the user clicked search
// So trying to keep them into variables won't work and returns null
// So through their parent which we already kept it in a variable we can handle search better
// With the help of custom attribute too
searchContainer.addEventListener("input", (e) => {
    if (!e.target.matches("input[data-index]")) return;

    let index = e.target.dataset.index;
    let value = e.target.value;

    handleSearch(value, index);
});

// When user clicks on categories
CategoriesBtn.addEventListener("click", getCategories);

// When user clicks on Area
areaBtn.addEventListener("click", getArea);

// When user clicks on Igredients
ingredientsBtn.addEventListener("click", getIngredients);

// Using Event Delegation to display each meals information

mealsRaw.addEventListener("click", async (e) => {
    const card = e.target.closest(".meal");
    if (!card) return;

    const mealId = card.dataset.id;

    let mealObj = currentMeals.find((m) => m.idMeal === mealId);
    // console.log(mealObj);
    if (!mealObj) return;

    // If mealObj exists but is MINIMAL (missing full details) like instructions
    const needsFullFetch = !mealObj || !mealObj.strInstructions;

    if (needsFullFetch) {
        const result = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await result.json();
        console.log(data);
        mealObj = data.meals[0];
        console.log(mealObj);
    }

    const prepared = prepareMealData(mealObj);

    setTimeout(() => {
        loader.classList.remove("active");
        setTimeout(() => {
            displayMealDetails(prepared);
        }, 500);
    }, 500);
});

mealsRaw.addEventListener("click", (e) => {
    const cardCategory = e.target.closest(".category-card");
    if (!cardCategory) return;

    const categoryName = cardCategory.dataset.category;
    getCategoryMeals(categoryName);
});
