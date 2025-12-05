// Function to display only the required section
function showSection(sectionId) {
  // Hide all sections
  document.getElementById("splash-screen").classList.add("d-none");
  document.getElementById("challenge-setup").classList.add("d-none");
  document.getElementById("challenge-details").classList.add("d-none");
  document.getElementById("daily-task-tracker").classList.add("d-none");

  // Show the specified section
  document.getElementById(sectionId).classList.remove("d-none");
}

// Function to show the Challenge Details page
function showChallengeDetails() {
  showSection("challenge-details"); // Ensure only Challenge Details is visible

  // Retrieve saved challenge data from localStorage
  const challengeDays = localStorage.getItem("challengeDays");
  const challengeReason = localStorage.getItem("challengeReason");
  const startDate = new Date(localStorage.getItem("startDate"));

  // Calculate remaining days
  const currentDate = new Date();
  const daysLeft = challengeDays - Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));

  // Update Challenge Details UI
  document.getElementById("challenge-duration").textContent = challengeDays;
  document.getElementById("challenge-reason-display").textContent = challengeReason;
  document.getElementById("days-left").textContent = daysLeft > 0 ? daysLeft : 0;
}

// Handle the user flow after the splash screen ends
setTimeout(function () {
  // Hide the splash screen
  document.getElementById("splash-screen").classList.add("d-none");

  // Check if a challenge is already saved in localStorage
  if (localStorage.getItem("challengeDays")) {
    // If a challenge exists, show the Challenge Details page
    showChallengeDetails();
  } else {
    // Otherwise, show the Challenge Setup page
    showSection("challenge-setup");
  }
}, 3000);

// Handle Challenge Form submission
document.getElementById("challenge-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission behavior

  // Get input values from the form
  const challengeDays = document.getElementById("challenge-days").value;
  const challengeReason = document.getElementById("challenge-reason").value;

  // Validate form inputs
  if (challengeDays && challengeReason) {
    // Save the challenge data to localStorage
    localStorage.setItem("challengeDays", challengeDays);
    localStorage.setItem("challengeReason", challengeReason);
    localStorage.setItem("startDate", new Date().toISOString()); // Save the start date

    // Redirect to the Challenge Details page
    showChallengeDetails();
  } else {
    alert("Please fill in all fields."); // Alert the user to complete the form
  }
});

// Show the Daily Task Tracker after Challenge Details
document.getElementById("challenge-details").addEventListener("click", function () {
  showSection("daily-task-tracker"); // Switch to Daily Task Tracker
});

// Handle the Daily Task submission
document.getElementById("task-form").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission behavior

  // Collect daily task feedback data
  const taskCompleted = document.getElementById("task").checked;
  const challengesFaced = document.getElementById("challenges-faced").value;
  const overcomeMethod = document.getElementById("overcome-method").value;

  // Save daily task data to localStorage
  const taskData = {
    taskCompleted,
    challengesFaced,
    overcomeMethod,
    date: new Date().toISOString(),
  };

  // Track the current day number
  const currentDay = parseInt(localStorage.getItem("currentDay") || 1);

  // Store data for the current day
  localStorage.setItem(`day${currentDay}`, JSON.stringify(taskData));

  // Increment day counter for the next day's tasks
  localStorage.setItem("currentDay", currentDay + 1);

  // Display a success message and reset the form
  alert("Feedback submitted! Keep going!");

  // Reset the daily task form
  document.getElementById("task").checked = false;
  document.getElementById("challenges-faced").value = "";
  document.getElementById("overcome-method").value = "";
   // Move to the Dashboard after submitting feedback
   showDashboard();
});
// Function to show the Dashboard section
function showDashboard() {
  // Hide all containers
  document.querySelectorAll(".container").forEach(container => {
    container.classList.add("d-none"); // Hide each container
  });
  // Show the Dashboard section
  document.getElementById("dashboard").classList.remove("d-none");

  // Load and display progress data
  loadDashboardData();
}
function loadDashboardData() {
  // Load challenge details from localStorage
  const totalDays = parseInt(localStorage.getItem("challengeDays") || 0);
  const currentDay = parseInt(localStorage.getItem("currentDay") || 1);
  const completedDays = currentDay - 1;
  const remainingDays = totalDays - completedDays;

  // Calculate longest streak
  let longestStreak = 0, currentStreak = 0;
  for (let i = 1; i <= completedDays; i++) {
    const dayData = JSON.parse(localStorage.getItem(`day${i}`));
    if (dayData && dayData.taskCompleted) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0; // Break streak if a day is missed
    }
  }

  // Display data in the dashboard
  document.getElementById("completed-days").innerText = completedDays;
  document.getElementById("remaining-days").innerText = remainingDays;
  document.getElementById("longest-streak").innerText = longestStreak;

  // Load and display daily reflections
  const reflectionList = document.getElementById("daily-reflection-list");
  reflectionList.innerHTML = ""; // Clear previous data
  for (let i = 1; i <= completedDays; i++) {
    const dayData = JSON.parse(localStorage.getItem(`day${i}`));
    if (dayData) {
      const reflectionItem = document.createElement("li");
      reflectionItem.className = "list-group-item";
      reflectionItem.innerHTML = `
        <strong>Day ${i}:</strong> 
        ${dayData.taskCompleted ? "✅ Completed" : "❌ Not Completed"}<br>
        <strong>Challenges:</strong> ${dayData.challengesFaced || "None"}<br>
        <strong>Overcome:</strong> ${dayData.overcomeMethod || "N/A"}
      `;
      reflectionList.appendChild(reflectionItem);
    }
  }
}
let initialReason = "";
let endingReason = "";

