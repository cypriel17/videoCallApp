// Load and display connected users when the page loads
window.addEventListener("load", loadAndDisplayUsers);

function loadAndDisplayUsers() {
    // Check if the user is connected
    const connectedUser = localStorage.getItem('connectedUser');
    if (!connectedUser) {
        window.location = 'login.html';
        return;
    }

    const userListElement = document.getElementById("userList");
    userListElement.innerHTML = "Loading..."; // Show loading message initially

    // Fetch the list of users from the backend API
    fetch('http://localhost:8080/api/v1/users')
        .then(response => response.json())
        .then(data => {
            console.log("User list:", data);
            displayUsers(data, userListElement);
        })
        .catch(error => {
            console.error("Error fetching user list:", error);
            userListElement.innerHTML = "Failed to load users.";
        });
}

function displayUsers(userList, userListElement) {
    // Clear the user list before populating
    userListElement.innerHTML = "";

    // Loop through the userList and create list items for each user
    userList.forEach(user => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div>
                <i class="fa fa-user-circle"></i>
                ${user.username} <span class="user-email">(${user.email})</span>
            </div>
            <i class="fa fa-lightbulb-o ${user.status === "online" ? "online" : "offline"}"></i>
        `;
        userListElement.appendChild(listItem);
    });
}

// Handle logout when the "Logout" button is clicked
function handleLogout() {
    fetch('http://localhost:8080/api/v1/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: localStorage.getItem('connectedUser')
    })
        .then(response => response.json())
        .then(data => {
            localStorage.removeItem('connectedUser'); // Remove user data from local storage
            window.location.href = "login.html"; // Redirect to login page
        })
        .catch(error => console.error("Logout failed:", error));
}

// Attach the handleLogout function to the "Logout" button
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", handleLogout);

// Handle creating a new meeting when the "Create a New Meeting" button is clicked
function handleNewMeeting() {
    const connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    const url = `videocall.html?username=${connectedUser.username}`;
    window.open(url, "_blank");
}

// Attach the handleNewMeeting function to the "Create a New Meeting" button
const newMeetingBtn = document.getElementById("newMeetingBtn");
newMeetingBtn.addEventListener("click", handleNewMeeting);

// Handle joining an existing meeting when the "Join" button is clicked
function handleJoinMeeting() {
    const roomId = document.getElementById("meetingName").value;
    if (roomId.trim() === "") {
        alert("Please enter a valid meeting ID.");
        return;
    }

    const connectedUser = JSON.parse(localStorage.getItem('connectedUser'));
    const url = `videocall.html?roomID=${roomId}&username=${connectedUser.username}`;
    window.open(url, "_blank");
}

// Display the date and time dynamically
function updateTimeDate() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    document.getElementById('timeDate').textContent = now.toLocaleString('en-US', options);
}
setInterval(updateTimeDate, 1000); // Update every second

// Attach the handleJoinMeeting function to the "Join" button
const joinMeetingBtn = document.getElementById("joinMeetingBtn");
joinMeetingBtn.addEventListener("click", handleJoinMeeting);
