// Global variables
const expenseList = document.getElementById("expense-list");
const totalExpenses = document.getElementById("total-expenses");
const checkStatsButton = document.getElementById("check-stats-button");
const expenseChart = document.getElementById("expense-chart");

// Expense data array
let expenses = [];

// Event listener for form submission
document.getElementById("expense-form").addEventListener("submit", function(event) {
  event.preventDefault();
  addExpense();
});

// Function to add an expense
function addExpense() {
  const amountInput = document.getElementById("expense-amount");
  const categoryInput = document.getElementById("expense-category");
  const descriptionInput = document.getElementById("expense-description");

  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const description = descriptionInput.value;

  const expense = {
    amount,
    category,
    description
  };

  expenses.push(expense);
  saveExpenses();
  renderExpenseList();
  calculateTotalExpenses();
  clearFormInputs();
}

// Function to render the expense list
function renderExpenseList() {
  expenseList.innerHTML = "";
  expenses.forEach((expense, index) => {
    const expenseItem = document.createElement("div");
    expenseItem.classList.add("expense-item");
    expenseItem.innerHTML = `
      <div class="expense-details">
        <span class="expense-amount">₹${expense.amount.toFixed(2)}</span>
        <span class="expense-category">${expense.category}</span>
        <span class="expense-description">${expense.description}</span>
      </div>
      <button class="delete-button" onclick="deleteExpense(${index})">Delete</button>
    `;
    expenseList.appendChild(expenseItem);
  });
}

// Function to delete an expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenseList();
  calculateTotalExpenses();
}

// Function to calculate total expenses
function calculateTotalExpenses() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalExpenses.textContent = total.toFixed(2);
}

// Function to clear form inputs
function clearFormInputs() {
  document.getElementById("expense-form").reset();
}

// Event listener for "Check Stats" button
checkStatsButton.addEventListener("click", function() {
  if (expenses.length === 0) {
    clearChart();
  } else {
    renderPieChart();
  }
});

// Function to render the pie chart
function renderPieChart() {
  const categories = expenses.map(expense => expense.category);
  const uniqueCategories = [...new Set(categories)];

  const expenseData = uniqueCategories.map(category => {
    const totalAmount = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return {
      category,
      totalAmount
    };
  });

  const chartLabels = expenseData.map(data => data.category);
  const chartData = expenseData.map(data => data.totalAmount);

  const chartConfig = {
    type: "pie",
    data: {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: generateRandomColors(chartData.length),
      }]
    }
  };

  clearChart();

  new Chart(expenseChart, chartConfig);
}

// Function to clear the chart
function clearChart() {
  const expenseChartInstance = Chart.instances[0];
  if (expenseChartInstance) {
    expenseChartInstance.destroy();
  }
}

// Function to generate random colors
function generateRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(color);
  }
  return colors;
}

// Function to save expenses to localStorage
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Function to load expenses from localStorage
function loadExpenses() {
  const savedExpenses = localStorage.getItem("expenses");
  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
  }
}

// Load expenses when the page loads
loadExpenses();

// Render initial expense list and total expenses
renderExpenseList();
calculateTotalExpenses();
