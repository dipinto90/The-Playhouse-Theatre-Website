const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row.seat:not(.occupied)'); /* querySelectorAll for grabbing all the not occupied seats from html */
const count = document.getElementById('count'); /* will count the number of seats selected */
const total = document.querySelector('total'); /* will count the total price */
const movieSelect = document.getElementById('movie');

let ticketPrice = +movieSelect.value; /* plus symbol converts string into number*/

//update total and count
function  updateSelectedCount(){
    const selectedSeats = document.querySelectorAll('.row.seat.selected')/* this const is going to select all the selected seats */
    

    const selectedSeatsCount = selectedSeats.length; /* what is the number of selected seats that I've been selecting */

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;

   /* this is for the total price of the seats selected */
}

//movie select event
//this is for change the prices of seats depending in the show

movieSelect.addEventListener('change', (e) => { 
    ticketPrice = +e.target.value;
    updateSelectedCount();
})


container.addEventListener('click', (e) => {    

    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')){ /* this is for selecting the seats, and it doesn't contain the occupied seats as well */
    e.target.classList.toggle('selected'); /* it will select the selected class, so we can se the blue color for the seats */

    }

    updateSelectedCount(); 
});

