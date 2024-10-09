if (document.getElementById('mapid')) {
    console.log('Carte détectée, initialisation...');

    // Initialiser la carte
    var map = L.map('mapid').setView([28.2096, 83.9856], 10);
    console.log('Carte initialisée avec les coordonnées de l\'Annapurna.');

    // Charger les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    console.log('Tuiles OpenStreetMap chargées.');

    // Tableau statique des fichiers GPX
    var gpxFiles = [
        'static/gpx/annapurna_jour1.gpx',
        'static/gpx/annapurna_jour2.gpx',
        'static/gpx/annapurna_jour3.gpx',
        'static/gpx/annapurna_jour4.gpx',
        'static/gpx/annapurna_jour5.gpx',
        'static/gpx/annapurna_jour6.gpx',
        'static/gpx/annapurna_jour7.gpx',
        'static/gpx/annapurna_jour8.gpx',
        'static/gpx/annapurna_jour9.gpx',
        'static/gpx/annapurna_jour10.gpx',
        'static/gpx/annapurna_jour11.gpx',
        'static/gpx/annapurna_jour12.gpx',
        'static/gpx/annapurna_jour13.gpx',
        'static/gpx/annapurna_jour14.gpx',
        'static/gpx/annapurna_jour15.gpx',
        'static/gpx/annapurna_jour16.gpx',
        'static/gpx/annapurna_jour17.gpx',
        'static/gpx/annapurna_jour18.gpx'
    ];

    // Boucle sur chaque fichier GPX pour les ajouter à la carte
    gpxFiles.forEach(function(gpxFile) {
        var gpxFilePath = gpxFile; // Les fichiers doivent être dans le même répertoire

        console.log('Tentative de chargement du fichier GPX : ' + gpxFilePath);

        new L.GPX(gpxFilePath, {
            async: true
        }).on('loaded', function(e) {
            console.log('Fichier GPX ' + gpxFile + ' chargé avec succès.');
            map.fitBounds(e.target.getBounds());
        }).on('error', function(e) {
            console.error('Erreur lors du chargement du fichier GPX : ', e);
        }).addTo(map);
    });
}
