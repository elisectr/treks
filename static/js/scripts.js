// Map on the homepage
// var map = L.map('mapid').setView([28.3949, 84.1240], 7); // Centre du Népal

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '© OpenStreetMap contributors'
// }).addTo(map);

// Tour des Annapurnas - Besisahar à Bahundanda (Jour 1)
if (document.getElementById('mapid')) {
    console.log('Carte détectée, initialisation...');

    // Initialiser la carte
    var map1 = L.map('mapid').setView([28.2096, 83.9856], 10); // Coordonnées de l'Annapurna
    console.log('Carte initialisée avec les coordonnées de l\'Annapurna.');

    // Charger les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map1);
    console.log('Tuiles OpenStreetMap chargées.');

    // Charger le fichier GPX
    var gpxFilePath = "static/gpx/annapurna_jour1.gpx";
    console.log('Tentative de chargement du fichier GPX : ' + gpxFilePath);

    new L.GPX(gpxFilePath, {
        async: true
    }).on('loaded', function(e) {
        console.log('Fichier GPX chargé avec succès.');
        map1.fitBounds(e.target.getBounds());
    }).on('error', function(e) {
        console.error('Erreur lors du chargement du fichier GPX : ', e);
    }).addTo(map1);
}
