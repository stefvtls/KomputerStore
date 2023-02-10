let bankBalance = 0*1;
let loanBalance = 0*1;
let workBalance = 0*1;
let data = [];
const url = "https://hickory-quilled-actress.glitch.me/";

// FETCH DATA FROM API
(async function getJsonDataFromAPI() {
    fetch(`${url}computers`)
    .then(response => {
        if (!response.ok) {
            throw new Error (` HTTP ERROR status ${response.status}`);
        }
        return response;
    })
    .then(response => response.json())
    .then(laptops => { 
        data=laptops;
        for (i=0;i<laptops.length;i++) {
            let laptopOption = document.createElement("option");
            laptopOption.value = laptops[i].id;
            laptopOption.text = laptops[i].title;
            dropdown.appendChild(laptopOption);
        }
        displayChoice(0);
    })
    .catch(error => console.log(error));
})();


// display elements from API 
function updateChoice() {
    let index = dropdown.selectedIndex;
    displayChoice(index);
    }

function displayChoice(index) {
    // features section
    features.innerText = null;
    let listOfFeatures = data[index].specs;
        listOfFeatures.forEach(e => {
            let li = document.createElement("li");
            li.innerText = e;
            features.appendChild(li);
        })
    // details section
    //img
    pic.setAttribute("src", `${url}/assets/images/${index}.png`);
    pic.setAttribute("alt", ` image of ${data[index].title}`);
    //title
    title.innerText = data[index].title;
    //desc
    description.innerText = data[index].description;
    // price
    price.innerText = currencyDisplay(data[index].price);
}



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
const dropdown = document.getElementById("dropdown");
const features = document.getElementById("laptop-features");

const img = document.getElementById("pic");
const title = document.getElementById('title');
const description = document.getElementById("description");
const price = document.getElementById("price");
dropdown.addEventListener("change", updateChoice);
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
