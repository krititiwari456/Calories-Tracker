const entryForm = document.getElementById('entryForm');
const foodInput = document.getElementById('food');
const caloriesInput = document.getElementById('calories');
const entriesList = document.getElementById('entriesList');
const totalCaloriesEl = document.getElementById('totalCalories');
const progressFill = document.getElementById('progressFill');
const entryDateInput = document.getElementById('entryDate');
const goalDisplay = document.getElementById('goalDisplay');

let entries = JSON.parse(localStorage.getItem('calorieEntries')) || [];
let goal = localStorage.getItem('calorieGoal') || '';
document.getElementById('goal').value = goal;
goalDisplay.textContent = goal || '--';

// Set today's date by default
entryDateInput.valueAsDate = new Date();

function setGoal() {
  goal = document.getElementById('goal').value;
  localStorage.setItem('calorieGoal', goal);
  goalDisplay.textContent = goal || '--';
  updateUI();
}

function updateUI() {
  const selectedDate = entryDateInput.value;
  entriesList.innerHTML = '';
  let total = 0;

  entries.filter(entry => entry.date === selectedDate).forEach((entry, index) => {
    total += entry.calories;

    const li = document.createElement('li');
    li.innerHTML = `
      ${entry.food} - ${entry.calories} kcal
      <button class="delete-btn" onclick="deleteEntry(${index})">X</button>
    `;
    entriesList.appendChild(li);
  });

  totalCaloriesEl.innerText = total;
  updateProgressBar(total);
  localStorage.setItem('calorieEntries', JSON.stringify(entries));
}

function updateProgressBar(total) {
  if (!goal) {
    progressFill.style.width = '0%';
    return;
  }
  let percentage = Math.min((total / goal) * 100, 100);
  progressFill.style.width = `${percentage}%`;
}

function deleteEntry(index) {
  entries.splice(index, 1);
  updateUI();
}

entryForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const food = foodInput.value.trim();
  const calories = parseInt(caloriesInput.value);
  const date = entryDateInput.value;

  if (food && calories && date) {
    entries.push({ food, calories, date });
    updateUI();
    foodInput.value = '';
    caloriesInput.value = '';
  }
});

entryDateInput.addEventListener('change', updateUI);

updateUI();
