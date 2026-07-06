import { PrismaClient, Type, Role, Genre, Statut } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

async function main() {
  // Utilisateurs
  const admin = await prisma.utilisateur.upsert({
    where: { email: 'admin@anvogue.com' },
    update: {},
    create: {
      nomComplet: 'Soro Guefala',
      nomUtilisateur: 'admin',
      email: 'admin@anvogue.com',
      password: await hash('Admin@123'),
      role: Role.ADMIN,
      genre: Genre.MASCULIN,
    },
  });

  const caissier = await prisma.utilisateur.upsert({
    where: { email: 'caisse@anvogue.com' },
    update: {},
    create: {
      nomComplet: 'Awa Camara',
      nomUtilisateur: 'caissier',
      email: 'caisse@anvogue.com',
      password: await hash('Caisse@123'),
      role: Role.CAISSE,
      genre: Genre.FEMININ,
    },
  });

  // Client
  const client = await prisma.client.upsert({
    where: { email: 'client@anvogue.com' },
    update: {},
    create: {
      nom: 'Kouassi',
      prenom: 'Jean',
      nomUtilisateur: 'jkouassi',
      email: 'client@anvogue.com',
      phone: '0708090910',
      password: await hash('Client@123'),
      genre: Genre.MASCULIN,
      adresse: 'Cocody, Abidjan',
    },
  });

  // Categories
  const categorieTshirt = await prisma.categorie.upsert({
    where: { reference: 'CAT-TSHIRT' },
    update: {},
    create: {
      reference: 'CAT-TSHIRT',
      nom: 'T-shirts',
      description: 'Tous les t-shirts',
      type: Type.VETEMENT,
    },
  });

  const categorieBasket = await prisma.categorie.upsert({
    where: { reference: 'CAT-BASKET' },
    update: {},
    create: {
      reference: 'CAT-BASKET',
      nom: 'Baskets',
      description: 'Chaussures de sport',
      type: Type.CHAUSSURE,
    },
  });

  // Collections
  const collectionEte = await prisma.collection.upsert({
    where: { reference: 'COL-ETE2026' },
    update: {},
    create: {
      reference: 'COL-ETE2026',
      nom: 'Été 2026',
      description: 'Collection été 2026',
    },
  });

  // Articles
  const articleTshirt = await prisma.article.upsert({
    where: { reference: 'ART-TSHIRT-001' },
    update: {},
    create: {
      reference: 'ART-TSHIRT-001',
      nom: 'T-shirt col rond blanc',
      description: 'T-shirt en coton 100%, coupe classique',
      infos: { marque: 'Anvogue', matiere: 'Coton', etat: 'NEUF' },
      status: Statut.DISPONIBILITE,
      quantite: 50,
      prix: 8000,
      categorie_id: categorieTshirt.id,
      collection_id: collectionEte.id,
    },
  });

  const articleBasket = await prisma.article.upsert({
    where: { reference: 'ART-BASKET-001' },
    update: {},
    create: {
      reference: 'ART-BASKET-001',
      nom: 'Basket running noire',
      description: 'Basket légère pour la course à pied',
      infos: { marque: 'Anvogue Sport', matiere: 'Synthétique', etat: 'NEUF' },
      status: Statut.PROMO,
      quantite: 30,
      prix: 25000,
      estEnPromotion: true,
      prixPromotion: 19000,
      categorie_id: categorieBasket.id,
      collection_id: collectionEte.id,
    },
  });

  // Varietes
  await prisma.variete.create({
    data: {
      reference: 'VAR-TSHIRT-001-M',
      couleur: 'Blanc',
      tailles: [
        { taille: 'S', quantite: 10, prix: 8000 },
        { taille: 'M', quantite: 20, prix: 8000 },
        { taille: 'L', quantite: 20, prix: 8000 },
      ],
      image: [],
      article_id: articleTshirt.id,
    },
  });

  await prisma.variete.create({
    data: {
      reference: 'VAR-BASKET-001-42',
      couleur: 'Noir',
      tailles: [
        { taille: '40', quantite: 10, prix: 25000 },
        { taille: '42', quantite: 10, prix: 25000 },
        { taille: '44', quantite: 10, prix: 25000 },
      ],
      image: [],
      article_id: articleBasket.id,
    },
  });

  // Note
  await prisma.note.create({
    data: {
      etoile: 4.5,
      commentaire: 'Très bon produit, je recommande !',
      client_id: client.id,
      article_id: articleTshirt.id,
    },
  });

  // Favoris
  await prisma.favoris.upsert({
    where: {
      client_id_article_id: {
        client_id: client.id,
        article_id: articleBasket.id,
      },
    },
    update: {},
    create: {
      client_id: client.id,
      article_id: articleBasket.id,
    },
  });

  // Audit
  await prisma.audit.create({
    data: {
      table: 'articles',
      table_id: articleTshirt.id,
      message: `Création de l'article ${articleTshirt.nom}`,
      utilisateur_id: admin.id,
    },
  });

  console.log('Seed terminé avec succès.');
  console.log({ admin: admin.email, caissier: caissier.email, client: client.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
