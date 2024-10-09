// Map on the homepage
var map = L.map('mapid').setView([28.3949, 84.1240], 7); // Centre du Népal

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tour des Annapurnas - Besisahar à Bahundanda (Jour 1)
if (document.getElementById('mapid1')) {
    var map1 = L.map('mapid1').setView([28.2096, 83.9856], 10); // Coordonnées de l'Annapurna
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map1);

    // Ajout du fichier GPX jour 1
    new L.GPX("static/gpx/activity_14588387021.gpx", {
        async: true
    }).on('loaded', function(e) {
        map1.fitBounds(e.target.getBounds());
    }).addTo(map1);
}

// Trek 1 - Annapurna (Jour 2)
if (document.getElementById('mapid2')) {
    var map2 = L.map('mapid2').setView([28.2096, 83.9856], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map2);

    // Ajout du fichier GPX jour 2
    new L.GPX("static/gpx/trek1_day2.gpx", {
        async: true
    }).on('loaded', function(e) {
        map2.fitBounds(e.target.getBounds());
    }).addTo(map2);
}
