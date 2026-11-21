// Run with: npm run seed  (clears the collection and inserts 12 sample products)
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const data = [
  { name: 'Study Table', sku: 'FURN-TB-812', category: 'Furniture', price: 3999, quantity: 2, reorderLevel: 4, supplier: 'IKEA India' },
  { name: 'Office Chair', sku: 'FURN-CH-101', category: 'Furniture', price: 5499, quantity: 15, reorderLevel: 5, supplier: 'Godrej Interio' },
  { name: 'Wireless Mouse', sku: 'ELEC-MS-201', category: 'Electronics', price: 799, quantity: 3, reorderLevel: 10, supplier: 'Logitech' },
  { name: 'Laptop 15 inch', sku: 'ELEC-LP-305', category: 'Electronics', price: 45999, quantity: 6, reorderLevel: 3, supplier: 'Dell India' },
  { name: 'Bluetooth Speaker', sku: 'ELEC-SP-410', category: 'Electronics', price: 2499, quantity: 40, reorderLevel: 8, supplier: 'boAt' },
  { name: 'Smartphone', sku: 'ELEC-PH-512', category: 'Electronics', price: 18999, quantity: 47, reorderLevel: 10, supplier: 'Samsung' },
  { name: 'Cotton T-Shirt', sku: 'APRL-TS-001', category: 'Apparel', price: 499, quantity: 60, reorderLevel: 20, supplier: 'Allen Solly' },
  { name: 'Denim Jacket', sku: 'APRL-JK-002', category: 'Apparel', price: 2299, quantity: 18, reorderLevel: 6, supplier: 'Levis' },
  { name: 'Gel Pen Pack of 15', sku: 'STNY-PN-713', category: 'Stationery', price: 120, quantity: 8, reorderLevel: 20, supplier: 'Cello Pens' },
  { name: 'A4 Notebook', sku: 'STNY-NB-714', category: 'Stationery', price: 90, quantity: 120, reorderLevel: 30, supplier: 'Classmate' },
  { name: 'Basmati Rice 5kg', sku: 'GROC-RC-901', category: 'Grocery', price: 650, quantity: 25, reorderLevel: 10, supplier: 'India Gate' },
  { name: 'Olive Oil 1L', sku: 'GROC-OL-902', category: 'Grocery', price: 899, quantity: 4, reorderLevel: 8, supplier: 'Figaro' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(data);
    console.log(`Seeded ${data.length} products`);
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
