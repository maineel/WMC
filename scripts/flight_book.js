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
// const selectDate = document.getElementById('datepicker');
// selectDate.addEventListener('change', function handleChange(event) {
//     var dateSelect = event.target.value;
//     alert("Date: " + dateSelect);
// });
const selectPassengers = document.getElementById('passengers');
selectPassengers.addEventListener('change', function handleChange(event) {
    var passengerSelect = event.target.value;
    alert("Passengers: " + passengerSelect);
});