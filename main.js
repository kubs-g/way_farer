const Signup = document.getElementsByClassName("signup-form");
const signupButton = document.getElementById("submit");

const signup = () => {  
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const address = document.getElementById("address").value;


    const userData = {
        username:username,
        email: email,
        password: password,
        address: address
    }
    localStorage.setItem("userData", JSON.stringify(userData));
  
    if(userData){
        alert("Signup was successful");
        window.location.href = 'Tripe.html';
    }else {
        console.log('err')
    }
}
if(signupButton){
signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    signup();

});
}
const loginForm = document.getElementsByClassName("login-form");
const loginButton = document.getElementById("login");
const login = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = JSON.parse(localStorage.getItem("userData"));
    const storedEmail = userData.email;
    const storedPassword = userData.password;
    if(!storedEmail){
        alert("Please sign up first Email not found");
        return;
    }else if(!storedPassword){
        alert("incorrect password");
        return;
    } else {
        alert("Login was successful");
            window.location.href = 'Tripe.html';
    }
}
if(loginButton){
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    login();
});
}

const bookNowButtons = document.querySelectorAll(".book-now");
bookNowButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const tripCard = button.closest(".trip"); 
        
        const destination = tripCard.querySelector(".destination").textContent;
        const date = tripCard.querySelector(".date").textContent;
        const departureTime = tripCard.querySelector(".time").textContent;
        const price = tripCard.querySelector(".price").textContent;

        
        let existingData = JSON.parse(localStorage.getItem("tripData")) || [];

const newTrip = {
            destination: destination,
            date: date,
            Depature_time: departureTime,
            price: price
        };
existingData.push(newTrip);
 localStorage.setItem("tripData", JSON.stringify(existingData));

        alert("Booking was successful");
        window.location.href = 'Tripe.html';
    });
});
  
 

const bookingsContainer = document.getElementById("bookings-list");
if (bookingsContainer) {
    const tripData = JSON.parse(localStorage.getItem("tripData")) || [];
    if (tripData.length > 0) {
        tripData.forEach((trip) => {
            const bookingCard = document.createElement("div");
            bookingCard.classList.add("booking-card");
            bookingCard.innerHTML = `
                <h3>Booking Details</h3>
                <p><strong>Destination:</strong> ${trip.destination}</p>
                <p><strong>Date:</strong> ${trip.date}</p>
                <p><strong>Departure Time:</strong> ${trip.Depature_time}</p>
                <p><strong>Price:</strong> ${trip.price}</p>
                <button class="cancel-booking">Cancel Booking</button>
            `;
            bookingsContainer.appendChild(bookingCard);
        });
    } else {
        bookingsContainer.innerHTML = "<p>No bookings found.</p>";
    }
}



const cancelbookingBtn = document.querySelectorAll(".cancel-booking");
cancelbookingBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const bookingCard = button.closest(".booking-card");
        
        const bookingDetails = bookingCard.querySelector("p").textContent;
        const tripData = JSON.parse(localStorage.getItem("tripData")) || [];

       
        const updatedTripData = tripData.filter((trip) => {
            return !bookingDetails.includes(trip.destination);
        });

       
        localStorage.setItem("tripData", JSON.stringify(updatedTripData));
      bookingsContainer.removeChild(bookingCard);
    });
});