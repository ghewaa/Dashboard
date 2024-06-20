document.addEventListener('DOMContentLoaded', function() {
    // Data for the table
    const userData = [
        ["Countries","2018", "2019", "2020", "2021", "Total"],
        ["Belgium", 6782, 472312, 266265, 161094, 908251],
        ["France", 4056603, 4317699, 2648943, 1903044, 13380982],
        ["Germany", 2755, 6614, 4528, 156829, 171039],
        ["Spain", 5867, 1929709, 1334085, 736421, 4006715],
        ["Switzerland", 7590, 186193, 130461, 143788, 469110],
        ["United States", 3224, 7724, 36591, 249763, 297800],
        ["Total", 4082821, 6920221, 4420873, 3350939, 19233897]
    ];

    // Function to generate the table
    function generateTable(data) {
        const tableDiv = document.getElementById("users-table");
        const table = document.createElement("table");
        table.classList.add("user-table");

        // Loop through each row of data
        data.forEach(function(rowData, rowIndex) {
            const row = document.createElement("tr");

            // Loop through each cell of the row
            rowData.forEach(function(cellData, cellIndex) {
                const cell = document.createElement("td");
                // Check if the cell data is a number
                if (typeof cellData === 'number') {
                    // Convert number to string with commas
                    cell.textContent = cellData.toLocaleString();
                } else {
                    cell.textContent = cellData;
                }

                // If it's not the first row (header row), add click event listener
                if (rowIndex !== 0 && cellIndex !== 0) {
                    cell.classList.add('clickable');
                    cell.addEventListener('click', function() {
                        // Function to display graph based on clicked country
                        displayGraph(rowData[0]); // Pass the country name to the function
                    });
                }

                row.appendChild(cell);
            });

            table.appendChild(row);
        });

        tableDiv.appendChild(table);
    }

    // Call the function to generate the table with the provided data
    generateTable(userData);


    // Function to display graph based on clicked country
    function displayGraph(country) {
        // Assuming you have an element with id 'nb-users' for displaying the graph
        const graphElement = document.getElementById('nb-users');

        // Clear previous graph content
        graphElement.innerHTML = '';

        // Create an image element for the graph
        const graphImage = document.createElement('img');

        // Set the source of the image based on the selected country
        const imagePath = `img/users/${country.toLowerCase()}_users.png`; // Assuming images are named as 'countryname-graph.jpg'
        graphImage.src = imagePath;
        graphImage.alt = `Graph for ${country}`;

        // Append the graph image to the graph element
        graphElement.appendChild(graphImage);
    }
});