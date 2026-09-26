const STORAGE_KEY = 'retail-kasir-app-v1';
const USERS_KEY = 'retail-kasir-users-v1';
const CURRENT_USER_KEY = 'retail-kasir-current-user-v1';
const OPERATIONS_KEY = 'retail-kasir-operations-v1';

const defaultProducts = [
  { id: 1, code: 'P001', name: 'Shampoo Anti Ketombe', unit: 'PCS', category: 'Perawatan Rambut', buyPrice: 26000, sellPrice: 42000, stock: 18, minStock: 5, wholesalePrice: 39000, wholesaleQty: 6 },
  { id: 2, code: 'P002', name: 'Cream Conditioner', unit: 'PCS', category: 'Perawatan Rambut', buyPrice: 29000, sellPrice: 46000, stock: 12, minStock: 4, wholesalePrice: 43000, wholesaleQty: 6 },
  { id: 3, code: 'P003', name: 'Hair Serum', unit: 'PCS', category: 'Perawatan Rambut', buyPrice: 35000, sellPrice: 55000, stock: 10, minStock: 4, wholesalePrice: 51000, wholesaleQty: 6 },
  { id: 4, code: 'P004', name: 'Sampo Rambut', unit: 'PCS', category: 'Perawatan Rambut', buyPrice: 20000, sellPrice: 35000, stock: 20, minStock: 6, wholesalePrice: null, wholesaleQty: null }
];

const defaultUsers = [
  { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' },
  { username: 'manager', password: 'manager123', name: 'Manager Toko', role: 'manager' },
  { username: 'kasir', password: 'kasir123', name: 'Kasir 1', role: 'cashier' }
];

const permissionMap = {
  admin: ['kasir', 'master', 'purchase', 'report', 'sales-report', 'settings', 'operations'],
  manager: ['kasir', 'master', 'purchase', 'report', 'sales-report', 'operations'],
  cashier: ['kasir', 'report', 'sales-report', 'operations']
};

const defaultOperations = {
  cashierSession: null,
  cashOuts: [],
  allowCashOut: true,
  requireOpeningBalance: true,
  paymentMethods: ['Cash', 'Transfer', 'QRIS', 'Debit'],
  defaultPayment: 'Cash',
  taxPercent: 0,
  printerName: '',
  receiptStoreName: 'Retail Kasir',
  receiptStoreAddress: '',
  receiptFooter: 'Terima kasih sudah berbelanja.'
};

const state = {
  products: [],
  purchases: [],
  sales: [],
  cart: [],
  purchaseDraft: [],
  users: [],
  currentUser: null,
  operations: { ...defaultOperations }
};

let activeTab = 'kasir';
let selectedCartIndex = 0;

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});

const els = {
  noticePopup: document.getElementById('noticePopup'),
  noticeIcon: document.getElementById('noticeIcon'),
  noticeTitle: document.getElementById('noticeTitle'),
  noticeMessage: document.getElementById('noticeMessage'),
  closeNoticeBtn: document.getElementById('closeNoticeBtn'),
  adminEntryModal: document.getElementById('adminEntryModal'),
  adminOpenCashierBtn: document.getElementById('adminOpenCashierBtn'),
  adminOpenSettingsBtn: document.getElementById('adminOpenSettingsBtn'),
  loginScreen: document.getElementById('loginScreen'),
  appShell: document.getElementById('appShell'),
  loginForm: document.getElementById('loginForm'),
  logoutBtn: document.getElementById('logoutBtn'),
  loginUserBadge: document.getElementById('loginUserBadge'),
  tabs: document.querySelectorAll('.tab-btn'),
  panels: document.querySelectorAll('.tab-panel'),
  customerInput: document.getElementById('customerInput'),
  salesmanInput: document.getElementById('salesmanInput'),
  saleDateInput: document.getElementById('saleDateInput'),
  productSearch: document.getElementById('productSearch'),
  productSearchResults: document.getElementById('productSearchResults'),
  cartTableBody: document.getElementById('cartTableBody'),
  subtotalValue: document.getElementById('subtotalValue'),
  discountValue: document.getElementById('discountValue'),
  totalValue: document.getElementById('totalValue'),
  mainTotal: document.getElementById('mainTotal'),
  discountInput: document.getElementById('discountInput'),
  cashInput: document.getElementById('cashInput'),
  payButton: document.getElementById('payButton'),
  paymentModal: document.getElementById('paymentModal'),
  closePaymentModal: document.getElementById('closePaymentModal'),
  cancelPaymentBtn: document.getElementById('cancelPaymentBtn'),
  confirmPaymentBtn: document.getElementById('confirmPaymentBtn'),
  paymentMethodsList: document.getElementById('paymentMethodsList'),
  paymentSubtotalValue: document.getElementById('paymentSubtotalValue'),
  paymentDiscountValue: document.getElementById('paymentDiscountValue'),
  paymentTotalValue: document.getElementById('paymentTotalValue'),
  paymentChangeValue: document.getElementById('paymentChangeValue'),
  productForm: document.getElementById('productForm'),
  productTableBody: document.getElementById('productTableBody'),
  productUnit: document.getElementById('productUnit'),
  productCategory: document.getElementById('productCategory'),
  productWholesalePrice: document.getElementById('productWholesalePrice'),
  productWholesaleQty: document.getElementById('productWholesaleQty'),
  purchaseForm: document.getElementById('purchaseForm'),
  purchaseProductSelect: document.getElementById('purchaseProductSelect'),
  purchaseQty: document.getElementById('purchaseQty'),
  purchasePrice: document.getElementById('purchasePrice'),
  addPurchaseItemBtn: document.getElementById('addPurchaseItemBtn'),
  purchaseItemsList: document.getElementById('purchaseItemsList'),
  purchaseTableBody: document.getElementById('purchaseTableBody'),
  stockTableBody: document.getElementById('stockTableBody'),
  totalProductsMetric: document.getElementById('totalProductsMetric'),
  stockAvailableMetric: document.getElementById('stockAvailableMetric'),
  modalMetric: document.getElementById('modalMetric'),
  omsetMetric: document.getElementById('omsetMetric'),
  userForm: document.getElementById('userForm'),
  userUsername: document.getElementById('userUsername'),
  userName: document.getElementById('userName'),
  userPassword: document.getElementById('userPassword'),
  userRole: document.getElementById('userRole'),
  userTableBody: document.getElementById('userTableBody'),
  cancelUserEdit: document.getElementById('cancelUserEdit')
  ,salesReportStart: document.getElementById('salesReportStart')
  ,salesReportEnd: document.getElementById('salesReportEnd')
  ,applySalesReportBtn: document.getElementById('applySalesReportBtn')
  ,printSalesReportBtn: document.getElementById('printSalesReportBtn')
  ,salesCountMetric: document.getElementById('salesCountMetric')
  ,salesRevenueMetric: document.getElementById('salesRevenueMetric')
  ,salesDiscountMetric: document.getElementById('salesDiscountMetric')
  ,salesItemsMetric: document.getElementById('salesItemsMetric')
  ,salesReportTableBody: document.getElementById('salesReportTableBody')
  ,cashierSessionStatus: document.getElementById('cashierSessionStatus')
  ,cashierSessionForm: document.getElementById('cashierSessionForm')
  ,openingBalanceInput: document.getElementById('openingBalanceInput')
  ,closeCashierBtn: document.getElementById('closeCashierBtn')
  ,cashOutForm: document.getElementById('cashOutForm')
  ,cashOutNote: document.getElementById('cashOutNote')
  ,cashOutAmount: document.getElementById('cashOutAmount')
  ,cashOutList: document.getElementById('cashOutList')
  ,paymentSettingsForm: document.getElementById('paymentSettingsForm')
  ,paymentMethodsInput: document.getElementById('paymentMethodsInput')
  ,defaultPaymentSelect: document.getElementById('defaultPaymentSelect')
  ,taxPercentInput: document.getElementById('taxPercentInput')
  ,receiptSettingsForm: document.getElementById('receiptSettingsForm')
  ,printerNameInput: document.getElementById('printerNameInput')
  ,receiptStoreNameInput: document.getElementById('receiptStoreNameInput')
  ,receiptStoreAddressInput: document.getElementById('receiptStoreAddressInput')
  ,receiptFooterInput: document.getElementById('receiptFooterInput')
  ,testReceiptBtn: document.getElementById('testReceiptBtn')
  ,backupDataBtn: document.getElementById('backupDataBtn')
  ,restoreDataInput: document.getElementById('restoreDataInput')
  ,backupStatus: document.getElementById('backupStatus')
  ,salePaymentSelect: document.getElementById('salePaymentSelect')
  ,openCashierIcon: document.getElementById('openCashierIcon')
  ,cashOutIcon: document.getElementById('cashOutIcon')
  ,closeCashierIcon: document.getElementById('closeCashierIcon')
  ,cashierSessionBadge: document.getElementById('cashierSessionBadge')
  ,cashierActionModal: document.getElementById('cashierActionModal')
  ,closeCashierActionModal: document.getElementById('closeCashierActionModal')
  ,cashierActionTitle: document.getElementById('cashierActionTitle')
  ,cashierActionForm: document.getElementById('cashierActionForm')
  ,openingBalanceField: document.getElementById('openingBalanceField')
  ,openingBalanceInput: document.getElementById('openingBalanceInput')
  ,cashOutNoteField: document.getElementById('cashOutNoteField')
  ,cashOutNote: document.getElementById('cashOutNote')
  ,cashOutAmountField: document.getElementById('cashOutAmountField')
  ,cashOutAmount: document.getElementById('cashOutAmount')
  ,cashierActionSubmit: document.getElementById('cashierActionSubmit')
  ,cashierSettingsForm: document.getElementById('cashierSettingsForm')
  ,allowCashOutInput: document.getElementById('allowCashOutInput')
  ,requireOpeningBalanceInput: document.getElementById('requireOpeningBalanceInput')
  ,editQtyIcon: document.getElementById('editQtyIcon')
  ,editPriceIcon: document.getElementById('editPriceIcon')
  ,customerIcon: document.getElementById('customerIcon')
  ,newSaleIcon: document.getElementById('newSaleIcon')
  ,productImportInput: document.getElementById('productImportInput')
  ,openProductImportBtn: document.getElementById('openProductImportBtn')
  ,productImportModal: document.getElementById('productImportModal')
  ,closeProductImportBtn: document.getElementById('closeProductImportBtn')
  ,productDropZone: document.getElementById('productDropZone')
  ,productImportLoading: document.getElementById('productImportLoading')
  ,productImportHelp: document.getElementById('productImportHelp')
  ,downloadProductTemplateBtn: document.getElementById('downloadProductTemplateBtn')
  ,exportProductsBtn: document.getElementById('exportProductsBtn')
  ,cashierCloseModal: document.getElementById('cashierCloseModal')
  ,closeCashierSummaryBtn: document.getElementById('closeCashierSummaryBtn')
  ,cashierSummaryMetrics: document.getElementById('cashierSummaryMetrics')
  ,cashierPaymentSummary: document.getElementById('cashierPaymentSummary')
  ,cashierProductSummary: document.getElementById('cashierProductSummary')
  ,confirmCloseCashierBtn: document.getElementById('confirmCloseCashierBtn')
};

