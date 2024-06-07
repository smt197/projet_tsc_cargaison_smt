<?php

header('Content-Type: application/json');

// Fonction pour lire le fichier JSON
function readJSON($filename) {
    $json_data = file_get_contents($filename);
    return json_decode($json_data, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['idproduit'])) {
        $idproduit = $_GET['idproduit'];

        // Lire les données JSON existantes
        $data = readJSON('cargaisons.json');

        // Parcourir les cargaisons et leurs produits
        foreach ($data['cargaisons'] as $cargaison) {
            foreach ($cargaison['produits'] as $produit) {
                if ($produit['idproduit'] === $idproduit) {
                    // Produit trouvé, renvoyer l'état d'avancement
                    echo json_encode([
                        'status' => 'success',
                        'etat_avancement' => $produit['etape_produit']
                    ]);
                    exit;
                }
            }
        }

        // Produit non trouvé
        echo json_encode([
            'status' => 'error',
            'message' => 'Produit non trouvé'
        ]);
        exit;
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'ID de produit non spécifié'
        ]);
        exit;
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Requête non valide'
    ]);
    exit;
}
?>
