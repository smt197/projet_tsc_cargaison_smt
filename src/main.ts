// import { Console } from 'console';
// import { Cargaison } from './Model/cargaison.js';


import { Cargaison as c } from "./Model/cargaison";
import { Produit } from "./Model/produit.js";
interface Client{
  idclient: string;
  nom_client: string;
  prenom_client: string;
  telephone_client: number;
  email_client: string;
}

//--------------------Ajouter Produit--------------------------------------------
function ajouterProduit(cargaisonNum: string): void {
  const idproduit = "PRD" + Math.floor(Math.random() * 1000);

  let formData = new FormData();
  formData.append("action", "addProduit");
  formData.append("idproduit", idproduit);
  formData.append("numero_produit", (document.getElementById("nom-produit") as HTMLInputElement)?.value.trim());
  formData.append("nom_produit", (document.getElementById("nom-produit") as HTMLInputElement).value.trim());
  formData.append("type_produit", (document.getElementById("type-produit") as HTMLSelectElement).value.trim());
  formData.append("etape_produit", (document.getElementById("etape-produit") as HTMLSelectElement).value.trim());
  formData.append("poids", (document.getElementById("poids-produit") as HTMLInputElement).value.trim());
  formData.append("cargaisonNum", cargaisonNum);

  const emeteur: Client = {
    idclient: "CLT" + Math.floor(Math.random() * 1000),
    nom_client: (document.getElementById("nom-client") as HTMLInputElement).value.trim(),
    prenom_client: (document.getElementById("prenom-client") as HTMLInputElement).value.trim(),
    telephone_client: parseInt((document.getElementById("telephone-client") as HTMLInputElement).value.trim(), 10),
    email_client: (document.getElementById("email-client") as HTMLInputElement).value.trim()
  };

  formData.append("emeteur", JSON.stringify(emeteur));

  const destinataire: Client = {
    idclient: "DEST" + Math.floor(Math.random() * 1000),
    nom_client: (document.getElementById("nom-destinateur") as HTMLInputElement).value.trim(),
    prenom_client: (document.getElementById("prenom-destinateur") as HTMLInputElement).value.trim(),
    telephone_client: parseInt((document.getElementById("telephone-destinateur") as HTMLInputElement).value.trim(), 10),
    email_client: (document.getElementById("email-destinateur") as HTMLInputElement).value.trim()
  };

  formData.append("destinataire", JSON.stringify(destinataire));

  fetch("apip.php", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        alert(data.message);
        (document.getElementById("form-add-produit") as HTMLFormElement).reset();
        document.getElementById('loader')!.style.display = 'none';
      } else {
        // alert("Erreur lors de l'ajout du produit : " + data.message);
        alerts("Erreur lors de l'ajout du produit : " + data.message, "error");
        
      }
    })
    .catch(error => {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout du produit");
    });
}

// Ajout de l'événement de soumission du formulaire de produit
document.getElementById("form-add-produit")?.addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById('loader')!.style.display = 'block';
  const cargaisonNum = (document.getElementById("idcargo") as HTMLInputElement).value;
  ajouterProduit(cargaisonNum);
});


