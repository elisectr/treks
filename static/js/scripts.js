if (document.getElementById('mapid')) {
    console.log('Carte détectée, initialisation...');

    // Initialiser la carte
    var map = L.map('mapid').setView([28.2096, 83.9856], 10);
    map.on('click', onMapClick);
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

        // console.log('Tentative de chargement du fichier GPX : ' + gpxFilePath);

        new L.GPX(gpxFilePath, {
            async: false,
            marker_options: {
                startIcon: false,  // Masquer l'icône de début
                endIcon: false,     // Masquer l'icône de fin
                shadowUrl: '',
                displayPopup: false,
            }
        }).on('loaded', function(e) {
            console.log('Fichier GPX ' + gpxFile + ' chargé avec succès.');
            map.fitBounds(e.target.getBounds());
        }).on('error', function(e) {
            console.error('Erreur lors du chargement du fichier GPX : ', e);
        }).addTo(map);
    });
}


var marker = null; // Variable pour stocker le marqueur actuel

async function onMapClick(e) {
    // Obtenir les coordonnées du clic
    const { lat, lng } = getClickCoordinates(e);
    
    // Trouver le point GPX le plus proche
    const gpxCoordinates = await Promise.all(gpxFiles.map(file => extractCoordinatesFromGPX(file)));
    const closestGPX = findClosestGPX(lat, lng, gpxCoordinates);

    // Préparer le contenu du pop-up
    let popupContent = "<b>Aucun point GPX trouvé!</b>";
    if (closestGPX.closestFileIndex !== -1) {
        popupContent = `<b>Proche d'un point GPX!</b><br /> 
                        Fichier GPX: ${closestGPX.closestFileIndex + 1}<br /> 
                        Distance: ${closestGPX.closestDistance.toFixed(2)} m.`;
    }

    // Si un marqueur existe déjà, le supprimer
    if (marker) {
        map.removeLayer(marker);
    }

    // Créer un nouveau marqueur à l'emplacement du clic
    marker = new L.Marker(e.latlng, { draggable: true });
    map.addLayer(marker);
    marker.bindPopup(popupContent).openPopup();
}


function getClickCoordinates(e) {
    return {
        lat: e.latlng.lat,
        lng: e.latlng.lng
    };
}

function findClosestGPX(lat, lng, gpxCoordinates) {
    let closestDistance = Infinity;
    let closestPoint = null;
    let closestFileIndex = -1;

    // Afficher les coordonnées de l'utilisateur
    console.log(`Coordonnées de clic: Latitude: ${lat}, Longitude: ${lng}`);

    // Parcourir les coordonnées extraites des fichiers GPX
    gpxCoordinates.forEach((coordinates, index) => {
        coordinates.forEach(point => {
            const distance = L.latLng(lat, lng).distanceTo(L.latLng(point.latitude, point.longitude));

            // Afficher les détails du point et la distance calculée
            console.log(`Point GPX trouvé - Fichier GPX: ${index + 1}, 
                         Latitude: ${point.latitude}, 
                         Longitude: ${point.longitude}, 
                         Distance au clic: ${distance.toFixed(2)} m`);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestPoint = L.latLng(point.latitude, point.longitude);
                closestFileIndex = index; // Garder une trace de l'index du fichier GPX

                // Afficher la nouvelle plus proche distance
                console.log(`Nouveau point le plus proche trouvé - 
                             Fichier GPX: ${closestFileIndex + 1}, 
                             Distance: ${closestDistance.toFixed(2)} m`);
            }
        });
    });

    return {
        closestPoint: closestPoint,
        closestFileIndex: closestFileIndex,
        closestDistance: closestDistance
    };
}



async function extractCoordinatesFromGPX(gpxFilePath) {
    const response = await fetch(gpxFilePath); // Charger le fichier GPX
    const text = await response.text(); // Obtenir le contenu du fichier en tant que texte

    const parser = new DOMParser(); // Créer un nouvel analyseur DOM
    const xmlDoc = parser.parseFromString(text, "application/xml"); // Analyser le texte en XML

    const coordinates = []; // Liste pour stocker les coordonnées

    // Extraire les points de suivi (trackpoints)
    const trackpoints = xmlDoc.getElementsByTagName("trkpt");
    
    // Parcourir chaque point de suivi et récupérer la latitude et la longitude
    for (let i = 0; i < trackpoints.length; i++) {
        const lat = parseFloat(trackpoints[i].getAttribute("lat")); // Récupérer la latitude
        const lon = parseFloat(trackpoints[i].getAttribute("lon")); // Récupérer la longitude
        
        // Ajouter un dictionnaire avec latitude et longitude à la liste
        coordinates.push({
            latitude: lat,
            longitude: lon
        });
    }

    return coordinates; // Retourner la liste de dictionnaires
}
