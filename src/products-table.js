const tableData = [
    {
      category: "Diary Products",
      avgCalories: [263, 259],
      avgCarbohydrates: [19.5, 19.9],
      avgSugar: [13.1, 13.5],
      avgFat: [15.9, 15.6],
      avgSaturatedFat: [9.3, 9],
      avgProtein: [9.5, 9],
      avgFiber: [1, 1],
      avgSodium: [0.2, 0.2],
      avgFruit: [4.6, 6.7],
      avgGrade: [48.6, 48.1],
      avgNutriscore: [0, 0]
    },
    {
      category: "Meat",
      avgCalories: [214, 206],
      avgCarbohydrates: [9.1, 9.3],
      avgSugar: [1.8, 1.9],
      avgFat: [11.2, 11.2],
      avgSaturatedFat: [3.7, 3.6],
      avgProtein: [16, 15.4],
      avgFiber: [1.1, 1.1],
      avgSodium: [0.8, 0.8],
      avgFruit: [3.6, 6],
      avgGrade: [44, 42.7],
      avgNutriscore: [0, 0]
    },
    {
      category: "Cereals, Biscuits and Chocolates",
      avgCalories: [426, 431],
      avgCarbohydrates: [51.2, 52.1],
      avgSugar: [27.9, 28.8],
      avgFat: [20.3, 20.8],
      avgSaturatedFat: [9.7, 9.9],
      avgProtein: [7.9, 7.7],
      avgFiber: [4.5, 4.5],
      avgSodium: [0.2, 0.2],
      avgFruit: [5, 6.5],
      avgGrade: [36, 31.5],
      avgNutriscore: [0, 0]
    },
    {
      category: "Beverages",
      avgCalories: [42.3, 40.8],
      avgCarbohydrates: [8.3, 7.9],
      avgSugar: [6.6, 6.5],
      avgFat: [0.5, 0.6],
      avgSaturatedFat: [0.2, 0.2],
      avgProtein: [0.7, 0.7],
      avgFiber: [0.6, 0.5],
      avgSodium: [0, 0],
      avgFruit: [45, 38.3],
      avgGrade: [62.4, 62.4],
      avgNutriscore: [0, 0]
    },
    {
      category: "Others",
      avgCalories: [246, 254],
      avgCarbohydrates: [28.2, 28.4],
      avgSugar: [12.6, 12.3],
      avgFat: [11, 11.9],
      avgSaturatedFat: [3.4, 3.7],
      avgProtein: [6.4, 6.7],
      avgFiber: [2.8, 2.8],
      avgSodium: [0.4, 0.4],
      avgFruit: [21.8, 23.9],
      avgGrade: [58, 54.7],
      avgNutriscore: [0, 0]
    },
    {
      category: "All",
      avgCalories: [255, 258],
      avgCarbohydrates: [28.6, 28.4],
      avgSugar: [13.1, 12.9],
      avgFat: [11.7, 12.3],
      avgSaturatedFat: [4, 4.21],
      avgProtein: [6.8, 7],
      avgFiber: [2.8, 2.7],
      avgSodium: [0.5, 0.4],
      avgFruit: [19.6, 22],
      avgGrade: [55.7, 46.7],
      avgNutriscore: [0, 0]
    }
  ];
  
 // Get the table container element from your HTML
const tableContainer = document.getElementById("products-table");

// Create a table element
const table = document.createElement("table");
table.classList.add("product-table");

// Create a table header row
const headerRow = document.createElement("tr");

// Create header cells and add them to the header row
const headers = ["categories", "Avg calories", "", "Avg carbohydrates", "", "Avg sugar", "", "Avg fat", "", "Avg Saturated fat", "", "Avg protein", "", "Avg fiber", "", "Avg sodium", "", "Avg fruit", "", "Avg grade", "", "Avg Nutriscore", ""];
headers.forEach(headerText => {
  const headerCell = document.createElement("th");
  headerCell.textContent = headerText;
  headerRow.appendChild(headerCell);
});
table.appendChild(headerRow);

// Create a second row for the year
const yearRow = document.createElement("tr");
const yearHeaders = ["year", "2018", "2021", "2018", "2021", "2018", "2021", "2018", "2021", "2018", "2021", "2018", "2021", "2018", "2021", "2018", "2021", "2018", "2021", "2018", "2021", "2018", "2021"];
yearHeaders.forEach(headerText => {
  const yearCell = document.createElement("th");
  yearCell.textContent = headerText;
  yearRow.appendChild(yearCell);
});
table.appendChild(yearRow);

// Loop through the tableData and create a row for each item
tableData.forEach(item => {
  const row = document.createElement("tr");
  // Loop through each property of the item and create a cell for each
  for (const prop in item) {
    if (prop === "category") {
      const cell = document.createElement("td");
      cell.textContent = item[prop];
      row.appendChild(cell);
    } else {
      item[prop].forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });
    }
  }
  table.appendChild(row);
});

// Add the table to the table container in your HTML
tableContainer.appendChild(table);