let noticeTimer;

function showNotice(message, type = 'warning', persistent = false) {
  const isSuccess = type === 'success';
  els.noticePopup.className = `notice-popup ${isSuccess ? 'success' : 'warning'}`;
  els.noticeIcon.textContent = isSuccess ? 'OK' : '!';
  els.noticeTitle.textContent = isSuccess ? 'Berhasil' : 'Perhatian';
  els.noticeMessage.textContent = message;
  clearTimeout(noticeTimer);
  if (!persistent) noticeTimer = setTimeout(() => els.noticePopup.classList.add('hidden'), 5000);
}

function hideNotice() {
  clearTimeout(noticeTimer);
  els.noticePopup.classList.add('hidden');
}

function nextSku() {
  const highest = state.products.reduce((max, product) => {
    const match = String(product.code || '').match(/(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `SKU-${String(highest + 1).padStart(4, '0')}`;
}

function nextInvoiceNumber() {
  const highest = state.purchases.reduce((max, purchase) => {
    const match = String(purchase.invoice || '').match(/(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `INV-${String(highest + 1).padStart(5, '0')}`;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    state.products = [...defaultProducts];
    state.purchases = [];
    state.sales = [];
    state.cart = [];
    state.purchaseDraft = [];
  } else {
    try {
      const parsed = JSON.parse(saved);
      state.products = parsed.products || [...defaultProducts];
      state.purchases = parsed.purchases || [];
      state.sales = parsed.sales || [];
      state.cart = parsed.cart || [];
      state.purchaseDraft = parsed.purchaseDraft || [];
    } catch (error) {
      state.products = [...defaultProducts];
      state.purchases = [];
      state.sales = [];
      state.cart = [];
      state.purchaseDraft = [];
    }
  }

  const userSaved = localStorage.getItem(USERS_KEY);
  if (!userSaved) {
    state.users = [...defaultUsers];
    localStorage.setItem(USERS_KEY, JSON.stringify(state.users));
  } else {
    try {
      state.users = JSON.parse(userSaved);
    } catch (error) {
      state.users = [...defaultUsers];
    }
  }

  const currentUserSaved = localStorage.getItem(CURRENT_USER_KEY);
  if (currentUserSaved) {
    try {
      state.currentUser = JSON.parse(currentUserSaved);
    } catch (error) {
      state.currentUser = null;
    }
  } else {
    state.currentUser = null;
  }

  const operationsSaved = localStorage.getItem(OPERATIONS_KEY);
  try {
    state.operations = { ...defaultOperations, ...(operationsSaved ? JSON.parse(operationsSaved) : {}) };
  } catch (error) {
    state.operations = { ...defaultOperations };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    products: state.products,
    purchases: state.purchases,
    sales: state.sales,
    cart: state.cart,
    purchaseDraft: state.purchaseDraft
  }));
}

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(state.users));
}

function saveCurrentUser() {
  if (state.currentUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(state.currentUser));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function saveOperations() {
  localStorage.setItem(OPERATIONS_KEY, JSON.stringify(state.operations));
}

function formatCurrency(value) {
  const amount = typeof value === 'string' ? parseMoney(value) : Number(value || 0);
  return currencyFormatter.format(amount);
}

function parseMoney(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

function formatMoneyValue(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.trunc(Math.max(0, amount)).toLocaleString('id-ID') : '';
}

function formatMoneyInput(input) {
  const caret = input.selectionStart ?? input.value.length;
  const digitsBeforeCaret = input.value.slice(0, caret).replace(/\D/g, '').length;
  const digits = input.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  input.value = formatted;

  let nextCaret = 0;
  let digitCount = 0;
  while (nextCaret < formatted.length && digitCount < digitsBeforeCaret) {
    if (/\d/.test(formatted[nextCaret])) digitCount += 1;
    nextCaret += 1;
  }
  input.setSelectionRange(nextCaret, nextCaret);
}

function ensureAccess(tabName) {
  if (!state.currentUser) return false;
  const allowed = permissionMap[state.currentUser.role] || [];
  return allowed.includes(tabName);
}

function setActiveTab(tabName) {
  if (!state.currentUser || !ensureAccess(tabName)) return;
  if (tabName === 'kasir' && ['admin', 'manager'].includes(state.currentUser.role) && !isCashierOpen()) {
    openCashierActionModal('open');
    return;
  }

  activeTab = tabName;
  els.tabs.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle('active', isActive);
  });

  els.panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === `${tabName}-panel`);
  });
}

function renderRoleTabs() {
  if (!state.currentUser) return;

  const allowed = permissionMap[state.currentUser.role] || [];
  els.tabs.forEach((button) => {
    const canAccess = allowed.includes(button.dataset.tab);
    button.disabled = !canAccess;
    button.style.display = canAccess ? 'inline-flex' : 'none';
  });

  const fallback = allowed[0] || 'kasir';
  if (!allowed.includes(activeTab)) {
    setActiveTab(fallback);
  }
}

function renderLoginState() {
  if (!state.currentUser) {
    els.adminEntryModal.classList.add('hidden');
    els.appShell.classList.add('hidden');
    els.loginScreen.classList.remove('hidden');
    els.loginUserBadge.textContent = 'Belum Login';
    return;
  }

  els.loginScreen.classList.add('hidden');
  els.appShell.classList.remove('hidden');
  els.loginUserBadge.textContent = `${state.currentUser.name} (${state.currentUser.role})`;
  els.salesmanInput.value = state.currentUser.name;
  renderRoleTabs();
  if (!isCashierOpen()) {
    if (state.currentUser.role === 'admin') {
      els.adminEntryModal.classList.remove('hidden');
    } else {
      openCashierActionModal('open');
    }
  }
}

function closeAdminEntryModal() {
  els.adminEntryModal.classList.add('hidden');
}

function isCashierOpen() {
  return Boolean(state.operations.cashierSession && state.operations.cashierSession.isOpen);
}

function getCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.sellPrice * item.qty), 0);
  const requestedDiscount = parseMoney(els.discountInput.value);
  const discount = Math.min(subtotal, Math.max(0, Number.isFinite(requestedDiscount) ? requestedDiscount : 0));
  const total = subtotal - discount;
  return { subtotal, discount, total };
}

function paymentMethodArtwork(method) {
  const name = method.toLowerCase();
  let artwork;

  if (/qris|qr/.test(name)) {
    artwork = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#e9f4ef"/><path d="M12 12h16v16H12zM36 12h16v16H36zM12 36h16v16H12z" fill="none" stroke="#217a55" stroke-width="5"/><path d="M37 37h5v5h-5zM47 37h5v5h-5zM37 47h5v5h-5zM47 47h5v5h-5z" fill="#217a55"/></svg>';
  } else if (/debit|kartu|card/.test(name)) {
    artwork = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#e8eff9"/><rect x="10" y="17" width="44" height="30" rx="5" fill="#fff" stroke="#315b91" stroke-width="3"/><path d="M11 26h42" stroke="#315b91" stroke-width="6"/><path d="M17 39h12" stroke="#315b91" stroke-width="3" stroke-linecap="round"/></svg>';
  } else if (/transfer|bank/.test(name)) {
    artwork = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#f1edf8"/><path d="M9 25 32 12l23 13H9Z" fill="#6e4c91"/><path d="M13 50h38M17 28v18m10-18v18m10-18v18m10-18v18" stroke="#6e4c91" stroke-width="4" stroke-linecap="round"/></svg>';
  } else if (/cash|tunai/.test(name)) {
    artwork = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#fff3dc"/><rect x="10" y="18" width="44" height="29" rx="4" fill="#2d9064"/><rect x="15" y="23" width="34" height="19" rx="2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="32" cy="32" r="7" fill="#fff"/><path d="M20 32h1m22 0h1" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>';
  } else {
    artwork = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#f0f1f2"/><path d="M13 23h38v27H13z" fill="#fff" stroke="#525d66" stroke-width="3"/><path d="M9 18h38v9H9z" fill="#f3a51c" stroke="#525d66" stroke-width="3"/><path d="M23 34h18" stroke="#525d66" stroke-width="3" stroke-linecap="round"/></svg>';
  }

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(artwork)}`;
}

function updatePaymentMethodSelection() {
  els.paymentMethodsList.querySelectorAll('[data-payment-method]').forEach((button) => {
    const isSelected = button.dataset.paymentMethod === els.salePaymentSelect.value;
    button.classList.toggle('active', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

function renderPaymentMethods() {
  const methods = state.operations.paymentMethods.length ? state.operations.paymentMethods : ['Cash'];
  const selectedMethod = methods.includes(els.salePaymentSelect.value)
    ? els.salePaymentSelect.value
    : (methods.includes(state.operations.defaultPayment) ? state.operations.defaultPayment : methods[0]);

  els.salePaymentSelect.replaceChildren(...methods.map((method) => {
    const option = document.createElement('option');
    option.value = method;
    option.textContent = method;
    return option;
  }));
  els.salePaymentSelect.value = selectedMethod;
  els.paymentMethodsList.replaceChildren(...methods.map((method) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'payment-method-option';
    button.dataset.paymentMethod = method;
    button.setAttribute('aria-pressed', String(method === selectedMethod));

    const image = document.createElement('img');
    image.src = paymentMethodArtwork(method);
    image.alt = '';
    const label = document.createElement('span');
    label.textContent = method;
    button.append(image, label);
    button.addEventListener('click', () => {
      els.salePaymentSelect.value = method;
      updatePaymentMethodSelection();
    });
    return button;
  }));
  updatePaymentMethodSelection();
}

function updatePaymentSummary() {
  const totals = getCartTotals();
  els.paymentSubtotalValue.textContent = formatCurrency(totals.subtotal);
  els.paymentDiscountValue.textContent = formatCurrency(totals.discount);
  els.paymentTotalValue.textContent = formatCurrency(totals.total);
  const paid = parseMoney(els.cashInput.value);
  els.paymentChangeValue.textContent = formatCurrency(Math.max(0, paid - totals.total));
}

function openPaymentModal() {
  if (!state.cart.length) {
    showNotice('Belum ada item yang dipilih.');
    return;
  }
  if (!isCashierOpen()) {
    openCashierActionModal('open');
    showNotice('Buka kasir terlebih dahulu sebelum memproses pembayaran.');
    return;
  }

  els.salePaymentSelect.value = state.operations.defaultPayment;
  renderPaymentMethods();
  updatePaymentSummary();
  els.paymentModal.classList.remove('hidden');
  els.cashInput.focus();
}

function closePaymentModal() {
  els.paymentModal.classList.add('hidden');
}

function renderProductSearchResults() {
  const query = (els.productSearch.value || '').trim().toLowerCase();
  if (!query) {
    els.productSearchResults.innerHTML = '';
    return;
  }

  const filtered = state.products.filter((product) => {
    return !query || product.code.toLowerCase().includes(query) || product.name.toLowerCase().includes(query);
  });

  if (!filtered.length) {
    els.productSearchResults.innerHTML = '<div class="empty-state">Tidak ada produk sesuai pencarian.</div>';
    return;
  }

  els.productSearchResults.innerHTML = filtered
    .map((product) => `
      <button class="search-item" data-product-id="${product.id}" type="button">
        <strong>${product.code}</strong>
        <span>${product.name}</span><br />
        <small>Stok: ${product.stock} | ${formatCurrency(product.sellPrice)}</small>
      </button>
    `)
    .join('');

  els.productSearchResults.querySelectorAll('.search-item').forEach((button) => {
    button.addEventListener('click', () => {
      const product = state.products.find((item) => item.id === Number(button.dataset.productId));
      if (product) addToCart(product);
    });
  });
}

function renderCart() {
  if (!state.cart.length) {
    els.cartTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">Belum ada item terpilih.</td>
      </tr>
    `;
  } else {
    els.cartTableBody.innerHTML = state.cart.map((item, index) => `
      <tr data-cart-index="${index}" class="${selectedCartIndex === index ? 'selected-cart-row' : ''}">
        <td>${index + 1}</td>
        <td>${item.code}</td>
        <td>${item.name}</td>
        <td>
          <div class="qty-control">
            <button type="button" data-action="decrease" data-index="${index}">-</button>
            <input class="inline-edit" type="number" min="1" value="${item.qty}" data-field="qty" data-index="${index}" aria-label="Qty ${item.name}" />
            <button type="button" data-action="increase" data-index="${index}">+</button>
          </div>
        </td>
        <td>${state.products.find((product) => product.id === item.id)?.unit || 'PCS'}</td>
        <td><input class="inline-edit price-edit money-input" type="text" inputmode="numeric" value="${formatMoneyValue(item.sellPrice)}" data-field="price" data-index="${index}" aria-label="Harga ${item.name}" /></td>
        <td>${item.discount || 0}%</td>
        <td>${formatCurrency(item.sellPrice * item.qty)}</td>
        <td><button type="button" class="delete-row" data-action="remove" data-index="${index}">X</button></td>
      </tr>
    `).join('');
  }

  els.cartTableBody.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const index = Number(button.dataset.index);
      if (action === 'increase') updateCartQty(index, 1);
      if (action === 'decrease') updateCartQty(index, -1);
      if (action === 'remove') removeCartItem(index);
    });
  });

  els.cartTableBody.querySelectorAll('.inline-edit').forEach((input) => {
    input.addEventListener('focus', () => { selectedCartIndex = Number(input.dataset.index); });
    input.addEventListener('change', () => {
      const index = Number(input.dataset.index);
      const item = state.cart[index];
      if (!item) return;
      const value = input.dataset.field === 'price' ? parseMoney(input.value) : Number(input.value);
      if (input.dataset.field === 'qty') {
        const product = state.products.find((entry) => entry.id === item.id);
        item.qty = Math.max(1, Math.min(value || 1, product ? product.stock : value || 1));
      } else {
        item.sellPrice = Math.max(0, value || 0);
      }
      selectedCartIndex = index;
      saveState();
      renderCart();
    });
  });

  els.cartTableBody.querySelectorAll('tr[data-cart-index]').forEach((row) => {
    row.addEventListener('click', () => { selectedCartIndex = Number(row.dataset.cartIndex); });
  });

  const totals = getCartTotals();
  els.subtotalValue.textContent = formatCurrency(totals.subtotal);
  els.discountValue.textContent = formatCurrency(totals.discount);
  els.totalValue.textContent = formatCurrency(totals.total);
  els.mainTotal.textContent = formatCurrency(totals.total);
  updatePaymentSummary();
}

