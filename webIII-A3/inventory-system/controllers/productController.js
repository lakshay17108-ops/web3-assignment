const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Escape user input before using it in a RegExp
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Only these fields may be used for sorting
const SORTABLE = ['name', 'price', 'quantity', 'category', 'createdAt', 'updatedAt'];

// POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// GET /api/products?category=&supplier=&minPrice=&maxPrice=&inStock=&search=&sort=&page=&limit=
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, supplier, minPrice, maxPrice, inStock, search, sort } = req.query;

  // ---- Filtering ----
  const filter = {};
  if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
  if (supplier) filter.supplier = new RegExp(escapeRegex(supplier), 'i');
  if (search) filter.name = new RegExp(escapeRegex(search), 'i');

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (inStock === 'true') filter.quantity = { $gt: 0 };
  if (inStock === 'false') filter.quantity = 0;

  // ---- Sorting: ?sort=price,-quantity  (prefix - means descending) ----
  let sortBy = { createdAt: -1 };
  if (sort) {
    sortBy = {};
    sort.split(',').forEach((s) => {
      const field = s.startsWith('-') ? s.slice(1) : s;
      if (SORTABLE.includes(field)) sortBy[field] = s.startsWith('-') ? -1 : 1;
    });
    if (Object.keys(sortBy).length === 0) sortBy = { createdAt: -1 };
  }

  // ---- Pagination ----
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).sort(sortBy).skip(skip).limit(limit),
  ]);

  res.json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    count: products.length,
    products,
  });
});

// GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError('Product not found', 404);
  res.json(product);
});

// PUT /api/products/:id  (update details)
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw httpError('Product not found', 404);
  res.json(product);
});

// PATCH /api/products/:id/stock   body: { "change": 10 } or { "change": -3 }
// Positive = restock, negative = sale. Done atomically with $inc so two
// simultaneous sales can never push stock below zero.
exports.adjustStock = asyncHandler(async (req, res) => {
  const change = req.body.change;

  if (typeof change !== 'number' || !Number.isInteger(change) || change === 0) {
    throw httpError("'change' must be a non-zero integer (positive = restock, negative = sale)", 400);
  }

  const product = await Product.findOneAndUpdate(
    // for a sale, only match if enough stock is available
    { _id: req.params.id, quantity: { $gte: change < 0 ? -change : 0 } },
    { $inc: { quantity: change } },
    { new: true, runValidators: true }
  );

  if (!product) {
    const exists = await Product.exists({ _id: req.params.id });
    if (!exists) throw httpError('Product not found', 404);
    throw httpError('Insufficient stock for this sale', 400);
  }

  res.json({ message: 'Stock updated', product });
});

// DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw httpError('Product not found', 404);
  res.json({ message: 'Product deleted', id: product.id });
});

// GET /api/products/low-stock   (quantity <= reorderLevel)
exports.getLowStock = asyncHandler(async (req, res) => {
  const lowStockItems = await Product.aggregate([
    { $match: { $expr: { $lte: ['$quantity', '$reorderLevel'] } } },
    { $sort: { quantity: 1 } },
  ]);

  // aggregate() returns plain objects, so add id/stockValue manually
  const items = lowStockItems.map((p) => ({
    ...p,
    stockValue: p.price * p.quantity,
    id: p._id.toString(),
  }));

  res.json({ count: items.length, lowStockItems: items });
});

// GET /api/products/summary   (category-wise aggregation)
exports.getCategorySummary = asyncHandler(async (req, res) => {
  const summary = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        totalItems: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { totalStockValue: -1 } },
  ]);

  res.json({ categories: summary.length, summary });
});
