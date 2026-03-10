-- ============================================
-- Script d'initialisation - Base "coconut"
-- A executer dans la base coconut (namespace B3)
-- ============================================

-- ============================================
-- TABLES
-- ============================================

DEFINE TABLE customer SCHEMAFULL;
DEFINE FIELD firstName ON customer TYPE string;
DEFINE FIELD lastName ON customer TYPE string;
DEFINE FIELD email ON customer TYPE string;
DEFINE FIELD phone ON customer TYPE string;
DEFINE FIELD address ON customer TYPE string;

DEFINE TABLE product SCHEMAFULL;
DEFINE FIELD name ON product TYPE string;
DEFINE FIELD price ON product TYPE number;
DEFINE FIELD category ON product TYPE string;
DEFINE FIELD stock ON product TYPE int;

DEFINE TABLE order SCHEMAFULL;
DEFINE FIELD customer ON order TYPE record<customer>;
DEFINE FIELD products ON order TYPE array<object>;
DEFINE FIELD products.*.product ON order TYPE record<product>;
DEFINE FIELD products.*.quantity ON order TYPE int;
DEFINE FIELD status ON order TYPE string ASSERT $value IN ["en cours", "livree"];
DEFINE FIELD date ON order TYPE datetime DEFAULT time::now();

-- ============================================
-- DONNEES DE TEST - Customers
-- ============================================

CREATE customer:1 CONTENT {
  firstName: "Jean",
  lastName: "Dupont",
  email: "jean.dupont@email.com",
  phone: "0612345678",
  address: "12 Rue de Paris, 75001 Paris"
};

CREATE customer:2 CONTENT {
  firstName: "Marie",
  lastName: "Martin",
  email: "marie.martin@email.com",
  phone: "0698765432",
  address: "45 Avenue des Champs, 69001 Lyon"
};

CREATE customer:3 CONTENT {
  firstName: "Pierre",
  lastName: "Bernard",
  email: "pierre.bernard@email.com",
  phone: "0654321098",
  address: "8 Boulevard Victor Hugo, 33000 Bordeaux"
};

-- ============================================
-- DONNEES DE TEST - Products
-- ============================================

CREATE product:1 CONTENT {
  name: "Clavier mecanique",
  price: 89.99,
  category: "Peripheriques",
  stock: 25
};

CREATE product:2 CONTENT {
  name: "Souris sans fil",
  price: 49.99,
  category: "Peripheriques",
  stock: 50
};

CREATE product:3 CONTENT {
  name: "Ecran 27 pouces",
  price: 349.99,
  category: "Moniteurs",
  stock: 10
};

CREATE product:4 CONTENT {
  name: "Cable HDMI 2m",
  price: 12.99,
  category: "Accessoires",
  stock: 100
};

CREATE product:5 CONTENT {
  name: "Casque audio",
  price: 129.99,
  category: "Audio",
  stock: 30
};

-- ============================================
-- DONNEES DE TEST - Orders
-- ============================================

CREATE order:1 CONTENT {
  customer: customer:1,
  products: [
    { product: product:1, quantity: 1 },
    { product: product:2, quantity: 2 }
  ],
  status: "livree",
  date: "2025-01-15T10:30:00Z"
};

CREATE order:2 CONTENT {
  customer: customer:2,
  products: [
    { product: product:3, quantity: 1 },
    { product: product:4, quantity: 3 }
  ],
  status: "en cours",
  date: "2025-02-20T14:00:00Z"
};

CREATE order:3 CONTENT {
  customer: customer:1,
  products: [
    { product: product:5, quantity: 1 }
  ],
  status: "en cours",
  date: "2025-03-01T09:15:00Z"
};
