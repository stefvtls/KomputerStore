import money from"./money.js";
const {currencyDisplay, price, title} = money;



// this script takes care of calling the data from api and updating all the necessary HTML elements with data from the API






let data = [];                                                  // get a hold of the data called from the API
let index = 0;                                                  // index of currently selected item from the dropdown list
const URL = "https://hickory-quilled-actress.glitch.me/";       // base URL for API calls


// HTML ELEMENTS TO BE UPDATED
const features = document.getElementById("laptop-features");
const pic = document.getElementById("pic");
const description = document.getElementById("description");

// DROPDOWN AND THEIR EVENT LISTENERS
const dropdown = document.getElementById("dropdown");
dropdown.addEventListener("change", () => {updateChoice()});


// // API CALLS
// // Asynchronous call to get data from API
async function getJsonDataFromAPI() {
    try {
        const response = await fetch(`${URL}computers`);                    // asynchronous GET call
        if (!response.ok) {                                                 // if HTTP response status is not in the range 200-299...
            throw new Error (`HTTP ERROR status ${response.status}`);       // ... throw an error...
        }
        data = await response.json();                                       // wait for the json from our GET call
        populateDropdown();                                                 // as soon as our json is ready, populate the dropdown with possible laptops to buy
        displayChoice();                                                    // on loaded data, display the first computer from our json
    } catch (error) {                                                       // log the error to the console 
        console.log(error);
    }
};


// DISPLAY DATA FROM API CALLS
// Populate dropdown list with options from the data from API call
function populateDropdown() {
    data.forEach(laptopData => {
        let laptopOption = document.createElement("option");
        laptopOption.value = laptopData.price;
        laptopOption.text = laptopData.title;
        dropdown.appendChild(laptopOption);
    })
}

// On dropdown: change - update currently selected item and display corresponding details
function updateChoice() {
    index = dropdown.selectedIndex;
    displayChoice();
    }

// Display features section on card 3, image, title, description, and price on card 4 with selected item from the dropdown
function displayChoice() {
    features.innerText = null;                                   // features section - reset what is currently in the current section
    let listOfFeatures = data[index].specs;                      // get a hold of the list of all features of the selected product
        listOfFeatures.forEach(e => {                            // for every feature in the features list...
            let li = document.createElement("li");               // ... create HTML <li></li> tag...
            li.innerText = e;                                    // ... set the content of the <li> tag to the feature of the selected computer
            features.appendChild(li);                            // ... add this element to the features section on card 3
        })

    renderImg();                                                // img section
    title.innerText = data[index].title;                        // title section 
    description.innerText = data[index].description;            // description section
    price.innerText = currencyDisplay(data[index].price);       // price section
}

// DISPLAYING IMG
// Display laptop image using the provided endpoint
function renderImg() {
    pic.setAttribute("alt", ` image of ${data[index].title}`);
    pic.setAttribute("src", `${URL}${data[index].image}`);
    pic.onerror=toggleJpgPng;               // if there is an error rendering the image, try different path
}
// if jpg or png was not found at the asset image endpoint, try the same endpoint, but with different img format - maybe there is mistake in the API endpoint?
function toggleJpgPng() {
    let brokenPath = `${URL}${data[index].image}`;                          
    let newPath = brokenPath.slice(-3) == `jpg` ? `${URL}assets/images/${data[index].id}.png`:`${URL}assets/images/${data[index].id}.jpg`;      //try the same endpoint, but with different image format
    pic.setAttribute("src", newPath);                                                                                                           // set the new src for the image
    pic.onerror=null;                                                                               // avoid infinite error loop in console in case no jpg or png was found - if the approach did not work
}





// export
const laptops = {
    getJsonDataFromAPI,
}

export default laptops;