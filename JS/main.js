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

// Main Helper Function that uses the same logic for all fetches of API

async function fetchWithLoader(url, extractFn, displayFn, slice = true) {
    loader.classList.add("active");
    const MIN_TIME = 1500;
    const start = Date.now();

    try {
        let response = await fetch(url);
        let data = await response.json();

        let result = extractFn(data);

        if (slice && Array.isArray(result)) {
            result = result.slice(0, 20);
        }

        const elapsed = Date.now() - start;
        const wait = Math.max(0, MIN_TIME - elapsed);

        setTimeout(() => {
            loader.classList.remove("active");
            setTimeout(() => displayFn(result), 500);
        }, wait);
    } catch (error) {
        console.log(error);
    }
}

// Fetching For The Meals
async function getMeals() {
    fetchWithLoader("https://www.themealdb.com/api/json/v1/1/search.php?s=", (data) => data.meals, displayMeals);
}

// Displaying the data returned from API

function displayMeals(mealsData) {
    currentMeals = mealsData;
    let mealsBox = "";
    let mealsDatalength = mealsData.length;
    for (let i = 0; i < mealsDatalength; i++) {
        mealsBox += `<div class="col-md-3">
                        <div class="meal position-relative overflow-hidden rounded-2" data-id="${mealsData[i].idMeal}">
                            <div class="img-holder">
                                <img src="${mealsData[i].strMealThumb}" alt="${mealsData[i].strMeal}" />
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

// Removing the search inputs

function removeSearchInputs() {
    searchContainer.innerHTML = "";
}

// Search Function

async function handleSearch(query, index) {
    mealsRaw.innerHTML = "";
    const url = index === "1" ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}` : `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`;
    fetchWithLoader(url, (data) => data.meals || [], displayMeals);
}

// Fetching For The Categories

async function getCategories() {
    removeSearchInputs();
    mealsRaw.innerHTML = "";
    toggleSideNavMenu();
    fetchWithLoader("https://www.themealdb.com/api/json/v1/1/categories.php", (data) => data.categories, displayCategories, false);
}

// Displaying the data returned from caregories API

function displayCategories(mealsData) {
    let mealsBox = "";
    let mealsDatalength = mealsData.length;
    for (let i = 0; i < mealsDatalength; i++) {
        mealsBox += `<div class="col-md-4">
                        <div class="meal category-card position-relative overflow-hidden rounded-2" data-category="${mealsData[i].strCategory}">
                            <div class="img-holder">
                                <img src="${mealsData[i].strCategoryThumb}" alt="${mealsData[i].strCategory}" />
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

// Fetching/Filtring Meals Based On Category

async function getCategoryMeals(categoryName) {
    mealsRaw.innerHTML = "";
    fetchWithLoader(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`,
        (data) => data.meals,
        (result) => {
            currentMeals = result;
            displayMeals(result);
        }
    );
}

// Fetching For the Areas

async function getArea() {
    removeSearchInputs();
    mealsRaw.innerHTML = "";
    toggleSideNavMenu();
    fetchWithLoader("https://www.themealdb.com/api/json/v1/1/list.php?a=list", (data) => data.meals, displayAreas);
}

// Displaying The Areas

function displayAreas(mealsData) {
    let mealsBox = "";
    let mealsDatalength = mealsData.length;
    for (let i = 0; i < mealsDatalength; i++) {
        mealsBox += `<div class="col-md-3">
                        <div class="meal area-card d-flex flex-column gap-3 align-items-center" data-area="${mealsData[i].strArea}">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3>${mealsData[i].strArea}</h3>
                        </div>
                    </div>`;
    }
    mealsRaw.innerHTML = mealsBox;
}

// Fetching/Filtring Meals Based On Area

async function getAreaMeals(areaName) {
    mealsRaw.innerHTML = "";
    fetchWithLoader(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`,
        (data) => data.meals,
        (result) => {
            currentMeals = result;
            displayMeals(result);
        }
    );
}

// Fetching For the Ingredients

async function getIngredients() {
    removeSearchInputs();
    mealsRaw.innerHTML = "";
    toggleSideNavMenu();
    removeSearchInputs();
    fetchWithLoader("https://www.themealdb.com/api/json/v1/1/list.php?i=list", (data) => data.meals, displayIngrdients);
}

// Displaying The Ingredients

function displayIngrdients(mealsData) {
    let mealsBox = "";
    let mealsDatalength = mealsData.length;
    for (let i = 0; i < mealsDatalength; i++) {
        mealsBox += `<div class="col-md-4">
        <div class="meal ingredient-card d-flex flex-column align-items-center gap-3 rounded-2 text-center " data-ingredient="${mealsData[i].strIngredient}">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${mealsData[i].strIngredient}</h3>
            <p>${mealsData[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
    </div>`;
    }
    mealsRaw.innerHTML = mealsBox;
}

// Fetching/Filtring Meals Based On Ingredient

async function getIngredientMeals(ingredientName) {
    mealsRaw.innerHTML = "";
    fetchWithLoader(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`,
        (data) => data.meals,
        (result) => {
            currentMeals = result;
            displayMeals(result);
        }
    );
}

// Prepare The Meal's Information

function prepareMealData(meal) {
    const { strMeal, strArea, strCategory, strMealThumb, strInstructions, strTags, strSource, strYoutube } = meal;

    const ingredientsOfMeal = [];

    Object.keys(meal).forEach((key) => {
        if (key.startsWith("strIngredient") && meal[key] && meal[key].trim() !== "") {
            const index = key.replace("strIngredient", "");
            const measure = meal[`strMeasure${index}`];
            ingredientsOfMeal.push(`${measure} ${meal[key]}`.trim());
        }
    });

    let tags = meal.strTags?.split(",");
    if (!tags) tags = [];

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
        tags,
        source: strSource,
        youtube: strYoutube,
        ingredientsOfMeal,
    };
}

function displayMealDetails({ name, image, area, category, instructions, ingredientsOfMeal, tags, source, youtube }) {
    mealsRaw.innerHTML = "";
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
                                <ul class="tags-list p-0">
                                ${tags.map((i) => `<li class="text-white py-2 px-3 mb-2 rounded-3 fw-medium list-unstyled">${i}</li>`).join("")}
                            </ul>
                            </div>
                            <div class="mt-3">
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

menuIcon.addEventListener("click", toggleSideNavMenu);

searchBtn.addEventListener("click", displaySearchInputs);

searchContainer.addEventListener("input", (e) => {
    if (!e.target.matches("input[data-index]")) return;

    let index = e.target.dataset.index;
    let value = e.target.value;

    handleSearch(value, index);
});

CategoriesBtn.addEventListener("click", getCategories);

areaBtn.addEventListener("click", getArea);

ingredientsBtn.addEventListener("click", getIngredients);

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
        // console.log(data);
        mealObj = data.meals[0];
        // console.log(mealObj);
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

mealsRaw.addEventListener("click", (e) => {
    const cardArea = e.target.closest(".area-card");
    if (!cardArea) return;

    const areaName = cardArea.dataset.area;
    getAreaMeals(areaName);
});

mealsRaw.addEventListener("click", (e) => {
    const cardIngredient = e.target.closest(".ingredient-card");
    if (!cardIngredient) return;

    const ingredientName = cardIngredient.dataset.ingredient;
    getIngredientMeals(ingredientName);
});

// The Validation Logic

function displayContactForm() {
    removeSearchInputs();
    mealsRaw.innerHTML = "";
    toggleSideNavMenu();

    let contactUsForm = `<form class="pt-3" id="ContactForm">
            <div class="row">
                <div class="col-md-6 px-4">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control py-4 border-bottom border-2 border-primary rounded-2" name="userName" id="userName" placeholder="Enter Your Name" />
                        <p id="nameMsg" class="alert alert-danger d-none">Special characters and numbers not allowed.</p>
                    </div>
                </div>
                <div class="col-md-6 px-4">
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control py-4 border-bottom border-2 border-primary rounded-2" name="userEmail" id="userEmail" placeholder="Enter Your Email" />
                        <p id="emailMsg" class="alert alert-danger d-none">Email not valid *exemple@yyy.zzz</p>
                    </div>
                </div>
                <div class="col-md-6 px-4">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control py-4 border-bottom border-2 border-primary rounded-2" name="cellPhone" id="cellPhone" placeholder="Enter Your Phone Number" />
                        <p id="phoneMsg" class="alert alert-danger d-none">Enter valid Phone Number</p>
                    </div>
                </div>
                <div class="col-md-6 px-4">
                    <div class="form-floating mb-3">
                        <input type="number" class="form-control py-4 border-bottom border-2 border-primary rounded-2" name="userAge" id="userAge" placeholder="Enter Your Age" />
                        <p id="ageMsg" class="alert alert-danger d-none">Enter valid age</p>
                    </div>
                </div>
                <div class="col-md-6 px-4">
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control py-4 border-bottom border-2 border-primary rounded-2" name="userPassword" id="userPassword" placeholder="Password" />
                        <p id="passwordMsg" class="alert alert-danger d-none">Password must be at least 8 characters and include uppercase, lowercase, number, and special character.</p>
                    </div>
                </div>
                <div class="col-md-6 px-4">
                    <div class="form-floating mb-3 ">
                        <input type="password" class="form-control py-4 border-bottom border-2 border-primary rounded-2" name="userRePassword" id="userAge" placeholder=" Confirm Password" />
                        <p id="repasswordMsg" class="alert alert-danger d-none">Enter valid repassword</p>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-3">
                <button id="saveBtn" type="button" class="btn btn-danger px-5" disabled>Submit</button>
            </div>
        </form>`;

    mealsRaw.innerHTML = contactUsForm;

    initializeContactForm();
}

function initializeContactForm() {
    const regex = {
        name: /^[A-Za-z ]{3,20}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        age: /^([1-9]|[1-9][0-9]|100)$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };

    const inputs = {
        userName: document.querySelector("#userName"),
        userEmail: document.querySelector("#userEmail"),
        userPhone: document.querySelector("#cellPhone"),
        userAge: document.querySelector("#userAge"),
        userPassword: document.querySelector("#userPassword"),
        userRePassword: document.querySelector('input[name="userRePassword"]'),
    };

    const messages = {
        userName: document.getElementById("nameMsg"),
        userEmail: document.getElementById("emailMsg"),
        userPhone: document.getElementById("phoneMsg"),
        userAge: document.getElementById("ageMsg"),
        userPassword: document.getElementById("passwordMsg"),
        userRePassword: document.getElementById("repasswordMsg"),
    };

    const saveBtn = document.getElementById("saveBtn");

    function validateInput(id) {
        const input = inputs[id];
        const msg = messages[id];

        if (id === "userRePassword") {
            if (input.value === inputs.userPassword.value && input.value !== "") {
                return setValid(input, msg, true);
            }
            return setInvalid(input, msg, false);
        }

        const field = id.replace("user", "").toLowerCase();
        const ok = regex[field]?.test(input.value);

        return ok ? setValid(input, msg, true) : setInvalid(input, msg, false);
    }

    function setValid(input, msg, state) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        msg.classList.add("d-none");
        return state;
    }

    function setInvalid(input, msg, state) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        msg.classList.remove("d-none");
        return state;
    }

    function checkFormValidity() {
        const allValid = Object.keys(inputs).every((id) => validateInput(id));
        saveBtn.disabled = !allValid;
    }

    Object.keys(inputs).forEach((id) => {
        inputs[id].addEventListener("input", () => {
            validateInput(id);
            checkFormValidity();
        });
    });

    saveBtn.addEventListener("click", () => {
        const userData = {
            name: inputs.userName.value,
            email: inputs.userEmail.value,
            phone: inputs.userPhone.value,
            age: inputs.userAge.value,
            password: inputs.userPassword.value,
        };

        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));

        Object.values(inputs).forEach((input) => {
            input.classList.remove("is-valid", "is-invalid");
            input.value = "";
        });
    });
}

contactBtn.addEventListener("click", displayContactForm);
