// public/js/asset.js
let dataTable;
let assetChart;

// Initialize DataTable and load data
$(document).ready(function() {
    dataTable = $('#assetTable').DataTable({
        ajax: {
            url: 'http://localhost:3000/api/assets',
            dataSrc: ''
        },
        columns: [
            { data: 'id' },
            { data: 'nome_asset' },
            { data: 'seriale' },
            { data: 'modello' },
            { data: 'categoria' },
            { data: 'status' },
            { data: 'data_acquisto' },
            { data: 'costo_acquisto' },
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-sm btn-primary" onclick="editAsset(${row.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAsset(${row.id})">Delete</button>
                    `;
                }
            }
        ]
    });

    initializeChart();
    
    // Form submission handler
    $('#assetForm').submit(function(e) {
        e.preventDefault();
        saveAsset();
    });
});

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('assetChart').getContext('2d');
    assetChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Disponibile', 'Assegnato', 'In Manutenzione', 'Disattivato'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: [
                    '#28a745',
                    '#007bff',
                    '#ffc107',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    updateChart();
}

// Update Chart Data
function updateChart() {
    fetch('http://localhost:3000/api/assets')
        .then(response => response.json())
        .then(data => {
            const statusCounts = {
                disponibile: 0,
                assegnato: 0,
                'in manutenzione': 0,
                disattivato: 0
            };

            data.forEach(asset => {
                statusCounts[asset.status]++;
            });

            assetChart.data.datasets[0].data = Object.values(statusCounts);
            assetChart.update();
        });
}

// Save Asset (Create or Update)
function saveAsset() {
    const assetId = $('#assetId').val();
    const asset = {
        nome_asset: $('#nome_asset').val(),
        seriale: $('#seriale').val(),
        modello: $('#modello').val(),
        categoria: $('#categoria').val(),
        status: $('#status').val(),
        data_acquisto: $('#data_acquisto').val(),
        costo_acquisto: $('#costo_acquisto').val(),
        valore_attuale: $('#valore_attuale').val()
    };

    const url = assetId ? 
        `http://localhost:3000/api/assets/${assetId}` :
        'http://localhost:3000/api/assets';
    
    const method = assetId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(asset)
    })
    .then(response => response.json())
    .then(() => {
        dataTable.ajax.reload();
        updateChart();
        resetForm();
    })
    .catch(error => console.error('Error:', error));
}

// Edit Asset
function editAsset(id) {
    fetch(`http://localhost:3000/api/assets/${id}`)
        .then(response => response.json())
        .then(asset => {
            $('#assetId').val(asset.id);
            $('#nome_asset').val(asset.nome_asset);
            $('#seriale').val(asset.seriale);
            $('#modello').val(asset.modello);
            $('#categoria').val(asset.categoria);
            $('#status').val(asset.status);
            $('#data_acquisto').val(asset.data_acquisto);
            $('#costo_acquisto').val(asset.costo_acquisto);
            $('#valore_attuale').val(asset.valore_attuale);
        });
}

// Delete Asset
function deleteAsset(id) {
    if (confirm('Are you sure you want to delete this asset?')) {
        fetch(`http://localhost:3000/api/assets/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            dataTable.ajax.reload();
            updateChart();
        })
        .catch(error => console.error('Error:', error));
    }
}

// Reset Form
function resetForm() {
    $('#assetId').val('');
    $('#assetForm')[0].reset();
}