function addToCart(product) {
  if (!state.currentUser) return;
  if (!isCashierOpen()) {
    openCashierActionModal('open');
    showNotice('Isi modal awal dan buka kasir terlebih dahulu.', 'warning', true);
    return;
  }
  if (product.stock <= 0) {
    showNotice('Stok produk habis.');
    return;
  }

  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
    if (existing.qty > product.stock) {
      existing.qty = product.stock;
      showNotice('Qty melebihi stok yang tersedia.');
    }
  } else {
    state.cart.push({
      id: product.id,
      code: product.code,
      name: product.name,
      qty: 1,
      sellPrice: product.sellPrice,
      discount: 0
    });
  }

  saveState();
  renderCart();
}

function updateCartQty(index, delta) {
  const target = state.cart[index];
  if (!target) return;

  const product = state.products.find((item) => item.id === target.id);
  const nextQty = target.qty + delta;

  if (nextQty <= 0) {
    state.cart.splice(index, 1);
  } else {
    if (product && nextQty > product.stock) {
      showNotice('Qty melebihi stok yang tersedia.');
      return;
    }
    target.qty = nextQty;
  }

  saveState();
  renderCart();
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  saveState();
  renderCart();
}

function renderProductTable() {
  if (!state.products.length) {
    els.productTableBody.innerHTML = '<tr><td colspan="10" class="empty-state">Belum ada produk.</td></tr>';
    return;
  }

  els.productTableBody.innerHTML = state.products.map((product) => `
    <tr>
      <td>${product.code}</td>
      <td>${product.name}</td>
      <td>${product.unit || 'PCS'}</td>
      <td>${product.category || '-'}</td>
      <td>${formatCurrency(product.buyPrice)}</td>
      <td>${formatCurrency(product.sellPrice)}</td>
      <td>${product.wholesalePrice ? `${formatCurrency(product.wholesalePrice)} / ${product.wholesaleQty || '-'} qty` : '-'}</td>
      <td>${product.stock}</td>
      <td>${product.minStock}</td>
      <td><button type="button" class="user-action-btn delete" data-delete-product="${product.id}">Hapus</button></td>
    </tr>
  `).join('');

  els.productTableBody.querySelectorAll('[data-delete-product]').forEach((button) => {
    button.addEventListener('click', () => deleteProduct(Number(button.dataset.deleteProduct)));
  });
}

function deleteProduct(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  state.products = state.products.filter((item) => item.id !== productId);
  state.cart = state.cart.filter((item) => item.id !== productId);
  saveState();
  renderAllDashboard();
  showNotice(`Produk ${product.name} berhasil dihapus.`, 'success');
}

