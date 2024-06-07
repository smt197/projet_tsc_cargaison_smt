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
        $mail->Password = 'uwsw cyiv tbnf aqzt';  
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Destinataires
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
    // Récupérer les données envoyées via AJAX
    $requestData = json_decode(file_get_contents('php://input'), true);

    if (isset($requestData['action']) && $requestData['action'] === 'changerEtape') {
        // Récupérer les données de la requête
        $idCargaison = $requestData['idCargaison'];
        $nouvelleEtape = $requestData['nouvelleEtape'];

        // Lire les données JSON existantes
        $data = readJSON('cargaisons.json');

        // Rechercher la cargaison par son ID
        $cargaisonKey = array_search($idCargaison, array_column($data['cargaisons'], 'idcargo'));

        if ($cargaisonKey === false) {
            echo json_encode(['status' => 'error', 'message' => 'La cargaison choisie n\'existe pas']);
            exit;
        }
        
        // Vérifier si la cargaison peut être marquée comme "Perdu"
        if ($nouvelleEtape === 'perdu' && ($data['cargaisons'][$cargaisonKey]['etat_globale'] !== 'fermée' || $data['cargaisons'][$cargaisonKey]['etat_avancement'] !== 'en_route')) {
            echo json_encode(['status' => 'error', 'message' => 'La cargaison ne peut être marquée comme "Perdu" que si elle est fermée et en route']);
            exit;
        }

        // Vérifier si la cargaison est en cours, qu'elle se referme automatiquement
        if ($nouvelleEtape === 'en_route' && $data['cargaisons'][$cargaisonKey]['etat_globale'] === 'ouvert') {
            $data['cargaisons'][$cargaisonKey]['etat_globale'] = 'fermée';
        }

        // Vérifier si la cargaison est en attente, qu'elle s'ouvre automatiquement
        if ($nouvelleEtape === 'en_attente' && $data['cargaisons'][$cargaisonKey]['etat_globale'] === 'fermée') {
            $data['cargaisons'][$cargaisonKey]['etat_globale'] = 'ouvert';
        }
        // Mettre à jour l'étape de la cargaison
        $data['cargaisons'][$cargaisonKey]['etat_avancement'] = $nouvelleEtape;

                // Envoyer un email aux clients si la cargaison est marquée comme "perdu" ou "arrivée"
                if ($nouvelleEtape === 'perdu' || $nouvelleEtape === 'arrivee') {
                    $produits = $data['cargaisons'][$cargaisonKey]['produits'];
                    foreach ($produits as $produit) {
                        $emeteur = $produit['emeteur'];
                        $destinataire = $produit['destinataire'];
                        $sujet = "Mise à jour de l'état de votre cargaison";
                        $message = "Bonjour,\n\nLa cargaison qui contenait votre colis est: " . $nouvelleEtape . ".\n\nCordialement,\nL'équipe de gestion des cargaisons.";
        
                        // Envoyer des emails aux émetteurs et destinataires des produits
                        envoyerEmail($emeteur['email_client'], $sujet, $message);
                        envoyerEmail($destinataire['email_client'], $sujet, $message);
                    }
                }

        // Écrire les données mises à jour dans le fichier JSON
        writeJSON('cargaisons.json', $data);

        echo json_encode(['status' => 'success', 'message' => 'État avancement de la cargaison mise à jour avec succès']);
        exit;
    }
    echo json_encode(['status' => 'error', 'message' => 'Action non spécifiée ou incorrecte']);
}

