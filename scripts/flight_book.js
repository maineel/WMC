const selectFrom = document.getElementById('from');
selectFrom.addEventListener('change', function handleChange(event) {
    var fromPlace = event.target.value;
    alert("From: " + fromPlace);
});
const selectTo = document.getElementById('to');
selectTo.addEventListener('change', function handleChange(event) {
    var toPlace = event.target.value;
    alert("To: " + toPlace);
});
const selectAirline = document.getElementById('airline');
selectAirline.addEventListener('change', function handleChange(event) {
    var airlineSelect = event.target.value;
    alert("Airline: " + airlineSelect);
});
const selectClass = document.getElementById('class');
selectClass.addEventListener('change', function handleChange(event) {
    var classSelect = event.target.value;
    alert("Class: " + classSelect);
});
const selectAdults = document.getElementById('adults');
selectAdults.addEventListener('change', function handleChange(event) {
    var adultSelect = event.target.value;
    alert("Adults: " + adultSelect);
});
const selectChildren = document.getElementById('children');
selectChildren.addEventListener('change', function handleChange(event) {
    var childrenSelect = event.target.value;
    alert("Children: " + childrenSelect);
});
const selectInfants = document.getElementById('infants');
selectInfants.addEventListener('change', function handleChange(event) {
    var infantsSelect = event.target.value;
    alert("Infants: " + infantsSelect);
});
const selectType = document.getElementById('flight-type');
selectType.addEventListener('change', function handleChange(event) {
    var typeSelect = event.target.value;
    alert("Flight-type: " + typeSelect);
});
const selectCurrency = document.getElementById('currency');
selectCurrency.addEventListener('change', function handleChange(event) {
    var currencySelect = event.target.value;
    alert("Currency: " + currencySelect);
});

document.getElementsByClassName("datepicker")[0].addEventListener("change", function() {
    var input = this.value;
    var dateEntered = new Date(input);
    alert("Departure date: " + input); //e.g. 201g. Fri Nov 13 2015 00:00:00 GMT+0000 (GMT Standard Time)
});
document.getElementsByClassName("datepicker")[1].addEventListener("change", function() {
    var input = this.value;
    var dateEntered = new Date(input);
    alert("Return date:" + input); //e.g. 201g. Fri Nov 13 2015 00:00:00 GMT+0000 (GMT Standard Time)
});