function excelCell(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function downloadExcel(filename, headers, rows) {
  const tableRows = [headers, ...rows].map((row) => `<tr>${row.map((value) => `<td>${excelCell(value)}</td>`).join('')}</tr>`).join('');
  const html = `<html><head><meta charset="UTF-8"></head><body><table border="1">${tableRows}</table></body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function importProducts(file, companionFile = null) {
  try {
      const lowerName = file.name.toLowerCase();
      const rawData = lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx') ? await file.arrayBuffer() : await file.text();
      const companionText = companionFile ? await companionFile.text() : '';
      const parsed = lowerName.endsWith('.csv')
        ? parseProductCsv(String(rawData || ''))
        : lowerName.endsWith('.xls') || lowerName.endsWith('.xlsx')
          ? parseProductExcel(rawData, lowerName, companionText)
          : JSON.parse(String(rawData || ''));
      const imported = Array.isArray(parsed) ? parsed : parsed.products;
      if (!Array.isArray(imported)) throw new Error('Format produk tidak valid.');
      const failures = [];
      imported.forEach((item, index) => {
        const product = {
          id: item.id || Date.now() + Math.random(),
          code: String(item.code || item.sku || item['kode sku'] || nextSku()),
          name: String(item.name || item.nama || item.nama_produk || item['nama produk'] || '').trim(),
          unit: String(item.unit || item.satuan || item['satuan #1'] || 'PCS').trim() || 'PCS',
          category: String(item.category || item.kategori || '').trim(),
          buyPrice: Number(item.buyPrice ?? item.hargaBeli ?? item.harga_beli ?? item['harga modal #1'] ?? item['harga beli'] ?? 0),
          sellPrice: Number(item.sellPrice ?? item.hargaJual ?? item.harga_penjualan ?? item['harga jual #1'] ?? item['harga jual'] ?? 0),
          stock: Number(item.stock ?? item.stok ?? 0),
          minStock: Number(item.minStock ?? item.minimumStok ?? item.minimum_stok ?? item['stok minimum'] ?? item.min ?? 0),
          wholesalePrice: item.wholesalePrice !== undefined && item.wholesalePrice !== '' ? Number(item.wholesalePrice) : (item.hargaGrosir || item.harga_grosir || item['harga grosir'] || item.grosir ? parseWholesale(item.hargaGrosir || item.harga_grosir || item['harga grosir'] || item.grosir).price : null),
          wholesaleQty: item.wholesaleQty !== undefined && item.wholesaleQty !== '' ? Number(item.wholesaleQty) : (item.qtyGrosir || item.qty_grosir || item['qty grosir'] ? Number(item.qtyGrosir || item.qty_grosir || item['qty grosir']) : (item.grosir ? parseWholesale(item.grosir).qty : null))
        };
        if (!product.name) {
          failures.push({ item, message: `Baris ${index + 2}: Nama Produk wajib diisi.` });
          return;
        }
        if (!Number.isFinite(product.buyPrice) || product.buyPrice <= 0 || !Number.isFinite(product.sellPrice) || product.sellPrice <= 0) {
          failures.push({ item, message: `Baris ${index + 2}: Harga modal dan harga jual wajib berupa angka lebih dari 0.` });
          return;
        }
        const existing = state.products.find((entry) => entry.code.toLowerCase() === product.code.toLowerCase());
        if (existing) Object.assign(existing, product, { id: existing.id });
        else state.products.push(product);
      });
      saveState();
      renderAllDashboard();
      if (failures.length) {
        const failureHeaders = productCsvHeader().split(',');
        const failureRows = failures.map(({ item, message }) => [
          item.kode || item.code || item.sku || item['kode sku'] || '',
          item.nama || item['nama produk'] || item.nama_produk || item.name || '',
          item.satuan || item['satuan #1'] || '',
          item.kategori || item.category || '',
          item['harga beli'] || item['harga modal #1'] || item.harga_beli || '',
          item['harga jual'] || item['harga jual #1'] || item.harga_penjualan || '',
          item.grosir || item['harga grosir'] || '',
          item.stok || '',
          item.min || item['stok minimum'] || '',
          message
        ]);
        downloadExcel(`produk-gagal-${new Date().toISOString().slice(0, 10)}.xls`, failureHeaders, failureRows);
        showNotice(`${imported.length - failures.length} produk berhasil, ${failures.length} gagal. File detail gagal sudah diunduh.`);
      } else {
        showNotice(`${imported.length} produk berhasil diimpor.`, 'success');
      }
  } catch (error) {
    showNotice(`Impor produk gagal: ${error.message}`);
  }
}

function parseProductExcel(data, fileName, companionText = '') {
  if (companionText) {
    const companionParsed = parseProductExcelHtml(companionText);
    if (companionParsed) return companionParsed;
  }
  const textData = data instanceof ArrayBuffer ? new TextDecoder().decode(new Uint8Array(data)) : String(data || '');
  const htmlParsed = parseProductExcelHtml(textData);
  if (htmlParsed) return htmlParsed;
  if (window.XLSX && data instanceof ArrayBuffer) {
    try {
      const workbook = window.XLSX.read(data, { type: 'array' });
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        const parsed = parseSpreadsheetRows(rows);
        if (parsed) return parsed;
      }
    } catch (error) {
      // Continue to the clear format error below for unsupported binary files.
    }
  }

  throw new Error('File Excel tidak memiliki tabel produk. Pilih file .xlsx/.csv atau sertakan sheet001.htm untuk Excel lama.');
}

async function processImportFiles(fileList) {
  const files = [...fileList];
  const mainFile = files.find((file) => /\.(xlsx?|csv|json)$/i.test(file.name));
  const companionFile = files.find((file) => /sheet001\.htm(l)?$/i.test(file.name) || /_files[\\/]sheet001\.htm(l)?$/i.test(file.webkitRelativePath || ''));
  if (!mainFile) {
    showNotice('Pilih file Excel, CSV, atau JSON terlebih dahulu.');
    return;
  }
  els.productImportLoading.classList.remove('hidden');
  els.productImportHelp.textContent = 'Sedang membaca dan memvalidasi kolom produk...';
  try {
    await importProducts(mainFile, companionFile);
  } finally {
    els.productImportLoading.classList.add('hidden');
    els.productImportHelp.innerHTML = 'Untuk file Excel lama berbasis frameset, pilih juga file pendamping <strong>sheet001.htm</strong>.';
    els.productImportModal.classList.add('hidden');
  }
}

function parseProductExcelHtml(text) {
  const documentParser = new DOMParser().parseFromString(text, 'text/html');
  const rows = [...documentParser.querySelectorAll('tr')].map((row) => [...row.querySelectorAll('th,td')].map((cell) => cell.textContent.trim()));
  if (!rows.length) return null;
  const parsed = parseSpreadsheetRows(rows);
  return parsed || null;
}

function normalizeHeader(value) {
  return String(value || '').replace(/^\uFEFF/, '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseSpreadsheetRows(rows) {
  const headerIndex = rows.findIndex((row) => row.some((cell) => {
    const header = normalizeHeader(cell);
    return header === 'kode' || header === 'nama' || header === 'kode sku' || header === 'nama produk' || header.includes('nama produk');
  }));
  if (headerIndex < 0) return null;
  const headers = rows[headerIndex].map(normalizeHeader);
  return rows.slice(headerIndex + 1).filter((row) => row.some((cell) => String(cell).trim())).map((row) => headers.reduce((record, header, index) => {
    record[header] = row[index] === undefined ? '' : row[index];
    return record;
  }, {}));
}

function parseProductCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headerIndex = lines.findIndex((line) => /nama produk|nama_produk|(^|,)nama(,|$)|(^|,)kode(,|$)/i.test(line));
  if (headerIndex < 0) throw new Error('Header KODE/NAMA tidak ditemukan.');
  const [headerLine, ...rows] = lines.slice(headerIndex);
  const headers = headerLine.split(',').map((header) => header.trim().toLowerCase());
  return rows.filter(Boolean).map((row) => {
    const values = row.split(',').map((value) => value.trim());
    return headers.reduce((record, header, index) => {
      record[header] = values[index] || '';
      return record;
    }, {});
  });
}

function renderPurchaseProductOptions() {
  els.purchaseProductSelect.innerHTML = state.products.map((product) => `
    <option value="${product.id}">${product.code} - ${product.name}</option>
  `).join('');

  if (state.products.length) {
    const product = state.products[0];
    els.purchasePrice.value = formatMoneyValue(product.buyPrice);
  }
}

function setNextInvoiceNumber() {
  document.getElementById('purchaseInvoice').value = nextInvoiceNumber();
}

function addPurchaseItemDraft() {
  const productId = Number(els.purchaseProductSelect.value);
  const qty = Number(els.purchaseQty.value || 0);
  const buyPrice = parseMoney(els.purchasePrice.value);

  if (!productId || qty <= 0 || buyPrice <= 0) {
    showNotice('Isi qty dan harga beli dengan benar.');
    return;
  }

  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  state.purchaseDraft.push({
    productId,
    productName: product.name,
    qty,
    buyPrice
  });

  els.purchaseQty.value = 1;
  els.purchasePrice.value = formatMoneyValue(product.buyPrice);
  renderPurchaseItems();
}

function renderPurchaseItems() {
  if (!state.purchaseDraft.length) {
    els.purchaseItemsList.innerHTML = '<div class="empty-state">Belum ada item pembelian.</div>';
    return;
  }

  els.purchaseItemsList.innerHTML = state.purchaseDraft.map((item, index) => `
    <div class="purchase-item">
      <span>${item.productName}</span>
      <span>${item.qty} qty</span>
      <span>${formatCurrency(item.buyPrice)}</span>
      <button type="button" data-index="${index}">X</button>
    </div>
  `).join('');

  els.purchaseItemsList.querySelectorAll('button[data-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index);
      state.purchaseDraft.splice(index, 1);
      renderPurchaseItems();
    });
  });
}

function renderPurchaseTable() {
  if (!state.purchases.length) {
    els.purchaseTableBody.innerHTML = '<tr><td colspan="5" class="empty-state">Belum ada riwayat pembelian.</td></tr>';
    return;
  }

  els.purchaseTableBody.innerHTML = state.purchases.map((purchase) => `
    <tr>
      <td>${purchase.invoice}</td>
      <td>${purchase.supplier}</td>
      <td>${purchase.date}</td>
      <td>${purchase.status}</td>
      <td>${formatCurrency(purchase.total)}</td>
    </tr>
  `).join('');
}

function renderStockReport() {
  const totalProducts = state.products.length;
  const totalStock = state.products.reduce((sum, product) => sum + product.stock, 0);
  const totalModal = state.products.reduce((sum, product) => sum + (product.buyPrice * product.stock), 0);
  const omsetPotential = state.products.reduce((sum, product) => sum + (product.sellPrice * product.stock), 0);

  els.totalProductsMetric.textContent = String(totalProducts);
  els.stockAvailableMetric.textContent = String(totalStock);
  els.modalMetric.textContent = formatCurrency(totalModal);
  els.omsetMetric.textContent = formatCurrency(omsetPotential);

  els.stockTableBody.innerHTML = state.products.map((product) => {
    const modalStock = product.buyPrice * product.stock;
    const omsetStock = product.sellPrice * product.stock;
    return `
      <tr>
        <td>${product.code}</td>
        <td>${product.name}</td>
        <td>${product.stock}</td>
        <td>${product.minStock}</td>
        <td>${formatCurrency(modalStock)}</td>
        <td>${formatCurrency(omsetStock)}</td>
      </tr>
    `;
  }).join('');
}

function renderSalesReport() {
  const start = els.salesReportStart.value;
  const end = els.salesReportEnd.value;
  const filtered = state.sales.filter((sale) => (!start || sale.date >= start) && (!end || sale.date <= end));
  const totalRevenue = filtered.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const totalDiscount = filtered.reduce((sum, sale) => sum + Number(sale.discount || 0), 0);
  const totalItems = filtered.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + Number(item.qty || 0), 0), 0);

  els.salesCountMetric.textContent = String(filtered.length);
  els.salesRevenueMetric.textContent = formatCurrency(totalRevenue);
  els.salesDiscountMetric.textContent = formatCurrency(totalDiscount);
  els.salesItemsMetric.textContent = String(totalItems);
  els.salesReportTableBody.innerHTML = filtered.length ? filtered.map((sale) => `
    <tr>
      <td>${sale.date}</td>
      <td>${sale.customer}</td>
      <td>${sale.cashierName || '-'}</td>
      <td>${sale.items.reduce((sum, item) => sum + item.qty, 0)}</td>
      <td>${formatCurrency(sale.total)}</td>
      <td>${formatCurrency(sale.cash)}</td>
      <td>${formatCurrency(sale.change)}</td>
    </tr>
  `).join('') : '<tr><td colspan="7" class="empty-state">Tidak ada transaksi pada periode ini.</td></tr>';
}

function renderOperations() {
  const session = state.operations.cashierSession;
  els.paymentMethodsInput.value = state.operations.paymentMethods.join(', ');
  els.defaultPaymentSelect.innerHTML = state.operations.paymentMethods.map((method) => `<option value="${method}">${method}</option>`).join('');
  els.defaultPaymentSelect.value = state.operations.defaultPayment;
  renderPaymentMethods();
  els.taxPercentInput.value = state.operations.taxPercent;
  els.printerNameInput.value = state.operations.printerName;
  els.receiptStoreNameInput.value = state.operations.receiptStoreName;
  els.receiptStoreAddressInput.value = state.operations.receiptStoreAddress;
  els.receiptFooterInput.value = state.operations.receiptFooter;
  els.allowCashOutInput.checked = state.operations.allowCashOut;
  els.requireOpeningBalanceInput.checked = state.operations.requireOpeningBalance;
  els.cashOutIcon.disabled = !state.operations.allowCashOut;
  els.cashierSessionBadge.textContent = session && session.isOpen
    ? `Kasir terbuka | Modal awal ${formatCurrency(session.openingBalance)}`
    : 'Kasir belum dibuka. Klik ikon Buka Kasir untuk memulai.';
  els.closeCashierIcon.disabled = !session || !session.isOpen;
}

function openCashierActionModal(mode) {
  if (mode === 'cash-out' && !state.operations.allowCashOut) {
    showNotice('Kas keluar sedang dinonaktifkan pada Pengaturan Operasional.');
    return;
  }
  if (mode === 'cash-out' && !isCashierOpen()) {
    showNotice('Buka kasir terlebih dahulu.');
    return;
  }
  if (mode === 'close') {
    closeCashier();
    return;
  }
  const isCashOut = mode === 'cash-out';
  els.cashierActionModal.dataset.mode = mode;
  els.cashierActionTitle.textContent = isCashOut ? 'Kas Keluar' : 'Buka Kasir';
  els.openingBalanceField.classList.toggle('hidden', isCashOut);
  els.cashOutNoteField.classList.toggle('hidden', !isCashOut);
  els.cashOutAmountField.classList.toggle('hidden', !isCashOut);
  els.cashierActionSubmit.textContent = isCashOut ? 'Simpan Kas Keluar' : 'Buka Kasir';
  els.cashierActionForm.reset();
  els.cashierActionModal.classList.remove('hidden');
}

function renderCashierCloseSummary() {
  const sales = state.sales.filter((sale) => !sale.cashierName || sale.cashierName === state.currentUser.name);
  const paymentTotals = {};
  const productTotals = {};
  let revenue = 0;
  let itemCount = 0;

  sales.forEach((sale) => {
    const payment = sale.paymentMethod || 'Cash';
    paymentTotals[payment] = (paymentTotals[payment] || 0) + Number(sale.total || 0);
    revenue += Number(sale.total || 0);
    sale.items.forEach((item) => {
      productTotals[item.name] = (productTotals[item.name] || 0) + Number(item.qty || 0);
      itemCount += Number(item.qty || 0);
    });
  });

  els.cashierSummaryMetrics.innerHTML = `
    <div class="metric-box"><span>Transaksi</span><strong>${sales.length}</strong></div>
    <div class="metric-box"><span>Total Penjualan</span><strong>${formatCurrency(revenue)}</strong></div>
    <div class="metric-box"><span>Total Qty Terjual</span><strong>${itemCount}</strong></div>
  `;
  els.cashierPaymentSummary.innerHTML = Object.keys(paymentTotals).length
    ? Object.entries(paymentTotals).map(([method, total]) => `<div class="summary-row"><span>${method}</span><strong>${formatCurrency(total)}</strong></div>`).join('')
    : '<div class="empty-state">Belum ada penjualan.</div>';
  els.cashierProductSummary.innerHTML = Object.keys(productTotals).length
    ? Object.entries(productTotals).map(([name, qty]) => `<div class="cash-out-row"><span>${name}</span><strong>${qty} qty</strong></div>`).join('')
    : '<div class="empty-state">Belum ada produk terjual.</div>';
}

function closeCashierActionModal() {
  els.cashierActionModal.classList.add('hidden');
}

function handleCashierAction(event) {
  event.preventDefault();
  const mode = els.cashierActionModal.dataset.mode;
  if (mode === 'cash-out') {
    state.operations.cashOuts.push({ note: els.cashOutNote.value.trim(), amount: parseMoney(els.cashOutAmount.value), date: new Date().toLocaleString('id-ID'), user: state.currentUser.username });
    saveOperations();
  } else {
    if (isCashierOpen()) {
      showNotice('Kasir sudah dalam kondisi terbuka.');
      return;
    }
    const rawOpeningBalance = els.openingBalanceInput.value.trim();
    const openingBalance = parseMoney(rawOpeningBalance);
    if (state.operations.requireOpeningBalance && rawOpeningBalance === '') {
      showNotice('Modal awal wajib diisi.');
      return;
    }
    state.operations.cashierSession = { isOpen: true, openedAt: new Date().toLocaleString('id-ID'), openingBalance, openedBy: state.currentUser.username };
    saveOperations();
  }
  closeCashierActionModal();
  hideNotice();
  renderOperations();
}

function saveCashierSettings(event) {
  event.preventDefault();
  state.operations.allowCashOut = els.allowCashOutInput.checked;
  state.operations.requireOpeningBalance = els.requireOpeningBalanceInput.checked;
  saveOperations();
  renderOperations();
}

function getBackupPayload() {
  return {
    app: 'Retail Kasir',
    version: 2,
    exportedAt: new Date().toISOString(),
    data: {
      products: state.products,
      purchases: state.purchases,
      sales: state.sales,
      cart: state.cart,
      purchaseDraft: state.purchaseDraft,
      users: state.users,
      operations: state.operations
    }
  };
}

function downloadBackup() {
  const blob = new Blob([JSON.stringify(getBackupPayload(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `backup-retail-kasir-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  els.backupStatus.textContent = 'Backup berhasil dibuat.';
}

function restoreBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      const data = payload.data || payload;
      if (!Array.isArray(data.products) || !Array.isArray(data.sales) || !Array.isArray(data.users)) throw new Error('Format backup tidak valid.');
      state.products = data.products;
      state.purchases = data.purchases || [];
      state.sales = data.sales;
      state.cart = data.cart || [];
      state.purchaseDraft = data.purchaseDraft || [];
      state.users = data.users;
      state.operations = { ...defaultOperations, ...(data.operations || {}) };
      saveState();
      saveUsers();
      saveOperations();
      renderAllDashboard();
      els.backupStatus.textContent = 'Restore berhasil. Data aplikasi sudah diperbarui.';
    } catch (error) {
      els.backupStatus.textContent = `Restore gagal: ${error.message}`;
    }
  };
  reader.readAsText(file);
}

