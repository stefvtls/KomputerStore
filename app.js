// import laptops from"./laptops.js";
// const {getJsonDataFromAPI, populateDropdown, displayChoice, data, index} = laptops;
// // import buttonActions from "./buttonActions.js";
// // const { canBuyLaptop, repayLoan, goWork, transferToBank, getLoan} = buttonActions;



// Set up initial balances to 0. Make sure that they are treated as numbers.
let bankBalance = parseInt(0);
let loanBalance = parseInt(0);
let workBalance = parseInt(0);

let data = [];                                                  // get a hold of the data called from the API
let index = 0;                                                  // index of currently selected item from the dropdown list
const URL = "https://hickory-quilled-actress.glitch.me/";       // base URL for API calls


// API CALLS
// Asynchronous IIFE to get data from API
async function getJsonDataFromAPI() {
    try {
        const response = await fetch(`${URL}computers`);                    // asynchronous GET call
        if (!response.ok) {                                                 // if HTTP response status is not in the range 200-299...
            throw new Error (`HTTP ERROR status ${response.status}`);       // ... throw an error...
        }
        data = await response.json();                                       // wait for the json from our GET call
        populateDropdown();                                                 // as soon as our json is ready, populate the dropdown with possible laptops to buy
        displayChoice(index);                                               // on loaded data, display the first computer from our json
    } catch (error) {                                                       // log the error to the console 
        console.log(error);
    }
};
getJsonDataFromAPI();





// DISPLAY DATA FROM API CALLS
// Populate dropdown list with options from the data from API call
function populateDropdown() {
    data.forEach(laptopData => {
        let laptopOption = document.createElement("option");
        laptopOption.value = laptopData.id;
        laptopOption.text = laptopData.title;
        dropdown.appendChild(laptopOption);
    })
}

// On dropdown: change - update currently selected item and display corresponding details
function updateChoice() {
    index = dropdown.selectedIndex;
    displayChoice(index);
    }

