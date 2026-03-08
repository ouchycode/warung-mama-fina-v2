export const products = [
  {
    id: "p1",
    name: "Beras Maknyuss 5kg",
    price: 75000,
    category: "Sembako",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "p2",
    name: "Indomie Goreng (Kardus)",
    price: 115000,
    category: "Makanan",
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "p3",
    name: "Aqua Galon 19L (Refill)",
    price: 20000,
    category: "Minuman",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "p4",
    name: "Telur Ayam 1kg",
    price: 28000,
    category: "Sembako",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "p5",
    name: "Minyak Goreng Bimoli 2L",
    price: 36000,
    category: "Sembako",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "p6",
    name: "Gas LPG 3kg (Refill)",
    price: 22000,
    category: "Kebutuhan",
    image:
      "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400",
  },
];

// Ekstrak semua kategori unik untuk jadi tombol filter
export const categories = [
  "Semua",
  ...Array.from(new Set(products.map((p) => p.category))),
];
