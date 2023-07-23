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
const selectDate = document.getElementById('datepicker');
selectDate.addEventListener('change', function handleChange(event) {
    var dateSelect = event.target.value;
    alert("Date: " + dateSelect);
});
const selectAdults = document.getElementById('adults');
selectAdults.addEventListener('change', function handleChange(event) {
    var adultSelect = event.target.value;
    alert("Passengers: " + passengerSelect);
});
const selectChildren = document.getElementById('children');
selectChildren.addEventListener('change', function handleChange(event) {
    var childrenSelect = event.target.value;
    alert("Passengers: " + childrenSelect);
});
const selectType = document.getElementById('flight-type');
selectType.addEventListener('change', function handleChange(event) {
    var typeSelect = event.target.value;
    alert("Passengers: " + typeSelect);
});
const selectCurrency = document.getElementById('currency');
selectCurrency.addEventListener('change', function handleChange(event) {
    var currencySelect = event.target.value;
    alert("Passengers: " + currencySelect);
});
const selectReturnDate = document.getElementsByClassName('return-date')[0];
selectReturnDate.addEventListener('change', function handleChange(event) {
    var returnDateSelect = event.target.value;
    alert("Date: " + returnDateSelect);
});