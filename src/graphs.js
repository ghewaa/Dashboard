var graphs = [];
var chart; // Store the single chart instance
var productsGraphContainer = document.getElementById('products-graph-container');

window.onload = function() {
    addGraph();
};

function addGraph() {
    addGraphParameters();
}

function addGraphParameters() {
    const index = graphs.length;
    const graphContainer = document.createElement('div');
    graphContainer.classList.add('product-graph');
    graphContainer.innerHTML = `
    <h2>${index + 1} curve</h2>
    <div class="parameters">
        <label for="categories${index}">Categories:</label>
        <select id="categories${index}"></select>
        <label for="year${index}">Year:</label>
        <select id="year${index}"></select>
        <label for="presence${index}">Presence:</label>
        <select id="presence${index}"></select>
        <label for="outcome${index}">Outcome:</label>
        <select id="outcome${index}"></select>
        <label for="scans${index}">Scans:</label>
        <select id="scans${index}"></select>
        <label for="weight${index}">Weight:</label>
        <select id="weight${index}"></select>
    </div>
    `;
    productsGraphContainer.appendChild(graphContainer);
    graphs.push(graphContainer);

    // Populate parameters from the server
    fetchParameters(index);
}
https://user-az0-863873-0.user.lab.sspcloud.fr/proxy/42161
function fetchParameters(index) {
    const url = 'https://user-az0-863873-0.user.lab.sspcloud.fr/proxy/5000/parameters';
    console.log(`Fetching parameters from: ${url}`); // Add logging
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Received parameters:', data); // Add logging
        populateSelectOptions(`categories${index}`, data.categories);
        populateSelectOptions(`year${index}`, data.years);
        populateSelectOptions(`presence${index}`, data.presences);
        populateSelectOptions(`outcome${index}`, data.outcomes);
        populateSelectOptions(`scans${index}`, data.scans);
        populateSelectOptions(`weight${index}`, data.weights);
    })
    .catch(error => console.error('Error fetching parameters:', error));
}


function populateSelectOptions(selectId, options) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = options.map(option => `<option value="${option.value}">${option.label}</option>`).join('');
}

async function renderAllCurves() {
    resetChart(); // Reset the chart before rendering new curves

    let datasets = [];
    for (let index = 0; index < graphs.length; index++) {
        const selectedCategory = document.getElementById('categories' + index).value;
        const selectedYear = document.getElementById('year' + index).value;
        const selectedPresence = document.getElementById('presence' + index).value;
        const selectedOutcome = document.getElementById('outcome' + index).value;
        const selectedScans = document.getElementById('scans' + index).value;
        const selectedWeight = document.getElementById('weight' + index).value;

        try {
            const dataset = await fetchGraph(selectedCategory, selectedYear, selectedPresence, selectedOutcome, selectedScans, selectedWeight, index);
            datasets.push(dataset);
        } catch (error) {
            console.error('Error fetching graph:', error);
        }
    }

    renderGraph(datasets);
}

function fetchGraph(category, year, presence, outcome, scans, weight, index) {
    return fetch('https://user-az0-863873-0.user.lab.sspcloud.fr/proxy/5000/generate-graph', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category: category,
            year: year,
            presence: presence,
            outcome: outcome,
            scans: scans,
            weight: weight
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.csv_content) {
            return parseCSV(data.csv_content, index);
        } else {
            throw new Error('Error: CSV content not returned');
        }
    })
    .catch(error => console.error('Fetch error:', error));
}

function parseCSV(csvText, index) {
    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                const parsedData = results.data.map(row => ({
                    Grade: parseFloat(row.Grade),
                    Density: parseFloat(row.Density)
                }));
                resolve({
                    label: `Curve ${index + 1}`,
                    data: parsedData.map(item => ({ x: item.Grade, y: item.Density })),
                    borderColor: getRandomColor(),
                    borderWidth: 1,
                    fill: false
                });
            },
            error: function(error) {
                reject(error);
            }
        });
    });
}

function renderGraph(datasets) {
    const canvas = document.createElement('canvas');
    productsGraphContainer.appendChild(canvas); // Append to the main container
    const ctx = canvas.getContext('2d');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Grade'
                    },
                    type: 'linear',
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 10
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Density'
                    }
                }
            }
        }
    });
}

function resetChart() {
    if (chart) {
        chart.destroy(); // Destroy the existing chart instance
        chart = null; // Reset the chart variable
    }
    const canvasElements = productsGraphContainer.getElementsByTagName('canvas');
    while (canvasElements.length > 0) {
        productsGraphContainer.removeChild(canvasElements[0]); // Remove existing canvas elements
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
