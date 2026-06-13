const products = [
  {
    id: 'billing-suite',
    name: 'Billing Suite',
    price: 24000,
    description: 'Complete billing and invoicing software for small business clients.',
  },
  {
    id: 'inventory-pro',
    name: 'Inventory Pro',
    price: 18000,
    description: 'Track stock, manage suppliers, and connect purchases with sales.',
  },
  {
    id: 'tax-planner',
    name: 'Tax Planner',
    price: 22000,
    description: 'Automated tax calculations and filing-ready financial reports.',
  },
];

const purchases = [];
const sales = [];

function formatCurrency(value) {
  return `NPR ${value.toLocaleString('en-IN')}`;
}

function updateShop() {
  const productGrid = document.getElementById('productGrid');
  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>${formatCurrency(product.price)}</strong></p>
        <button class="button" onclick="recordSaleFromShop('${product.id}')">Sell License</button>
      </article>
    `
    )
    .join('');
}

function updateLedgerTables() {
  const purchaseTable = document.querySelector('#purchaseTable tbody');
  const salesTable = document.querySelector('#salesTable tbody');

  purchaseTable.innerHTML = purchases
    .map(
      (purchase) => `
      <tr>
        <td>${purchase.date}</td>
        <td>${purchase.vendor}</td>
        <td>${purchase.description}</td>
        <td>${formatCurrency(purchase.amount)}</td>
      </tr>
    `
    )
    .join('');

  salesTable.innerHTML = sales
    .map(
      (sale) => `
      <tr>
        <td>${sale.date}</td>
        <td>${sale.buyer}</td>
        <td>${sale.product}</td>
        <td>${formatCurrency(sale.amount)}</td>
      </tr>
    `
    .join('');
}

function updateAuditSummary() {
  const totalPurchases = purchases.reduce((sum, record) => sum + record.amount, 0);
  const totalSales = sales.reduce((sum, record) => sum + record.amount, 0);
  const netProfit = totalSales - totalPurchases;

  document.getElementById('totalSales').textContent = formatCurrency(totalSales);
  document.getElementById('totalPurchases').textContent = formatCurrency(totalPurchases);
  document.getElementById('netProfit').textContent = formatCurrency(netProfit);

  const auditNotes = document.getElementById('auditNotes');
  auditNotes.innerHTML = `
    <h3>Audit Notes</h3>
    <p>${sales.length} sale(s) and ${purchases.length} purchase(s) have been recorded.</p>
    <p>Net ${netProfit >= 0 ? 'profit' : 'loss'} of ${formatCurrency(Math.abs(netProfit))} is visible in the current reporting period.</p>
    <p>Review entries regularly to maintain clean financial records and support audits.</p>
  `;
}

function recordPurchase(event) {
  if (event) event.preventDefault();
  const vendor = document.getElementById('purchaseVendor').value.trim();
  const description = document.getElementById('purchaseItem').value.trim();
  const amount = Number(document.getElementById('purchaseAmount').value);
  const date = document.getElementById('purchaseDate').value;

  if (!vendor || !description || !amount || !date) return;

  purchases.unshift({ vendor, description, amount, date });
  document.getElementById('purchaseForm').reset();
  updateLedgerTables();
  updateAuditSummary();
}

function recordSale(event) {
  if (event) event.preventDefault();
  const buyer = document.getElementById('saleBuyer').value.trim();
  const product = document.getElementById('saleProduct').value.trim();
  const amount = Number(document.getElementById('saleAmount').value);
  const date = document.getElementById('saleDate').value;

  if (!buyer || !product || !amount || !date) return;

  sales.unshift({ buyer, product, amount, date });
  document.getElementById('salesForm').reset();
  updateLedgerTables();
  updateAuditSummary();
}

function recordSaleFromShop(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const buyer = prompt('Buyer name for this software sale:');
  const date = new Date().toISOString().slice(0, 10);
  if (!buyer) return;

  sales.unshift({ buyer, product: product.name, amount: product.price, date });
  updateLedgerTables();
  updateAuditSummary();
}

function setupForms() {
  const purchaseForm = document.getElementById('purchaseForm');
  const salesForm = document.getElementById('salesForm');
  purchaseForm.addEventListener('submit', recordPurchase);
  salesForm.addEventListener('submit', recordSale);
}

function init() {
  updateShop();
  setupForms();
  updateLedgerTables();
  updateAuditSummary();
}

document.addEventListener('DOMContentLoaded', init);
