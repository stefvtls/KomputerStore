let bankBalance = 0*1;
let loanBalance = 0*1;
let workBalance = 0*1;
// BUTTONS
const loanButton = document.getElementById("get-loan");
const bankButton = document.getElementById("transfer-to-bank");
const workButton = document.getElementById("go-work");
const repayButton = document.getElementById("repay-loan");
loanButton.addEventListener("click", getLoan);
bankButton.addEventListener("click", transferToBank);
workButton.addEventListener("click", goWork);
repayButton.addEventListener("click", repayLoan);


// INITIAL DISPLAY
const loanField = document.getElementById("loan-field");
const loanValue = document.getElementById("loan-value");
const balanceValue = document.getElementById("balance-value");
const workValue = document.getElementById("work-value");
displayValues();





// FUNCTIONS
function visibility() {
    if (loanBalance) {
        loanField.style.visibility = "visible";
        repayButton.style.visibility = "visible";
    } else {
        loanField.style.visibility = "hidden";
        repayButton.style.visibility = "hidden";
    }
}

function currencyDisplay(number) {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(number);
}

function displayValues() {
    workValue.innerText = currencyDisplay(workBalance);
    balanceValue.innerText = currencyDisplay(bankBalance);
    loanValue.innerText = currencyDisplay(loanBalance);
    visibility();
}





function getLoan() {
    if (!loanBalance) {
        let amount = window.prompt("how much would you like to loan?", 0);
        console.log(amount);
        if (isNaN(amount)) {
            window.alert("you must submit a number to get a loan")
            getLoan();
        } else if (amount) {
            if (amount <= 2*bankBalance) {
                loanBalance += amount/1;
                bankBalance += amount/1;
                displayValues();
            } else {
                window.alert("sorry, you cannot get a loan of value more than double of your current bank account balance");
            }
        }
    } else {
        window.alert("sorry, you cannot take a next loan, you still have a loan to pay");
    }
    
}


function transferToBank () {
    if (loanBalance) {
        loanBalance -= 0.1*workBalance;
        bankBalance += 0.9*workBalance;
        if (loanBalance < 0) {
            bankBalance += Math.abs(loanBalance);
            loanBalance = 0;
        }
    } else {
        bankBalance += workBalance;

    }
    workBalance = 0;
    displayValues();
}

function goWork() {
    workBalance += 100;
    workValue.innerText = currencyDisplay(workBalance);
}

function repayLoan() {
    loanBalance -= workBalance;
    if (loanBalance < 0) {
        bankBalance += Math.abs(loanBalance);
        loanBalance = 0;
    }
    workBalance = 0;
    displayValues();
}
