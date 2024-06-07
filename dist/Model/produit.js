// import { Client } from "./client.js";
// import { Destinataire } from "./destinataire.js";
class Produit {
    idproduit;
    numero_produit;
    nom_produit;
    type_produit;
    etape_produit;
    poids;
    produit = [];
    client = [];
    emeteur;
    destinataire;
    constructor(idproduit, numero_produit, nom_produit, type_produit, etape_produit, poids, emeteur, destinataire) {
        this.idproduit = idproduit;
        this.numero_produit = numero_produit;
        this.nom_produit = nom_produit;
        this.type_produit = type_produit;
        this.etape_produit = etape_produit;
        this.poids = poids;
        this.emeteur = emeteur;
        this.destinataire = destinataire;
    }
}
class ProduitAlimentaire extends Produit {
    constructor(idproduit, numero_produit, nom_produit, type_produit, etape_produit, poids, emeteur, destinataire) {
        super(idproduit, numero_produit, nom_produit, 'alimentaire', etape_produit, poids, emeteur, destinataire);
        // Initialisations spécifiques à Produit Alimentaire 
    }
}
class ProduitChimique extends Produit {
    toxicite;
    constructor(idproduit, numero_produit, nom_produit, type_produit, etape_produit, poids, emeteur, destinataire, toxicite) {
        super(idproduit, numero_produit, nom_produit, 'chimique', etape_produit, poids, emeteur, destinataire);
        if (toxicite < 1 || toxicite > 10) {
            throw new Error("Le degré de toxicité doit être entre 1 et 10.");
        }
        this.toxicite = toxicite;
    }
}
class ProduitMateriel extends Produit {
    constructor(idproduit, numero_produit, nom_produit, type_produit, etape_produit, poids, emeteur, destinataire) {
        super(idproduit, numero_produit, nom_produit, 'materiel', etape_produit, poids, emeteur, destinataire);
    }
}
class ProduitFragile extends ProduitMateriel {
    constructor(idproduit, numero_produit, nom_produit, type_produit, etape_produit, poids, emeteur, destinataire) {
        super(idproduit, numero_produit, nom_produit, 'fragile', etape_produit, poids, emeteur, destinataire);
    }
}
class ProduitIncassable extends ProduitMateriel {
    constructor(idproduit, numero_produit, nom_produit, type_produit, etape_produit, poids, emeteur, destinataire) {
        super(idproduit, numero_produit, nom_produit, 'incassable', etape_produit, poids, emeteur, destinataire);
    }
}
export { Produit, ProduitAlimentaire, ProduitChimique, ProduitMateriel, ProduitFragile, ProduitIncassable };
