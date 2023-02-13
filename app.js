import laptops from"./laptops.js";
const {getJsonDataFromAPI } = laptops;
import money from"./money.js";
const {currencyDisplay, title} = money;




// Set up initial balances to 0. Make sure that they are treated as numbers.
let bankBalance = parseFloat(0);
let loanBalance = parseFloat(0);
let workBalance = parseFloat(0);


// call to get the Data
getJsonDataFromAPI();




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


// HTML ELEMENTS ON CARDS TO DISPLAY DIFFERENT NUMERICAL VALUES
const loanField = document.getElementById("loan-field");
const loanValue = document.getElementById("loan-value");
const balanceValue = document.getElementById("balance-value");
const workValue = document.getElementById("work-value");
const dropdown = document.getElementById("dropdown");
displayValues();            // setting initial display with 0 balance values on welcome screen


// FUNCTIONS TO UPDATE DISPLAYING OF CARDS 
// toggle the visibility of loan field on loan button depending on the existing loan 
function visibility() {
    const visibilityToToggle = [loanField, repayButton];
    loanBalance ? visibilityToToggle.forEach( v => v.style.visibility = "visible") : visibilityToToggle.forEach( v => v.style.visibility = "hidden");
}

// Update the displayed elements on the card with current balance values;
function displayValues() {
    workValue.innerText = currencyDisplay(workBalance);
    balanceValue.innerText = currencyDisplay(bankBalance);
    loanValue.innerText = currencyDisplay(loanBalance);
    visibility();
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
    let cost= dropdown.value;                                                                                   // get a hold of the price of currently selected computer                                                                  
    let declinedMessage = 'You do not have enough money. You need to get up earlier and work harder.';          // message to display if user do not have enough money to buy selected computer
    bankBalance<cost ? window.alert(declinedMessage):buyLaptop(cost);                                           // check if there is enough computers in stock and user has enough money to buy selected computer
    
}
// holds the logic for byng a selected computer
function buyLaptop(cost) {
    bankBalance -= cost;                                                                                                      // subtract money from user's bank account
    displayValues();                                                                                                          // updates values on the cards
    window.alert(`Successfully purchased ${title.innerText}. Your order will be shipped to you within next 24hours.`)         // display happy message to the user of successful purchase
}