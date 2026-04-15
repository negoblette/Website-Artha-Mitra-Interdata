// script.js

function generateWorkout() {
    const workouts = [
      "Full Body Strength - 3 sets of squats, pushups, and deadlifts",
      "HIT Cardio - 20 minutes interval sprints and jumping jacks",
      "Upper Body - Pull ups, shoulder press, bicep curls",
      "Core Focus - Plank 60s, Russian twists, Leg Raises",
      "Leg Day - Lunges, Bulgarian Split Squats, Calf Raises"
    ];
    const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];
    document.getElementById("workout-output").innerText = randomWorkout;
  }
  
  function generateMealPlan() {
    const meals = [
      "High Protein: Grilled chicken, quinoa, steamed broccoli",
      "Low Carb: Salmon, mixed greens, olive oil",
      "Balanced: Brown rice, tofu, mixed vegetables",
      "Muscle Gain: Beef steak, sweet potatoes, spinach",
      "Fat Loss: Egg whites, oats, avocado"
    ];
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    document.getElementById("meal-output").innerText = randomMeal;
  }
  
  function loginUser(event) {
    event.preventDefault();
    alert("Login successful (demo only)");
  }
  
  function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-section');
    tabs.forEach(tab => tab.classList.add('hidden'));
    const activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.classList.remove('hidden');
  }