// Display features section on card 3, image, title, description, and price on card 4 with selected item from the dropdown
function displayChoice(index) {
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







// BUTTONS AND THEIR EVENT LISTENERS
const loanButton = document.getElementById("get-loan");
const bankButton = document.getElementById("transfer-to-bank");
const workButton = document.getElementById("go-work");
const repayButton = document.getElementById("repay-loan");
const buyButton = document.getElementById('buy');
loanButton.addEventListener("click", getLoan);
bankButton.addEventListener("click", transferToBank);
workButton.addEventListener("click", goWork);
repayButton.addEventListener("click", repayLoan);
buyButton.addEventListener("click", canBuyLaptop);

// DROPDOWN AND THEIR EVENT LISTENERS
const dropdown = document.getElementById("dropdown");
dropdown.addEventListener("change", updateChoice);

// ELEMENTS ON CARDS TO DISPLAY DIFFERENT TEXT/NUMERICAL VALUES
const loanField = document.getElementById("loan-field");
const loanValue = document.getElementById("loan-value");
const balanceValue = document.getElementById("balance-value");
const workValue = document.getElementById("work-value");
const features = document.getElementById("laptop-features");
const img = document.getElementById("pic");
const title = document.getElementById('title');
const description = document.getElementById("description");
const price = document.getElementById("price");
displayValues();            // setting initial display with 0 balance values on welcome screen













// FUNCTIONS TO UPDATE DISPLAYING OF CARDS 
// toggle the visibility of loan field on loan button depending on the existing loan 
function visibility() {
    const visibilityToToggle = [loanField, repayButton];
    loanBalance ? visibilityToToggle.forEach( v => v.style.visibility = "visible") : visibilityToToggle.forEach( v => v.style.visibility = "hidden");
}
// display the amount in the EUR format
function currencyDisplay(number) {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(number);
}
// Update the displayed elements on the card with current balance values;
function displayValues() {
    workValue.innerText = currencyDisplay(workBalance);
    balanceValue.innerText = currencyDisplay(bankBalance);
    loanValue.innerText = currencyDisplay(loanBalance);
    visibility();
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






// FUNCTIONS ADDED TO BUTTONS
// Take a loan
function getLoan() {
    if (!loanBalance) {                                                             // you can take a loan only if you do not have already existing loan
        let amount = window.prompt("how much would you like to loan?", 0);          // ask user how much would he want to loan. on default: 0eur
        if (isNaN(amount)) {                                                        // validate that the input is indeed a number
            window.alert("you must submit a number to get a loan")                  // display message explaining what user did wrong
            getLoan();                                                              // recursive call to give user a chance to correct his input
        } else if (amount) {                                                        // if user did not leave the input empty...
            if (amount <= 2*bankBalance) {                                          // ...and the amount that he request is not bigger than twice his current bank balance
                loanBalance += amount/1;                                            // ...add that value to his bank account...
                bankBalance += amount/1;                                            // ... and open a loan for the same amount.
                displayValues();                                                    // updates values on the cards
            } else {
                window.alert("sorry, you cannot get a loan of value more than double of your current bank account balance");        // ... display a message that user cannot take this high loan
            }
        }
    } else {
        window.alert("sorry, you cannot take a next loan, you still have a loan to pay");                   //... display a message that user cannot take a loan when he already have one to pay back
    }
    
}

// transfer earned money to the bank account
function transferToBank () {
    if (workBalance) {                                              // if there is money that you could transfer...
        if (loanBalance) {                                          // if user has a loan
            loanBalance -= 0.1*workBalance;                         //...then transfer 10% of his work value to pay back the loan
            bankBalance += 0.9*workBalance;                         // .... and 90% of his work value to the bank account
            if (loanBalance < 0) {                                  // but if this 10% is bigger than the open loan...
                bankBalance += Math.abs(loanBalance);               // ...transfer that value to the bank...
                loanBalance = 0;                                    // ...and reset the loan back to zero
            }
        } else {
            bankBalance += workBalance;                             // if there was no loan, transfer all the money to the bank account
        }
        workBalance = 0;                                            // reset the value of work balance
        displayValues();                                            // updates values on the cards
    } else {
        nothingToTransfer();                                        // if there are no funds, display a sad message that the transfer is not possible
    }
   
}

// display a message that operation is not supported if there are no funds
function nothingToTransfer() {
    window.alert("You have no funds to transfer. You have to work a bit harder.")
}

// earning money
function goWork() {
    workBalance += 100;                                     // add money to the working balance
    displayValues();                                        // updates values on the cards
}

// pay back the loan
function repayLoan() {
    if (workBalance) {                                          // if there is money that you could transfer...
        loanBalance -= workBalance;                             // transfer all the earned money to pay the loan...
        if (loanBalance < 0) {                                  // ...if loan was smaller than the transferred money...
            bankBalance += Math.abs(loanBalance);               // ... then the value that was over the loan balance transfer back to the bank balance
            loanBalance = 0;                                    // ...and reset the loan back to zero
        }
        workBalance = 0;                                        // reset work balance to zero
        displayValues();                                        // updates values on the cards
    } else {
        nothingToTransfer();                                    // if there are no funds, display a sad message that the transfer is not possible
    }
    
}


// check if it is possible to buy a selected computer
function canBuyLaptop() {
    let price = data[index].price;                                                                              // get a hold of the price of selected computer
    let declinedMessage = 'You do not have enough money. You need to get up earlier and work harder.';          // message to display if user do not have enough money to buy selected computer
    let outOfStockMessage = 'Sorry, this item is no longer available';                                          // message to display if there is not enough computer in stock
    data[index].stock > 0 ? (bankBalance<price?window.alert(declinedMessage):buyLaptop(price)) : window.alert(outOfStockMessage);       // check if there is enough computers in stock and user has enough money to buy selected computer
    
}
// holds the logic for byng a selected computer
function buyLaptop(price) {
    bankBalance -= price;                                       // subtract money from user's bank account
    displayValues();                                            // updates values on the cards
    window.alert(`Successfully purchased ${data[index].title}. Your order will be shipped to you within next 24hours.`)         // display happy message to the user of successful purchase
}