function openCashier(event) {
  event.preventDefault();
  if (isCashierOpen()) {
    showNotice('Kasir sudah dalam kondisi terbuka.');
    return;
  }
  state.operations.cashierSession = {
    isOpen: true,
    openedAt: new Date().toLocaleString('id-ID'),
    openingBalance: parseMoney(els.openingBalanceInput.value),
    openedBy: state.currentUser.username
  };
  saveOperations();
  renderOperations();
}

function closeCashier() {
  if (!isCashierOpen()) return;
  renderCashierCloseSummary();
  els.cashierCloseModal.classList.remove('hidden');
}

function confirmCloseCashier() {
  if (!isCashierOpen()) return;
  const salesTotal = state.sales.filter((sale) => sale.cashierName === state.currentUser.name).reduce((sum, sale) => sum + sale.cash, 0);
  const cashOutTotal = state.operations.cashOuts.reduce((sum, item) => sum + item.amount, 0);
  const expected = state.operations.cashierSession.openingBalance + salesTotal - cashOutTotal;
  showNotice(`Kasir ditutup. Perkiraan kas akhir: ${formatCurrency(expected)}`, 'success');
  state.operations.cashierSession = { ...state.operations.cashierSession, isOpen: false, closedAt: new Date().toLocaleString('id-ID'), closingBalance: expected };
  saveOperations();
  els.cashierCloseModal.classList.add('hidden');
  renderOperations();
}

function downloadProductTemplate() {
  const headers = productCsvHeader().split(',');
  downloadExcel('template-produk.xls', headers, [[
    'SKU-0001', 'Larutan', 'botol', 'Minuman sehat', 4500, 7500, 'Rp 7.000 / 100 qty', 0, 5, ''
  ]]);
  showNotice('Template produk berhasil diunduh.', 'success');
}

function productCsvHeader() {
  return 'KODE,NAMA,SATUAN,KATEGORI,HARGA BELI,HARGA JUAL,GROSIR,STOK,MIN,NOTIFIKASI';
}

function parseWholesale(value) {
  const text = String(value || '').replace(/rp\.?/i, '').replace(/\./g, '').trim();
  const parts = text.split('/').map((part) => part.trim());
  return {
    price: Number((parts[0] || '').replace(/[^\d]/g, '')) || null,
    qty: Number((parts[1] || '').replace(/[^\d]/g, '')) || null
  };
}

function csvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportProducts() {
  const rows = state.products.map((product) => [
    product.code,
    product.name,
    product.unit || 'PCS',
    product.category || '',
    product.buyPrice || 0,
    product.sellPrice || 0,
    product.wholesalePrice ? `${formatCurrency(product.wholesalePrice)} / ${product.wholesaleQty || 0} qty` : '',
    product.stock || 0,
    product.minStock || 0,
    ''
  ]);
  downloadExcel(`produk-${new Date().toISOString().slice(0, 10)}.xls`, productCsvHeader().split(','), rows);
  showNotice('Data produk berhasil diekspor per kolom.', 'success');
}

function addCashOut(event) {
  event.preventDefault();
  if (!isCashierOpen()) {
    showNotice('Buka kasir terlebih dahulu.');
    return;
  }
  state.operations.cashOuts.push({ note: els.cashOutNote.value.trim(), amount: parseMoney(els.cashOutAmount.value), date: new Date().toLocaleString('id-ID'), user: state.currentUser.username });
  saveOperations();
  els.cashOutForm.reset();
  renderOperations();
}

