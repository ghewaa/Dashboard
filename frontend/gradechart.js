document.addEventListener('DOMContentLoaded', function () {
    var ctx = document.getElementById('gradingChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Nutritional Quality (60%)', 'Additives (30%)', 'Organic Aspect (10%)'],
            datasets: [{
                label: 'Grade Components',
                data: [60, 30, 10],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            cutoutPercentage: 70, // Adjust this value to control the size of the hole in the doughnut chart
            responsive: true,
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Grade Components',
                fontSize: 18
            }
        }
    });
});