// On Challenge Start
document.getElementById('challenge-form').addEventListener('submit', function(event) {
  event.preventDefault();
  initialReason = document.getElementById('challenge-reason').value;
  document.getElementById('challenge-reason-display').textContent = initialReason;
  document.getElementById('challenge-setup').classList.add('d-none');
  document.getElementById('challenge-details').classList.remove('d-none');
});

// End Challenge Button
document.getElementById('end-challenge').addEventListener('click', function() {
  // Set the initial reason in the modal
  document.getElementById('initial-reason-display').textContent = initialReason;
  const endChallengeModal = new bootstrap.Modal(document.getElementById('endChallengeModal'));
  endChallengeModal.show();
});

// Handle Ending Reason and Confirmation
document.getElementById('confirm-end').addEventListener('click', function() {
  endingReason = document.getElementById('ending-reason').value;
  document.getElementById('ending-reason-display').textContent = endingReason;
  
  if (initialReason === endingReason) {
    alert("You can't quit the challenge with the same reason you started. Please reconsider!");
  } else {
    alert("You have ended your challenge.");
    // Handle the logic for ending the challenge (reset, log, etc.)
    // Reset the form and variables
    document.getElementById('challenge-reason').value = "";
    document.getElementById('challenge-reason-display').textContent = "";
    document.getElementById('challenge-days').value = "";
    // Hide the current challenge details and show the setup page
    document.getElementById('challenge-details').classList.add('d-none');
    document.getElementById('challenge-setup').classList.remove('d-none');
    
    // Reset any other relevant variables (like streaks, completed days, etc.)
    resetChallengeData();
  }
});
function resetChallengeData() {
  // Clear relevant localStorage items
  localStorage.removeItem("challengeDays");
  localStorage.removeItem("challengeReason");
  localStorage.removeItem("startDate");
  localStorage.removeItem("currentDay");

  // Clear day-specific data
  for (let i = 1; i <= 100; i++) { // Assuming a max of 100 days
    localStorage.removeItem(`day${i}`);
  }

  // Hide all sections
  document.getElementById("challenge-setup").classList.add("d-none");
  document.getElementById("challenge-details").classList.add("d-none");
  document.getElementById("daily-task-tracker").classList.add("d-none");
  document.getElementById("dashboard").classList.add("d-none");
  document.getElementById("endChallengeModal").classList.add("d-none");
  // Show the setup page
  showSection("challenge-setup");
}

// Handle Cancel and Continue
document.getElementById('continue-challenge').addEventListener('click', function() {
  // Close the modal and keep the challenge active
  const endChallengeModal = bootstrap.Modal.getInstance(document.getElementById('endChallengeModal'));
  endChallengeModal.hide();
});

// Restart the challenge
document.getElementById("restart-challenge").addEventListener("click", function () {
  if (confirm("Are you sure you want to restart the challenge? All progress will be reset.")) {
    localStorage.clear(); // Clear all saved data
    alert("Challenge reset! Start fresh!");
    location.reload(); // Reload the page
  }
});