function savePaymentSettings(event) {
  event.preventDefault();
  const methods = els.paymentMethodsInput.value.split(',').map((item) => item.trim()).filter(Boolean);
  state.operations.paymentMethods = methods.length ? methods : ['Cash'];
  state.operations.defaultPayment = els.defaultPaymentSelect.value || state.operations.paymentMethods[0];
  state.operations.taxPercent = Number(els.taxPercentInput.value || 0);
  saveOperations();
  renderOperations();
}

function saveReceiptSettings(event) {
  event.preventDefault();
  state.operations.printerName = els.printerNameInput.value.trim();
  state.operations.receiptStoreName = els.receiptStoreNameInput.value.trim() || 'Retail Kasir';
  state.operations.receiptStoreAddress = els.receiptStoreAddressInput.value.trim();
  state.operations.receiptFooter = els.receiptFooterInput.value.trim();
  saveOperations();
  renderOperations();
}

function printReceipt() {
  const totals = getCartTotals();
  const receipt = window.open('', '_blank', 'width=420,height=640');
  if (!receipt) return;
  receipt.document.write(`<html><head><title>Struk ${state.operations.printerName || ''}</title><style>body{font-family:monospace;width:280px;margin:20px auto}h2{text-align:center;margin:0}p{margin:4px 0}.line{border-top:1px dashed #000;margin:10px 0}.total{font-weight:bold}</style></head><body><h2>${state.operations.receiptStoreName}</h2><p>${state.operations.receiptStoreAddress}</p><div class="line"></div>${state.cart.map((item) => `<p>${item.name}<br>${item.qty} x ${formatCurrency(item.sellPrice)} = ${formatCurrency(item.qty * item.sellPrice)}</p>`).join('')}<div class="line"></div><p class="total">TOTAL: ${formatCurrency(totals.total)}</p><p>Bayar: ${formatCurrency(els.cashInput.value)}</p><p>${state.operations.receiptFooter}</p></body></html>`);
  receipt.document.close();
  receipt.focus();
  receipt.print();
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const user = state.users.find((item) => item.username === username && item.password === password);
  if (!user) {
    showNotice('Username atau password salah.');
    return;
  }

  state.currentUser = { username: user.username, name: user.name, role: user.role };
  saveCurrentUser();
  renderLoginState();
  renderAllDashboard();
  els.loginForm.reset();
}

function logout() {
  state.currentUser = null;
  saveCurrentUser();
  renderLoginState();
  els.loginForm.reset();
}

function handleProductSubmit(event) {
  event.preventDefault();
  if (!ensureAccess('master')) {
    showNotice('Akses ditolak. Hanya admin/manager yang dapat mengelola produk.');
    return;
  }

  const product = {
    id: Date.now(),
    code: document.getElementById('productCode').value.trim() || nextSku(),
    name: document.getElementById('productName').value.trim(),
    unit: els.productUnit.value.trim() || 'PCS',
    category: els.productCategory.value.trim(),
    buyPrice: parseMoney(document.getElementById('productBuyPrice').value),
    sellPrice: parseMoney(document.getElementById('productSellPrice').value),
    stock: Number(document.getElementById('productStock').value || 0),
    minStock: Number(document.getElementById('productMinStock').value || 0),
    wholesalePrice: els.productWholesalePrice.value ? parseMoney(els.productWholesalePrice.value) : null,
    wholesaleQty: els.productWholesaleQty.value ? Number(els.productWholesaleQty.value) : null
  };

  if (!product.code || !product.name || !product.buyPrice || !product.sellPrice) {
    showNotice('Lengkapi data produk terlebih dahulu.');
    return;
  }

  const existing = state.products.find((item) => item.code.toLowerCase() === product.code.toLowerCase());
  if (existing) {
    Object.assign(existing, product, { id: existing.id });
  } else {
    state.products.push(product);
  }

  saveState();
  renderAllDashboard();
  event.target.reset();
}

function handlePurchaseSubmit(event) {
  event.preventDefault();
  if (!ensureAccess('purchase')) {
    showNotice('Akses ditolak. Hanya admin/manager yang dapat mengelola pembelian.');
    return;
  }

  if (!state.purchaseDraft.length) {
    showNotice('Tidak ada item pembelian.');
    return;
  }

  const invoice = document.getElementById('purchaseInvoice').value.trim() || nextInvoiceNumber();
  const supplier = document.getElementById('purchaseSupplier').value.trim();
  const date = document.getElementById('purchaseDate').value;
  const status = document.getElementById('purchaseStatus').value;

  if (!invoice || !supplier || !date) {
    showNotice('Lengkapi data faktur pembelian.');
    return;
  }

  const total = state.purchaseDraft.reduce((sum, item) => sum + (item.buyPrice * item.qty), 0);

  state.purchaseDraft.forEach((item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (!product) return;
    product.stock += item.qty;
    product.buyPrice = item.buyPrice;
  });

  state.purchases.push({
    invoice,
    supplier,
    date,
    status,
    total,
    items: [...state.purchaseDraft]
  });

  state.purchaseDraft = [];
  saveState();
  renderAllDashboard();
  event.target.reset();
  setNextInvoiceNumber();
}

function processSale() {
  const customer = els.customerInput.value.trim() || 'CASH';
  const cash = parseMoney(els.cashInput.value);
  const totals = getCartTotals();

  if (!state.currentUser) return;
  if (!ensureAccess('kasir')) {
    showNotice('Akses ditolak untuk transaksi kasir.');
    return;
  }

  if (!isCashierOpen()) {
    showNotice('Buka kasir dan isi modal awal terlebih dahulu.', 'warning', true);
    return;
  }

  if (!state.cart.length) {
    showNotice('Belum ada item yang dipilih.');
    return;
  }

  if (cash < totals.total) {
    showNotice('Uang tunai belum mencukupi.');
    return;
  }

  const saleItems = state.cart.map((item) => {
    const product = state.products.find((entry) => entry.id === item.id);
    if (!product) return null;

    if (item.qty > product.stock) {
      throw new Error(`Stok ${product.name} tidak cukup.`);
    }

    product.stock -= item.qty;
    return {
      productId: item.id,
      code: item.code,
      name: item.name,
      qty: item.qty,
      sellPrice: item.sellPrice
    };
  }).filter(Boolean);

  const saleRecord = {
    id: Date.now(),
    customer,
    date: els.saleDateInput.value || new Date().toISOString().slice(0, 10),
    items: saleItems,
    subtotal: totals.subtotal,
    discount: totals.discount,
    total: totals.total,
    cash,
    change: cash - totals.total,
    cashierName: state.currentUser.name,
    paymentMethod: els.salePaymentSelect.value || state.operations.defaultPayment
  };

  state.sales.push(saleRecord);
  state.cart = [];
  els.discountInput.value = 0;
  els.cashInput.value = '';
  saveState();
  closePaymentModal();
  renderAllDashboard();
  showNotice(`Transaksi berhasil disimpan. Kembalian: ${formatCurrency(saleRecord.change)}`, 'success');
}

function editSelectedQty() {
  const item = state.cart[selectedCartIndex];
  if (!item) {
    showNotice('Pilih item pada ringkasan terlebih dahulu.');
    return;
  }
  const input = els.cartTableBody.querySelector(`input[data-field="qty"][data-index="${selectedCartIndex}"]`);
  if (input) {
    input.focus();
    input.select();
  }
}

function editSelectedPrice() {
  const item = state.cart[selectedCartIndex];
  if (!item) {
    showNotice('Pilih item pada ringkasan terlebih dahulu.');
    return;
  }
  const input = els.cartTableBody.querySelector(`input[data-field="price"][data-index="${selectedCartIndex}"]`);
  if (input) {
    input.focus();
    input.select();
  }
}

function editCustomer() {
  els.customerInput.focus();
  els.customerInput.select();
}

function startNewSale() {
  state.cart = [];
  els.discountInput.value = 0;
  els.cashInput.value = '';
  els.customerInput.value = 'CASH';
  els.productSearch.value = '';
  selectedCartIndex = 0;
  saveState();
  renderCart();
  renderProductSearchResults();
}

function openSalesHistory() {
  setActiveTab('sales-report');
  renderSalesReport();
  els.salesReportStart.focus();
}

