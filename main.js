const Signup = document.getElementsByClassName("signup-form");
const signupButton = document.getElementById("submit");

const signup = () => {

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const address = document.getElementById("address").value;

    const userData = {
        username: username,
        email: email,
        password: password,
        address: address
    }
  
fetch("http://wayfarer-production.up.railway.app/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
})
.then((response) => {
    if (response.ok) {
        alert("Signup was successful");
        window.location.href = 'Tripe.html';
    } else {
        alert("Signup failed.User with this email exist.");
    }
})
.catch((error) => {
    console.error("Error:", error);
});
}
if (signupButton) {
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

    const userData = {
        email: email,
        password: password
    }
fetch("http://wayfarer-production.up.railway.app/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
})
.then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        return response.json().then((data) => {
            console.error("Error response:", data);
            alert(`Login failed: ${data.error || "Please try again."}`);
        });
    }
})
.then((data) => {
    if (data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username); 
        localStorage.setItem("userId", data.userId);
  alert("Login was successful");
        window.location.href = 'Tripe.html';
    } else {
        alert("Login failed. Please check your email and password and try again.");
    }
})
.catch((error) => {
    console.error("Error:", error);
});
}
if (loginButton) {
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        login();
    });
}


const createTripButton = document.getElementById("createbtn");
const createTripeForm = document.getElementById("create-trip");

const createTripe = () => {
    const destination = document.getElementById("destination").value.trim();
    const date = document.getElementById("departure-time").value.trim();
    const price = document.getElementById("price").value.trim();

    if (!destination || !date || !price) {
        alert("All fields are required.");
        return;
    }

    const tripData = {
        destination: destination,
        date: date,
        price: price
    };

    const token = localStorage.getItem("token")?.trim();

    fetch("https://wayfarer-production.up.railway.app/trip", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tripData)
    })
    .then((response) => {
        if (response.ok) {
            alert("Trip created successfully");
            window.location.href = 'Tripe.html';
        } else {
            response.json().then((data) => {
                console.error("Error response:", data);
                alert(`Trip creation failed: ${data.message || "Access denied. Admins only."}`);
            });
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
};

if (createTripButton) {
    createTripButton.addEventListener("click", (e) => {
        e.preventDefault();
        createTripe();
    });
}

const deleteTripButton = document.getElementById("cancelbtn");
const deleteTripForm = document.getElementById("delete-trip");

const deleteTrip = () => {
    const tripId = document.getElementById("trip-id").value.trim();

    if (!tripId) {
        alert("Trip ID is required.");
        return;
    }

    const token = localStorage.getItem("token")?.trim();

    fetch(`https://wayfarer-production.up.railway.app/tripe/${tripId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        if (response.ok) {
            alert("Trip deleted successfully");
            window.location.href = 'Tripe.html';
        } else {
            response.json().then((data) => {
                console.error("Error response:", data);
                alert(`Trip deletion failed: ${data.message || "Please try again."}`);
            });
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

if (deleteTripButton) {
    deleteTripButton.addEventListener("click", (e) => {
        e.preventDefault();
        deleteTrip();
    });
}

//fetching trips and displaying them
const tripecontainer = document.querySelector(".trips");

fetch("https://wayfarer-production.up.railway.app/tripe", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
.then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch trips");
    }
})
.then((data) => {
    data.forEach((tripe) => {
        const Trip = document.createElement("div");
        Trip.className = "trip";
        Trip.setAttribute("data-trip-id", tripe.id);
        Trip.setAttribute("data-destination", tripe.destination);


        
        const isFullyBooked = tripe.availableSeats && tripe.availableSeats.length >= 6;

        Trip.innerHTML = `
            <h3>${tripe.destination}</h3>
            <p>Date: ${tripe.date}</p>
            <p>Price: ${tripe.price}</p>
            <p>${isFullyBooked ? "Fully Booked" : `Available Seats: ${6 - tripe.availableSeats.length}`}</p>
             <button id="bookbtn" ${isFullyBooked ? "disabled" : ""}>
                ${isFullyBooked ? "Fully Booked" : "Book Trip"}
            </button>
        `;
        tripecontainer.appendChild(Trip);
    });
})
.catch((error) => {
    console.error("Error:", error);
});

//booking a trip
const bookTrip = (tripId) => {
    const seatNumber = prompt("Enter seat number to book:");
    if (!seatNumber) {
        alert("Seat number is required.");
        return;
    }

    const token = localStorage.getItem("token")?.trim();
    const username = localStorage.getItem("username")?.trim();

    if (!token || !username) {
        alert("You must be logged in to book a trip.");
        return;
    }

    const destination = document
        .querySelector(`.trip[data-trip-id="${tripId}"]`)
        .getAttribute("data-destination");

    const bookingData = {
        username,
        destination,
        seatNumber,
        tripId
    };

    console.log("Sending booking data:", bookingData); 

    fetch("https://wayfarer-production.up.railway.app/bookings", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
    })
    .then((response) => {
        if (response.ok) {
            alert("Booking created successfully");
            window.location.reload();
        } else {
            response.json().then((data) => {
                console.error("Error response:", data);
                alert(`Booking failed: ${data.message || "Please try again."}`);
            });
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to create booking.");
    });
};

document.addEventListener("click", (event) => {
    if (event.target.id === "bookbtn") {
        const tripElement = event.target.closest(".trip");
        const tripId = tripElement.getAttribute("data-trip-id");
        bookTrip(tripId);
    }
});

//fetching bookings

const bookings = document.getElementById("bookings-list");

const getBookings = () => {
    const token = localStorage.getItem("token")?.trim();
    const username = localStorage.getItem("username")?.trim();
    if (!token) {
        alert("You need to be logged in to view bookings.");
        return;
    }
    fetch("https://wayfarer-production.up.railway.app/bookings", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to fetch bookings");
        }
    })
    .then((data) => {
        data.forEach((booking) => {
            const bookingElement = document.createElement("div");
            bookingElement.className = "booking";
            bookingElement.innerHTML = `
                <p>UserName: ${booking.username}</p>
                <p>Trip Destination: ${booking.destination}</p>
                <p>Seat Number: ${booking.seatNumber}</p>
                <h3>Booking ID: ${booking.id}</h3> 
                <p>Status:${booking.paid ?'<span style="color:green;">&#10004;Paid</span>':'<span style="color:red;">&#10004; Not yet Paid </span>'}</p>
                <button id="cancel-booking-btn">Cancel Booking</button>
                
            `;
            bookings.appendChild(bookingElement);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
    });

}

if (bookings) {
    getBookings();
}

//cancel-bookings
document.addEventListener("click", (event) => {
    if (event.target.id === "cancel-booking-btn") {
        const bookingElement = event.target.closest(".booking");
        const bookingId = bookingElement.querySelector("h3").textContent.split(": ")[1];

        const token = localStorage.getItem("token")?.trim();

        fetch(`https://wayfarer-production.up.railway.app/${bookingId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (response.ok) {
               alert("Booking canceled successfully");
                window.location.reload();
            } else {
                response.json().then((data) => {
                    console.error("Error response:", data);
                    alert(`Cancellation failed: ${data.message || "Please try again."}`);
                }); 
                
        
            } 
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
});

