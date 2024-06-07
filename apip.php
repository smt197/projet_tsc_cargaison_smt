<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json');

// Fonction pour lire le fichier JSON
function readJSON($filename) {
    $json_data = file_get_contents($filename);
    return json_decode($json_data, true);
}

// Fonction pour écrire dans le fichier JSON
function writeJSON($filename, $data) {
    $json_data = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json_data);
}

// Fonction pour envoyer un email
function envoyerEmail($email, $sujet, $message) {
    $mail = new PHPMailer(true);

    try {
        // Configuration du serveur SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'serignembayet@gmail.com';
        $mail->Password = 'uwsw cyiv tbnf aqzt';  // Remplacez par votre mot de passe d'application
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Expediteur
        $mail->setFrom('serignembayet@gmail.com', 'Gestionnaire de Cargaisons');
        $mail->addAddress($email);

        // Contenu de l'email
        $mail->isHTML(true);
        $mail->Subject = $sujet;
        $mail->Body    = $message;
        $mail->AltBody = strip_tags($message);

        $mail->send();
        return true;
    } catch (Exception $e) {
        return "L'email n'a pas pu être envoyé. Erreur: {$mail->ErrorInfo}";
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];

        if ($action === 'addCargaison') {
            $newCargaison = [
                "idcargo" => uniqid(),
                "numero" => $_POST['numero'],
                "lieu_depart" => $_POST['lieu_depart'],
                "lieu_arrivee" => $_POST['lieu_arrivee'],
                "distance_km" => $_POST['distance_km'],
                "poids_suporter" => $_POST['poids_suporter'],
                "date_depart" => $_POST['date_depart'],
                "date_arrivee" => $_POST['date_arrivee'],
                "nom_cargaison" => $_POST['nom_cargaison'],
                "valeur_max" => $_POST['valeur_max'],
                "type" => $_POST['type'],
                "etat_avancement" => $_POST['etat_avancement'],
                "etat_globale" => $_POST['etat_globale'],
                "produit" => []
            ];

            $data = readJSON('cargaisons.json');
            $data['cargaisons'][] = $newCargaison;
            writeJSON('cargaisons.json', $data);
            
            echo json_encode(['message' => 'Cargaison ajoutée avec succès']);
            exit;
        } elseif ($action === 'addProduit') {
            $produit = [
                "idproduit" => $_POST['idproduit'],
                "numero_produit" => $_POST['numero_produit'],
                "nom_produit" => $_POST['nom_produit'],
                "type_produit" => $_POST['type_produit'],
                "etape_produit" => $_POST['etape_produit'],
                "poids" => $_POST['poids'],
                "emeteur" => json_decode($_POST['emeteur'], true),
                "destinataire" => json_decode($_POST['destinataire'], true)
            ];

            $cargaisonNum = $_POST['cargaisonNum'];
            $data = readJSON('cargaisons.json');

            // Rechercher la cargaison par son numéro
            $cargaisonKey = array_search($cargaisonNum, array_column($data['cargaisons'], 'numero'));

            if ($cargaisonKey === false) {
                echo json_encode(['status' => 'error', 'message' => 'La cargaison choisie n\'existe pas']);
                exit;
            }

             // Vérifier si la cargaison est fermée
            if ($data['cargaisons'][$cargaisonKey]['etat_globale'] === 'fermée' ) {
                echo json_encode(['status' => 'error', 'message' => 'Impossible d\'ajouter un produit à une cargaison fermée et en cours']);
                exit;
            }

            // Vérifier si le produit est de type chimique et si la cargaison est maritime
            if ($produit['type_produit'] === 'chimique' && $data['cargaisons'][$cargaisonKey]['type'] !== 'CargaisonMaritime') {
                echo json_encode(['status' => 'error', 'message' => 'Les produits chimiques ne peuvent être ajoutés qu\'aux cargaisons maritimes']);
                exit;
            }
            // Vérifier si le produit est de type fragile et si la cargaison est aerienne
            if ($produit['type_produit'] === 'fragile' && $data['cargaisons'][$cargaisonKey]['type'] !== 'CargaisonAérienne') {
                echo json_encode(['status' => 'error', 'message' => 'Les produits fragiles ne peuvent être ajoutés qu\'aux cargaisons Aeriennes']);
                exit;
            }
            // Vérifier si la valeur maximale est dèpassée
            if ($produit['poids'] >= $data['cargaisons'][$cargaisonKey]['valeur_max']) {
                echo json_encode(['status' => 'error', 'message' => 'La cargaison a atteint sa taille maximale']);
                exit;
            }
            

            // Ajouter le produit à la cargaison choisie
            $data['cargaisons'][$cargaisonKey]['produits'][] = $produit;

            writeJSON('cargaisons.json', $data);

            // Envoyer des emails aux clients
            $emeteur = $produit['emeteur'];
            $destinataire = $produit['destinataire'];
            $sujet = "Enregistrement de votre colis";
            $message = "Bonjour,\n\nLe colis a été bien enregistré.\n\nDétails du Colis  :\nCode: " . $produit['idproduit'] . "\nNom_Produit: " . $produit['numero_produit'] . "\nPoids: " . $produit['poids'] . "kg\n\nCordialement,\nL'équipe de gestion des cargaisons.";

            $resultEmeteur = envoyerEmail($emeteur['email_client'], $sujet, $message);
            $resultDestinataire = envoyerEmail($destinataire['email_client'], $sujet, $message);

            if ($resultEmeteur === true && $resultDestinataire === true) {
                echo json_encode(['status' => 'success', 'message' => 'Produit ajouté avec succès à la cargaison et emails envoyés aux clients']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Produit ajouté avec succès à la cargaison mais erreur lors de l\'envoi des emails']);
            }
            exit;
        } 
    }
    echo json_encode(['status' => 'error', 'message' => 'Action non spécifiée ou incorrecte']);
}
?>