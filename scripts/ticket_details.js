const selectName = document.getElementById('full-name');
selectName.addEventListener('change', function handleChange(event) {
    var namselect = event.target.value;
    // alert("Name: " + namselect);
});
const phonenumber = document.getElementById('number');
phonenumber.addEventListener('change', function handleChange(event) {
    var numberselect = event.target.value;
    // alert("Number: " + numberselect);
});
const emailSelect = document.getElementById('email');
emailSelect.addEventListener('change', function handleChange(event) {
    var selectEmail = event.target.value;
    // alert("Email: " + selectEmail);
});