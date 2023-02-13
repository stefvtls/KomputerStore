// display the amount in the EUR format
function currencyDisplay(number) {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(number);
}


// get a hold of the HTML element holding a computer price
const price = document.getElementById("price");
const title = document.getElementById('title');


// export 
const money = {
    price,
    title,
    currencyDisplay,
}

export default money;