function renderUserTable() {
  if (!state.users.length) {
    els.userTableBody.innerHTML = '<tr><td colspan="4" class="empty-state">Tidak ada user.</td></tr>';
    return;
  }

  els.userTableBody.innerHTML = state.users.map((user) => `
    <tr>
      <td>${user.username}</td>
      <td>${user.name}</td>
      <td>${user.role}</td>
      <td>
        <button type="button" class="user-action-btn edit" data-action="edit" data-username="${user.username}">Edit</button>
        <button type="button" class="user-action-btn delete" data-action="delete" data-username="${user.username}">Hapus</button>
      </td>
    </tr>
  `).join('');

  els.userTableBody.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const username = button.dataset.username;
      const action = button.dataset.action;
      if (action === 'edit') {
        const target = state.users.find((user) => user.username === username);
        if (!target) return;
        els.userUsername.value = target.username;
        els.userName.value = target.name;
        els.userPassword.value = '';
        els.userRole.value = target.role;
        els.userUsername.readOnly = true;
      }

      if (action === 'delete') {
        deleteUser(username);
      }
    });
  });
}

function deleteUser(username) {
  if (!ensureAccess('settings')) {
    showNotice('Akses ditolak. Hanya admin yang dapat mengatur user.');
    return;
  }

  if (state.currentUser && state.currentUser.username === username) {
    showNotice('Tidak dapat menghapus user yang sedang login.');
    return;
  }

  const user = state.users.find((item) => item.username === username);
  if (!user) return;

  const adminCount = state.users.filter((item) => item.role === 'admin').length;
  if (user.role === 'admin' && adminCount <= 1) {
    showNotice('Minimal harus ada satu admin.');
    return;
  }

  state.users = state.users.filter((item) => item.username !== username);
  saveUsers();
  renderUserTable();
  els.userForm.reset();
  els.userUsername.readOnly = false;
}

function handleUserSubmit(event) {
  event.preventDefault();
  if (!ensureAccess('settings')) {
    showNotice('Akses ditolak. Hanya admin yang dapat mengatur user.');
    return;
  }

  const username = els.userUsername.value.trim().toLowerCase();
  const name = els.userName.value.trim();
  const password = els.userPassword.value.trim();
  const role = els.userRole.value;

  if (!username || !name || !role) {
    showNotice('Lengkapi data user.');
    return;
  }

  const existing = state.users.find((user) => user.username === username);
  if (existing) {
    existing.name = name;
    existing.role = role;
    if (password) existing.password = password;
  } else {
    state.users.push({ username, name, password: password || '123456', role });
  }

  saveUsers();
  renderUserTable();
  els.userForm.reset();
  els.userUsername.readOnly = false;
}

function bindEvents() {
  els.closeNoticeBtn.addEventListener('click', () => {
    clearTimeout(noticeTimer);
    els.noticePopup.classList.add('hidden');
  });
  els.adminOpenCashierBtn.addEventListener('click', () => {
    closeAdminEntryModal();
    openCashierActionModal('open');
  });
  els.adminOpenSettingsBtn.addEventListener('click', () => {
    closeAdminEntryModal();
    setActiveTab('operations');
  });

  els.tabs.forEach((button) => {
    button.addEventListener('click', () => setActiveTab(button.dataset.tab));
  });

  document.addEventListener('input', (event) => {
    if (event.target.matches('.money-input')) formatMoneyInput(event.target);
  });

  els.productSearch.addEventListener('input', renderProductSearchResults);

  els.discountInput.addEventListener('input', () => {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.sellPrice * item.qty), 0);
    const value = parseMoney(els.discountInput.value);
    if (value < 0) els.discountInput.value = 0;
    if (value > subtotal) els.discountInput.value = subtotal;
    renderCart();
  });

  els.payButton.addEventListener('click', openPaymentModal);
  els.confirmPaymentBtn.addEventListener('click', processSale);
  els.closePaymentModal.addEventListener('click', closePaymentModal);
  els.cancelPaymentBtn.addEventListener('click', closePaymentModal);
  els.cashInput.addEventListener('input', updatePaymentSummary);
  els.editQtyIcon.addEventListener('click', editSelectedQty);
  els.editPriceIcon.addEventListener('click', editSelectedPrice);
  els.customerIcon.addEventListener('click', editCustomer);
  els.newSaleIcon.addEventListener('click', startNewSale);
  els.loginForm.addEventListener('submit', handleLogin);
  els.logoutBtn.addEventListener('click', logout);
  els.productForm.addEventListener('submit', handleProductSubmit);
  els.purchaseForm.addEventListener('submit', handlePurchaseSubmit);
  els.userForm.addEventListener('submit', handleUserSubmit);
  els.applySalesReportBtn.addEventListener('click', renderSalesReport);
  els.printSalesReportBtn.addEventListener('click', () => window.print());
  els.cashierSettingsForm.addEventListener('submit', saveCashierSettings);
  els.openCashierIcon.addEventListener('click', () => openCashierActionModal('open'));
  els.cashOutIcon.addEventListener('click', () => openCashierActionModal('cash-out'));
  els.closeCashierIcon.addEventListener('click', () => openCashierActionModal('close'));
  els.closeCashierActionModal.addEventListener('click', closeCashierActionModal);
  els.cashierActionForm.addEventListener('submit', handleCashierAction);
  els.paymentSettingsForm.addEventListener('submit', savePaymentSettings);
  els.receiptSettingsForm.addEventListener('submit', saveReceiptSettings);
  els.testReceiptBtn.addEventListener('click', printReceipt);
  els.backupDataBtn.addEventListener('click', downloadBackup);
  els.openProductImportBtn.addEventListener('click', () => els.productImportModal.classList.remove('hidden'));
  els.closeProductImportBtn.addEventListener('click', () => els.productImportModal.classList.add('hidden'));
  els.productDropZone.addEventListener('click', () => els.productImportInput.click());
  els.productImportInput.addEventListener('change', (event) => {
    if (event.target.files.length) processImportFiles(event.target.files);
    event.target.value = '';
  });
  ['dragenter', 'dragover'].forEach((eventName) => {
    els.productDropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.productDropZone.classList.add('drag-active');
    });
  });
  ['dragleave', 'drop'].forEach((eventName) => {
    els.productDropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      els.productDropZone.classList.remove('drag-active');
    });
  });
  els.productDropZone.addEventListener('drop', (event) => {
    if (event.dataTransfer.files.length) processImportFiles(event.dataTransfer.files);
  });
  els.downloadProductTemplateBtn.addEventListener('click', downloadProductTemplate);
  els.exportProductsBtn.addEventListener('click', exportProducts);
  els.closeCashierSummaryBtn.addEventListener('click', () => els.cashierCloseModal.classList.add('hidden'));
  els.confirmCloseCashierBtn.addEventListener('click', confirmCloseCashier);
  els.restoreDataInput.addEventListener('change', (event) => {
    const [file] = event.target.files;
    if (file) restoreBackup(file);
    event.target.value = '';
  });
  els.cancelUserEdit.addEventListener('click', () => {
    els.userForm.reset();
    els.userUsername.readOnly = false;
  });

  els.addPurchaseItemBtn.addEventListener('click', addPurchaseItemDraft);

  els.purchaseProductSelect.addEventListener('change', () => {
    const product = state.products.find((item) => item.id === Number(els.purchaseProductSelect.value));
    if (product) {
      els.purchasePrice.value = formatMoneyValue(product.buyPrice);
    }
  });

  els.saleDateInput.value = new Date().toISOString().slice(0, 10);
  setNextInvoiceNumber();
  els.salesReportStart.value = new Date().toISOString().slice(0, 10);
  els.salesReportEnd.value = new Date().toISOString().slice(0, 10);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'F12') {
      event.preventDefault();
      openPaymentModal();
      return;
    }
    if (event.ctrlKey && event.key === 'F11') {
      event.preventDefault();
      openSalesHistory();
      return;
    }
    if (event.key === 'F2') {
      event.preventDefault();
      editSelectedPrice();
    }
    if (event.key === 'F4') {
      event.preventDefault();
      editSelectedQty();
    }
    if (event.key === 'F5') {
      event.preventDefault();
      editCustomer();
    }
    if (event.key === 'F11') {
      event.preventDefault();
      startNewSale();
    }
  });
}

function renderAllDashboard() {
  renderProductTable();
  renderPurchaseProductOptions();
  renderPurchaseItems();
  renderPurchaseTable();
  renderProductSearchResults();
  renderCart();
  renderStockReport();
  renderUserTable();
  renderSalesReport();
  renderOperations();
}

function init() {
  loadState();
  bindEvents();
  renderLoginState();
  renderAllDashboard();
  setActiveTab('kasir');
}

init();
