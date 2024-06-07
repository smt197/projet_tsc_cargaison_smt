// import { Client } from "./client.js";
// import { Destinataire } from "./destinataire.js";

export interface Client{
  idclient: string;
  nom_client: string;
  prenom_client: string;
  telephone_client: number;
  email_client: string;
}

class Produit {
    idproduit: string;
    numero_produit: string;
    nom_produit: string;
    type_produit: string;
    etape_produit: string;
    poids: number;
    private produit: Produit[] = [];
    private client: Client[] = [];
    emeteur:Client ;
    destinataire:Client;
    
  
    constructor(
      idproduit: string,
      numero_produit: string,
      nom_produit: string,
      type_produit: string,
      etape_produit: string,
      poids: number,
      emeteur:Client,
      destinataire:Client
    ) {
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
  constructor(
    idproduit: string,
    numero_produit: string,
    nom_produit: string,
    type_produit: string,
    etape_produit: string,
    poids: number,
    emeteur: Client,
    destinataire: Client
  ) {
    super(idproduit, numero_produit, nom_produit, 'alimentaire', etape_produit, poids, emeteur, destinataire);
    // Initialisations spécifiques à Produit Alimentaire 
  }
}

class ProduitChimique extends Produit {
  toxicite: number;

  constructor(
    idproduit: string,
    numero_produit: string,
    nom_produit: string,
    type_produit: string,
    etape_produit: string,
    poids: number,
    emeteur: Client,
    destinataire: Client,
    toxicite: number
  ) {
    super(idproduit, numero_produit, nom_produit, 'chimique', etape_produit, poids, emeteur, destinataire);
    if (toxicite < 1 || toxicite > 10) {
      throw new Error("Le degré de toxicité doit être entre 1 et 10.");
    }
    this.toxicite = toxicite;
  }
}

class ProduitMateriel extends Produit {
  constructor(
    idproduit: string,
    numero_produit: string,
    nom_produit: string,
    type_produit: string,
    etape_produit: string,
    poids: number,
    emeteur: Client,
    destinataire: Client
  ) {
    super(idproduit, numero_produit, nom_produit, 'materiel', etape_produit, poids, emeteur, destinataire);
  }
}

class ProduitFragile extends ProduitMateriel {
  constructor(
    idproduit: string,
    numero_produit: string,
    nom_produit: string,
    type_produit: string,
    etape_produit: string,
    poids: number,
    emeteur: Client,
    destinataire: Client
  ) {
    super(idproduit, numero_produit, nom_produit, 'fragile', etape_produit, poids, emeteur, destinataire);
  }
}

class ProduitIncassable extends ProduitMateriel {
  constructor(
    idproduit: string,
    numero_produit: string,
    nom_produit: string,
    type_produit: string,
    etape_produit: string,
    poids: number,
    emeteur: Client,
    destinataire: Client
  ) {
    super(idproduit, numero_produit, nom_produit, 'incassable', etape_produit, poids, emeteur, destinataire);
  }
}

export { Produit, ProduitAlimentaire, ProduitChimique, ProduitMateriel, ProduitFragile, ProduitIncassable };