// Fonction pour fermer une cargaison
function fermerCargaison(cargaisonId: string | null): void {
  if (!cargaisonId) {
      console.error("cargaisonId is null");
      return;
  }

  fetch("apif.php", {
      method: "POST",
      body: JSON.stringify({
          action: "fermerCargaison",
          id: cargaisonId
      }),
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then((response) => response.json())
  .then((data) => {
      if (data.status === "success") {
          // alert(data.message);
          alerts("Success!" + data.message, "success");
          affichage(); // Rafraîchir le tableau après fermeture
      } else {
          // alert("Erreur lors de la fermeture de la cargaison : " + data.message);
          alerts("erreur lors de la mise à jour de l'état d'avancement:" + data.message, "error");
      }
  })
  .catch((error) => {
      console.error("Erreur:", error);
      alert("Erreur lors de la fermeture de la cargaison");
      
  });
}

// Fonction pour ouvrir une cargaison
function ouvrirCargaison(cargaisonId: string | null): void {
  if (!cargaisonId) {
      console.error("cargaisonId is null");
      return;
  }

  fetch("apiv.php", {
      method: "POST",
      body: JSON.stringify({
          action: "ouvrirCargaison",
          id: cargaisonId
      }),
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then((response) => response.json())
  .then((data) => {
      if (data.status === "success") {
          // alert(data.message);
          alerts("Success!" + data.message, "success");
          affichage(); // Rafraîchir le tableau après fermeture
      } else {
          alert("Erreur lors de l'ouverture de la cargaison : " + data.message);
      }
  })
  .catch((error) => {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ouverture de la cargaison");
  });
}

// Fonction changer etat_avancement d'une cargaison
function changerEtatAvancement(cargaisonId: string | null, newEtat: string): void {
  if (!cargaisonId) return;

  fetch("apiE.php", {
      method: "POST",
      body: JSON.stringify({
        action: "changerEtape",
        idCargaison: cargaisonId,
          nouvelleEtape: newEtat,
      }),
      headers: {
          "Content-Type": "application/json"
      }
  })
  .then((response) => response.json())
  .then((data) => {
      if (data.status === "success") {
          // alert("État d'avancement mis à jour avec succès");
        alerts("État d'avancement mis à jour avec succès", "success");
          affichage();
      } else {
          // alert("Erreur lors de la mise à jour de l'état d'avancement");
          alerts("erreur lors de la mise à jour de l'état d'avancement", "error");
      }
  })
  .catch((error) => {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour de l'état d'avancement");
  });
}

function alerts(message: string, icone: string){
  Swal.fire({
    title: "Resultat",
    text: message,
    icon: icone,
    showConfirmButton: false,
    timer: 1500,
  });
}
// Fonction changer etat_avancement d'un produit
function changerEtapeProduit(cargaisonId: string | null,produitId: string | null,newEtape: string): void {
  
  fetch("apiEp.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "updateEtape",
      cargaisonId,
      produitId,
      newEtape,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        afficherDetailsCargaison(cargaisonId); // Rafraîchir la vue
      } else {
        // alert("Erreur lors de la mise à jour de l'étape : " + data.message);
        alerts("Erreur lors de la mise à jour de l'étape:" + data.message, "error");
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour de l'étape");
    });
}

// Fonction supprimer produit dans une cargaison
function supprimerProduit(cargaisonId: string, produitId: string, etape: string): void {
  // console.log(Tentative de suppression du produit avec ID: ${produitId} et étape: ${etape});
  if (etape != "en_attente") {
    // alert("Vous ne pouvez supprimer un produit que si son étape est 'En attente'");
    alerts("Vous ne pouvez supprimer un produit que si son étape est En attente", "error");
    document.getElementById("modal-detail")?.classList.add('hidden') 
    return;
  }else
  {
    fetch("api_sup_produit.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "deleteProduit", cargaisonId, produitId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Réponse du serveur :', data);
        if (data.status === "success") {
          afficherDetailsCargaison(cargaisonId); // Rafraîchir la vue
          // alert(`Produit avec ID: ${produitId} a été supprimé avec succès.`);
          alerts(`Produit avec ID: ${produitId} a été supprimé avec succès.`, "success");
        } else {
          // alert("Erreur lors de la suppression du produit : " + data.message);
          alerts("Erreur lors de la suppression du produit : " + data.message, "error");
          console.error("Erreur lors de la suppression du produit : " + data.message);
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression du produit");
      });
  }

}

// Fonction modifier la date depart et d'arrivee

// --------------------------afficher détails cargaison----------------------------
function afficherDetailsCargaison(cargaisonId: string | null): void {
  if (!cargaisonId) {
    console.error("cargaisonId is null");
    return;
  }

  fetch("cargaisons.json")
    .then((response) => response.json())
    .then((data) => {
      const cargaison = data.cargaisons.find(
        (c: Cargaison) => c.idcargo === cargaisonId
      );
      if (cargaison) {
        let modalContent = `
          <p><strong>Numéro:</strong> ${cargaison.numero}</p>
          <p><strong>Date de départ:</strong> ${cargaison.date_depart}</p>
          <p><strong>Date d'arrivée:</strong> ${cargaison.date_arrivee}</p>
          <p><strong>Lieu de départ:</strong> ${cargaison.lieu_depart}</p>
          <p><strong>Lieu d'arrivée:</strong> ${cargaison.lieu_arrivee}</p>
          <p><strong>Distance (km):</strong> ${cargaison.distance_km}</p>
          <p><strong>État globale:</strong> ${cargaison.etat_globale}</p>
          <p><strong>État d'avancement:</strong> ${cargaison.etat_avancement}</p>
          <p><strong>Type:</strong> ${cargaison.type}</p>
          <h3 class="text-lg leading-6 font-medium text-gray-900 mt-4">Détails Produits</h3>
        `;
        if (cargaison.produits && cargaison.produits.length > 0) {
          modalContent += `
            <table class="min-w-full divide-y divide-gray-200 mt-4">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Produit</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étape</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200" id="produits-table-body">
          `;
          cargaison.produits.forEach((produit: Produit) => {
            modalContent += `
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">${produit.idproduit}</td>
                <td class="px-6 py-4 whitespace-nowrap">${produit.nom_produit}</td>
                <td class="px-6 py-4 whitespace-nowrap">${produit.poids}</td>
                <td class="px-6 py-4 whitespace-nowrap">${produit.etape_produit}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                <select class="${cargaison.etat_avancement === "en_route" ? "hidden" : ""} etat-avancement-select-prod bg-gradient-to-r from-blue-400 to-blue-600 text-white text-lg" data-cargaison-id="${cargaison.idcargo}" data-produit-id="${produit.idproduit}" data-produit-etape="${produit.etape_produit}">
                <option value="en_attente" ${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${produit.etape_produit === "archive" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "hidden" : ""} ${produit.etape_produit === "non-recuperer" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${produit.etape_produit === "en_attente" ? "selected" : ""}>En attente</option>
                <option value="en_cours" ${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${produit.etape_produit === "archive" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "hidden" : ""} ${produit.etape_produit === "non-recuperer" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${produit.etape_produit === "en_cours" ? "selected" : ""}>En cours</option>
                <option value="arrivee" ${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${produit.etape_produit === "archive" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "hidden" : ""} ${produit.etape_produit === "non-recuperer" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${produit.etape_produit === "arrivee" ? "selected" : ""}>Arrivée</option>
                <option value="recuperer" ${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${produit.etape_produit === "archive" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "selected" : ""}>Récupérer</option>
                <option value="non-recuperer" ${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${produit.etape_produit === "archive" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "hidden" : ""} ${produit.etape_produit === "non-recuperer" ? "selected" : ""}>Non-recupérer</option>
                <option value="perdu" ${produit.etape_produit === "archive" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "hidden" : ""} ${produit.etape_produit === "non-recuperer" ? "hidden" : ""} ${produit.etape_produit === "perdu" ? "selected" : ""}>Perdu</option>
                <option value="archive" ${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "hidden" : ""} ${produit.etape_produit === "archive" ? "selected" : ""}>Archive</option>
                <option value="annuler" ${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${produit.etape_produit === "archive" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "hidden" : ""} ${produit.etape_produit === "recuperer" ? "hidden" : ""} ${produit.etape_produit === "non-recuperer" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${produit.etape_produit === "annuler" ? "selected" : ""}>Annuler</option>
              </select>
              <button class="text-red-600 hover:text-red-900 ml-2 deleteProduit ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${cargaison.etat_globale === "fermée" ? "hidden" : ""} ${cargaison.etat_avancement === "en_route" ? "hidden" : ""}" data-cargaison-id="${cargaison.idcargo}" data-produit-id="${produit.idproduit}" data-produit-etape="${produit.etape_produit}">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `;
          });
          modalContent += `
              </tbody>
            </table>
          `;
        } else {
          modalContent += "<p>Aucun produit dans cette cargaison.</p>";
        }

        document.getElementById("modal-content")!.innerHTML = modalContent;
        document.getElementById("modal-detail")?.classList.remove("hidden");

        // Ajouter un écouteur d'événements pour le bouton de suppression
        document.querySelectorAll('.deleteProduit').forEach(item => {
          item.addEventListener('click', (event: Event) => {
            const target = event.currentTarget as HTMLElement;
            const cargaisonId = target.getAttribute('data-cargaison-id');
            const produitId = target.getAttribute('data-produit-id');
            const produitEtape = target.getAttribute('data-produit-etape');
            
            // console.log(Produit ID: ${produitId}, Étape: ${produitEtape});

            if (cargaisonId && produitId && produitEtape) {
              supprimerProduit(cargaisonId, produitId, produitEtape);
            }
          });
        });
        // Ajouter un écouteur d'événements pour le select etat produit
        document.querySelectorAll(".etat-avancement-select-prod").forEach((select) => {
          select.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            const cargaisonId = target.getAttribute('data-cargaison-id');
            const produitId = target.getAttribute("data-produit-id");
            const newEtat = target.value;
              changerEtapeProduit(cargaisonId,produitId, newEtat);
          });
      });
  
      } else {
        console.error("Cargaison not found");
      }
    })
    .catch((error) => console.error("Error:", error));
}


// Fonction pour ouvrir le modal addProduct
// Fonction pour ouvrir le modal et passer l'ID de la cargaison
function ouvrirModalProd(cargaisonNum: string | null): void {
  console.log("Ajouter dans la cargaison:", cargaisonNum);
  const modal = document.getElementById("modal-produit");
  if (modal) {
    modal.classList.remove("hidden");
    (document.getElementById("idcargo") as HTMLInputElement).value = cargaisonNum || "";
  }
}
interface Cargaison {
    idcargo: string;
    numero: string;
    date_depart: string;
    date_arrivee: string;
    lieu_depart: string;
    lieu_arrivee: string;
    distance_km: string;
    etat_globale: string;
    etat_avancement: string;
    type: string;
}
let currentPage = 1;
const itemsPerPage = 5;
let totalPages = 1;
function affichage(page: number = currentPage): void {
    fetch("cargaisons.json")
        .then((response) => response.json())
        .then((data) => {
            const cargaisons: Cargaison[] = data.cargaisons;
            const cargaisonList = document.getElementById("cargaison-list");
            if (!cargaisonList) return;

            // Récupérer les valeurs de recherche
            const searchNumero = (
                document.getElementById("search-numero") as HTMLInputElement
            ).value.toLowerCase();
            const searchDateDepart = (
                document.getElementById("search-date-depart") as HTMLInputElement
            ).value;
            const searchDateArrivee = (
                document.getElementById("search-date-arrivee") as HTMLInputElement
            ).value;
            const searchLieuDepart = (
                document.getElementById("search-lieu-depart") as HTMLInputElement
            ).value.toLowerCase();
            const searchLieuArrivee = (
                document.getElementById("search-lieu-arrivee") as HTMLInputElement
            ).value.toLowerCase();
            const typeCargaison = (
                document.getElementById("type-filtre") as HTMLSelectElement
            ).value;

            // Filtrer les cargaisons en fonction des valeurs de recherche
            const cargaisonsFiltrees = cargaisons.filter(
                (cargaison) =>
                    (searchNumero === "" ||
                        cargaison.numero.toLowerCase().includes(searchNumero)) &&
                    (searchDateDepart === "" ||
                        cargaison.date_depart.includes(searchDateDepart)) &&
                    (searchDateArrivee === "" ||
                        cargaison.date_arrivee.includes(searchDateArrivee)) &&
                    (searchLieuDepart === "" ||
                        cargaison.lieu_depart.toLowerCase().includes(searchLieuDepart)) &&
                    (searchLieuArrivee === "" ||
                        cargaison.lieu_arrivee.toLowerCase().includes(searchLieuArrivee)) &&
                    (typeCargaison === "" ||
                        cargaison.type === typeCargaison)
            );

            totalPages = Math.ceil(cargaisonsFiltrees.length / itemsPerPage);
            currentPage = page;

            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedCargaisons = cargaisonsFiltrees.slice(start, end);

            cargaisonList.innerHTML = "";
            paginatedCargaisons.forEach((cargaison) => {
                const row = document.createElement("tr");
                row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cargaison.numero}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cargaison.type}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cargaison.date_depart}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cargaison.date_arrivee}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cargaison.lieu_depart}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cargaison.lieu_arrivee}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cargaison.etat_globale}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cargaison.etat_avancement}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button class="bg-blue-500 text-white px-1 py-1 rounded btn-view" type="button" data-id="${cargaison.idcargo}"><i class="fas fa-solid fa-eye"></i></button>
            <button class="${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${cargaison.etat_avancement === "en_route" ? "hidden" : ""} bg-blue-500 text-white px-1 py-1 rounded btn-add-prod" type="button" data-id="${cargaison.numero}"><i class=" fas fa-solid fa-plus"></i></button>
            <button class="${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} bg-blue-500 text-white px-1 py-1 rounded btn-fermer-cargo ${cargaison.etat_globale === 'fermée' ? 'bg-red-500' : ''}" type="button" data-id="${cargaison.idcargo}"><i class="fas fa-solid fa-lock"></i></button>
            <button class="${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${cargaison.etat_avancement === "en_attente" ? "hidden" : ""} ${cargaison.etat_avancement === "en_route" ? "hidden" : ""} bg-blue-500 text-white px-1 py-1 rounded btn-ouvrir-cargo ${cargaison.etat_globale === 'ouvert' ? 'bg-green-500' : ''}" type="button" data-id="${cargaison.idcargo}"><i class="fas fa-solid fa-lock-open"></i></button>
            <select class="etat-avancement-select" data-id="${cargaison.idcargo}">
                <option value="en_attente"${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${cargaison.etat_avancement === "en_route" ? "hidden" : ""} ${cargaison.etat_avancement === 'en_attente' ? 'selected' : ''}>En attente</option>
                <option value="en_route"${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${cargaison.etat_avancement === 'en_route' ? 'selected' : ''}>En route</option>
                <option value="arrivee"${cargaison.etat_avancement === "perdu" ? "hidden" : ""} ${cargaison.etat_avancement === "en_attente" ? "hidden" : ""} ${cargaison.etat_avancement === 'arrivee' ? 'selected' : ''}>Arrivée</option>
                <option value="perdu"${cargaison.etat_avancement === "en_attente" ? "hidden" : ""} ${cargaison.etat_avancement === "arrivee" ? "hidden" : ""} ${cargaison.etat_avancement === 'perdu' ? 'selected' : ''}>Perdu</option>
                </select>
            </td>
          `;
                cargaisonList.appendChild(row);
            });

            // Mise à jour des événements des boutons "add"
            document.querySelectorAll(".btn-add-prod").forEach((button) => {
                button.addEventListener("click", (event) => {
                    console.log(button);
                    const target = (event.target as HTMLElement).closest(".btn-add-prod");
                    if (target) {
                        const cargaisonNum = target.getAttribute("data-id");
                        ouvrirModalProd(cargaisonNum);
                    }
                });
            });
            // Mise à jour des événements des boutons "voir"
            document.querySelectorAll(".btn-view").forEach((button) => {
              button.addEventListener("click", (event) => {
                  const target = (event.target as HTMLElement).closest(".btn-view");
                  if (target) {
                    const cargaisonId = target.getAttribute("data-id");
                      afficherDetailsCargaison(cargaisonId);
                  }
              });
            });

            document.querySelectorAll(".btn-fermer-cargo").forEach((button) => {
              button.addEventListener("click", (event) => {
                const target = (event.target as HTMLElement).closest(".btn-fermer-cargo");
                if (target) {
                  const cargaisonId = target.getAttribute("data-id");
                  console.log(cargaisonId);
                  fermerCargaison(cargaisonId);
                }
              });
            });

            document.querySelectorAll(".btn-ouvrir-cargo").forEach((button) => {
              button.addEventListener("click", (event) => {
                const target = (event.target as HTMLElement).closest(".btn-ouvrir-cargo");
                if (target) {
                  const cargaisonId = target.getAttribute("data-id");
                  console.log(cargaisonId);
                  ouvrirCargaison(cargaisonId);
                }
              });
            });

            document.querySelectorAll(".etat-avancement-select").forEach((select) => {
              select.addEventListener("change", (event) => {
                  const target = event.target as HTMLSelectElement;
                  const cargaisonId = target.getAttribute("data-id");
                  const newEtat = target.value;
                  changerEtatAvancement(cargaisonId, newEtat);
              });
          });

            // Mise à jour des informations de pagination
            const pageInfo = document.getElementById("page-info");
            if (pageInfo) {
                pageInfo.textContent = `${currentPage} / ${totalPages}`;
            }

            // Activer/désactiver les boutons de pagination
            const prevButton = document.getElementById(
                "prev-page"
            ) as HTMLButtonElement;
            const nextButton = document.getElementById(
                "next-page"
            ) as HTMLButtonElement;
            if (prevButton) {
                prevButton.disabled = currentPage === 1;
            }
            if (nextButton) {
                nextButton.disabled = currentPage === totalPages;
            }
        });
}

document.getElementById("prev-page")?.addEventListener("click", () => {
    if (currentPage > 1) {
        affichage(currentPage - 1);
    }
});

document.getElementById("next-page")?.addEventListener("click", () => {
    if (currentPage < totalPages) {
        affichage(currentPage + 1);
    }
});

// Ajout d'un événement pour la recherche
document
    .querySelectorAll(
        "#search-numero, #search-date-depart, #search-date-arrivee, #search-lieu-depart, #search-lieu-arrivee, btn-recherche"
    )


    .forEach((element) => {
        element.addEventListener("input", () => {
            affichage(1);
        });
    });

document.querySelector('#type-filtre')?.addEventListener('change', () => {
    affichage(1);
});
// Appel initial pour afficher les cargaisons existantes
affichage();






// ajouter cargaison
document
    .getElementById("form-add-cargaison")
    ?.addEventListener("submit", (event) => {
        event.preventDefault();

        const numero = "CRG" + Math.floor(Math.random() * 1000);
        const typeCargaison = (
            document.getElementById("type-cargaison") as HTMLSelectElement
        ).value.trim();
        const nom_cargaison = (
            document.getElementById("nom-cargaison") as HTMLInputElement
        ).value.trim();
        const poids_suporter = (
            document.getElementById("poids-suporter") as HTMLSelectElement
        ).value.trim();
        const date_depart = (
            document.getElementById("date-depart") as HTMLInputElement
        ).value.trim();
        const date_arrivee = (
            document.getElementById("date-arrivee") as HTMLInputElement
        ).value.trim();
        const lieu_depart = (
            document.getElementById("depart") as HTMLInputElement
        ).value.trim();
        const lieu_arrivee = (
            document.getElementById("arrivee") as HTMLInputElement
        ).value.trim();
        const distance_km = (
            document.getElementById("distance") as HTMLInputElement
        ).value.trim();
        const valeur_max = (
            document.getElementById("valeur-max") as HTMLInputElement
        ).value.trim();
        const etat_avancement = "en attente";
        const etat_globale = "ouvert";

        const formData = new FormData();
        formData.append("action", "addCargaison");
        formData.append("numero", numero);
        formData.append("lieu_depart", lieu_depart);
        formData.append("lieu_arrivee", lieu_arrivee);
        formData.append("distance_km", distance_km);
        formData.append("type", typeCargaison);
        formData.append("etat_avancement", etat_avancement);
        formData.append("etat_globale", etat_globale);
        formData.append("poids_suporter", poids_suporter);
        formData.append("date_depart", date_depart);
        formData.append("date_arrivee", date_arrivee);
        formData.append("nom_cargaison", nom_cargaison);
        formData.append("valeur_max", valeur_max);

        fetch("api.php", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    // alert(data.message);
                    alerts("Success!" + data.message, "success");


                    // Mettre à jour le tableau avec les nouvelles données
                    affichage();

                    // Réinitialiser les données du formulaire en utilisant reset()
                    (
                        document.getElementById("form-add-cargaison") as HTMLFormElement
                    ).reset();

                    // Fermer le modal
                    const modals = document.getElementById("modal");
                    if (modals) {
                        modals.classList.add("hidden");
                    } else {
                        console.error("Modal not found");
                    }
                } else {
                    alert("Erreur lors de l'ajout de la cargaison");
                }
            })
            .catch((error) => {
                console.error("Erreur:", error);
                alert("Erreur lors de l'ajout de la cargaison");
            });
            return false;
    });

document.addEventListener("DOMContentLoaded", (event) => {
    affichage();
});





// // ******************validation du formulaire****************

document.getElementById("ajouter")?.addEventListener("click", function (event) {
    event.preventDefault();
  
    const typeCargaison = document.getElementById(
      "type-cargaison"
    ) as HTMLSelectElement;
    const nomCargaison = document.getElementById(
      "nom-cargaison"
    ) as HTMLInputElement;
    const poidsSuporter = document.getElementById(
      "poids-suporter"
    ) as HTMLSelectElement;
    const valeur = document.getElementById("valeur-max") as HTMLInputElement;
    const dateDepart = document.getElementById("date-depart") as HTMLInputElement;
    const dateArrivee = document.getElementById(
      "date-arrivee"
    ) as HTMLInputElement;
    const depart = document.getElementById("depart") as HTMLInputElement;
    const arrivee = document.getElementById("arrivee") as HTMLInputElement;
    const distance = document.getElementById("distance") as HTMLInputElement;
  
    const typeCargaisonError = document.getElementById(
      "type-cargaison-error"
    ) as HTMLSpanElement;
    const nomCargaisonError = document.getElementById(
      "nom-cargaison-error"
    ) as HTMLSpanElement;
    const poidsSuporterError = document.getElementById(
      "poids-suporter-error"
    ) as HTMLSpanElement;
    const valeurError = document.getElementById(
      "valeur-error"
    ) as HTMLSpanElement;
    const dateDepartError = document.getElementById(
      "date-depart-error"
    ) as HTMLSpanElement;
    const dateArriveeError = document.getElementById(
      "date-arrivee-error"
    ) as HTMLSpanElement;
    const departError = document.getElementById(
      "depart-error"
    ) as HTMLSpanElement;
    const arriveeError = document.getElementById(
      "arrivee-error"
    ) as HTMLSpanElement;
    const distanceError = document.getElementById(
      "distance-error"
    ) as HTMLSpanElement;
  
    let formIsValid = true;
  
    function validateField(
      field: HTMLInputElement | HTMLSelectElement,
      errorElement: HTMLElement
    ) {
      if (field.value.trim() === "") {
        errorElement.classList.remove("hidden");
        formIsValid = false;
      } else {
        errorElement.classList.add("hidden");
      }
    }
  
    function validateDateField() {
      const today = new Date().toISOString().split("T")[0];
  
      if (dateDepart.value < today) {
        dateDepartError.textContent =
          "La date de départ doit être supérieure ou égale à la date du jour";
        dateDepartError.classList.remove("hidden");
        formIsValid = false;
      } else {
        dateDepartError.classList.add("hidden");
      }
  
      if (dateArrivee.value < dateDepart.value) {
        dateArriveeError.textContent =
          "La date d'arrivée doit être supérieure ou égale à la date de départ";
        dateArriveeError.classList.remove("hidden");
        formIsValid = false;
      } else {
        dateArriveeError.classList.add("hidden");
      }
    }
  
    function validateNomCargaison() {
      const regex = /^[a-zA-Z\s]*$/;
      if (!regex.test(nomCargaison.value)) {
        nomCargaisonError.textContent =
          "Le nom de la cargaison ne peut contenir que des lettres et des espaces";
        nomCargaisonError.classList.remove("hidden");
        formIsValid = false;
      } else {
        nomCargaisonError.classList.add("hidden");
      }
    }
  
    validateField(typeCargaison, typeCargaisonError);
    validateField(nomCargaison, nomCargaisonError);
    validateField(poidsSuporter, poidsSuporterError);
    validateField(valeur, valeurError);
    validateField(dateDepart, dateDepartError);
    validateField(dateArrivee, dateArriveeError);
    validateField(depart, departError);
    validateField(arrivee, arriveeError);
    validateField(distance, distanceError);
    validateDateField();
    validateNomCargaison();
  
    if (formIsValid) {
      const formData = new FormData();
      formData.append("action", "addCargaison");
      formData.append("numero", "CRG" + Math.floor(Math.random() * 1000));
      formData.append("type", typeCargaison.value);
      formData.append("nom_cargaison", nomCargaison.value);
      formData.append("poids_suporter", poidsSuporter.value);
      formData.append("valeur_max", valeur.value);
      formData.append("date_depart", dateDepart.value);
      formData.append("date_arrivee", dateArrivee.value);
      formData.append("lieu_depart", depart.value);
      formData.append("lieu_arrivee", arrivee.value);
      formData.append("distance_km", distance.value);
      formData.append("etat_avancement", "en attente");
      formData.append("etat_globale", "ouvert");
  
      fetch("api.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert(data.message);
            affichage(); // Rafraîchir le tableau après ajout
  
            // Fermer le modal
            const modal = document.getElementById("modal") as HTMLElement;;
            if (modal) modal.classList.add("hidden");
  
            // Réinitialiser le formulaire
            (
              document.getElementById("form-add-cargaison") as HTMLFormElement
            ).reset();
          } else {
            alert("Erreur lors de l'ajout de la cargaison");
          }
        });
    }
  });



  //----------------Section Fermer les modals------------------------------------------------

  document.getElementById("btn-add")?.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.remove("hidden");
  });
  document.getElementById("btn-close-modal")?.addEventListener("click", () => {
    const modal = document.getElementById("modal");
    if (modal) modal.classList.add("hidden");
  });

document.getElementById("btn-close-modal-produit")?.addEventListener("click", () => {
    const modal = document.getElementById("modal-produit");
    if (modal) modal.classList.add("hidden");
});

document.getElementById("close-modal-detail")?.addEventListener("click", () => {
  const modal = document.getElementById("modal-detail");
  if (modal) modal.classList.add("hidden");
});