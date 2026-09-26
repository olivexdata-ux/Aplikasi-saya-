# Aplikasi-saya-
aplikasi kasir untuk belanjar 
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Retail Kasir</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div id="noticePopup" class="notice-popup hidden" role="status" aria-live="polite">
      <span id="noticeIcon" class="notice-icon">!</span>
      <div class="notice-content">
        <strong id="noticeTitle">Perhatian</strong>
        <span id="noticeMessage"></span>
      </div>
      <button id="closeNoticeBtn" class="notice-close" type="button" aria-label="Tutup notifikasi">X</button>
    </div>

    <div id="loginScreen" class="login-screen">
      <div class="login-card">
        <div class="login-logo">POS</div>
        <h2>Login Akses Kasir</h2>
        <form id="loginForm">
          <label>
            <span>Username</span>
            <input id="loginUsername" type="text" placeholder="Masukkan username" required />
          </label>
          <label>
            <span>Password</span>
            <input id="loginPassword" type="password" placeholder="Masukkan password" required />
          </label>
          <button type="submit" class="primary-btn login-btn">Masuk</button>
        </form>
        <div class="login-hints">
          <strong>Default akun:</strong><br />
          admin / admin123<br />
          kasir / kasir123<br />
          manager / manager123
        </div>
      </div>
    </div>

    <div id="adminEntryModal" class="action-modal hidden">
      <div class="action-modal-card admin-entry-card">
        <h3>Pilih Menu Awal Admin</h3>
        <p class="form-help">Silakan pilih proses yang ingin dibuka.</p>
        <div class="admin-entry-actions">
          <button id="adminOpenCashierBtn" type="button" class="primary-btn">Buka Kasir</button>
          <button id="adminOpenSettingsBtn" type="button" class="secondary-btn">Pengaturan</button>
        </div>
      </div>
    </div>

    <div id="appShell" class="app-shell hidden">
      <header class="topbar">
        <div class="brand-wrap">
          <span class="brand">KASIR</span>
          <span class="brand-sub">MANIA</span>
        </div>

        <div class="topbar-right">
          <div class="info-chip">
            <label>Customer:</label>
            <input id="customerInput" type="text" value="CASH" />
          </div>
          <div class="info-chip">
            <label>Salesman:</label>
            <input id="salesmanInput" type="text" value="Admin" />
          </div>
          <div class="info-chip">
            <label>Term:</label>
            <input type="text" value="Cash" />
          </div>
          <div class="info-chip date-box">
            <label>Tanggal:</label>
            <input id="saleDateInput" type="date" />
          </div>
          <div class="info-chip">
            <label>Pengajuan:</label>
            <input type="text" value="AUTO" />
          </div>
          <div class="user-panel">
            <span id="loginUserBadge" class="status-badge">Admin</span>
            <button id="logoutBtn" class="logout-btn" type="button">Logout</button>
          </div>
        </div>
      </header>

      <nav class="tab-nav">
        <button class="tab-btn active" data-tab="kasir">Kasir</button>
        <button class="tab-btn" data-tab="master">Master Produk</button>
        <button class="tab-btn" data-tab="purchase">Pembelian</button>
        <button class="tab-btn" data-tab="report">Laporan</button>
        <button class="tab-btn" data-tab="sales-report">Penjualan</button>
        <button class="tab-btn" data-tab="settings">Pengaturan</button>
        <button class="tab-btn" data-tab="operations">Operasional</button>
      </nav>

      <main class="content-wrap">
        <section id="kasir-panel" class="tab-panel active">
          <div class="pos-layout">
            <div class="pos-main">
              <div class="pos-head">
                <div class="total-box">
                  <span>Total</span>
                  <strong id="mainTotal">Rp. 0</strong>
                </div>
              </div>

              <div class="search-box">
                <input
                  id="productSearch"
                  type="text"
                  placeholder="Cari nama barang / kode produk..."
                />
              </div>

              <div id="productSearchResults" class="search-results"></div>

              <div class="receipt-wrap">
                <table class="receipt-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Kode Item</th>
                      <th>Nama Item</th>
                      <th>Qty</th>
                      <th>Sat</th>
                      <th>Harga</th>
                      <th>Disc %</th>
                      <th>Subtotal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="cartTableBody"></tbody>
                </table>
              </div>

              <div class="bottom-row">
                <div class="summary-box">
                  <div class="summary-row">
                    <span>Subtotal:</span>
                    <strong id="subtotalValue">Rp. 0</strong>
                  </div>
                  <div class="summary-row">
                    <span>Diskon:</span>
                    <strong id="discountValue">Rp. 0</strong>
                  </div>
                  <div class="summary-row grand">
                    <span>Total:</span>
                    <strong id="totalValue">Rp. 0</strong>
                  </div>
                </div>

                <div class="cash-box">
                  <button id="payButton" class="main-action">BAYAR (F12)</button>
                </div>
              </div>
            </div>

            <aside class="command-panel">
              <button class="tool-btn icon-tool" id="openCashierIcon" type="button" title="Buka kasir" aria-label="Buka kasir"><span class="tool-icon">$</span><span>Buka Kasir</span></button>
              <button class="tool-btn icon-tool" id="cashOutIcon" type="button" title="Kas keluar" aria-label="Kas keluar"><span class="tool-icon">-</span><span>Kas Keluar</span></button>
              <button class="tool-btn icon-tool" id="closeCashierIcon" type="button" title="Tutup kasir" aria-label="Tutup kasir"><span class="tool-icon">&#9632;</span><span>Tutup Kasir</span></button>
              <button class="tool-btn icon-tool" id="editQtyIcon" type="button" title="Edit qty (F4)" aria-label="Edit qty"><span class="tool-icon">#</span><span>Edit Qty (F4)</span></button>
              <button class="tool-btn icon-tool" id="editPriceIcon" type="button" title="Edit harga (F2)" aria-label="Edit harga"><span class="tool-icon">Rp</span><span>Edit Harga (F2)</span></button>
              <button class="tool-btn icon-tool" id="customerIcon" type="button" title="Customer (F5)" aria-label="Customer"><span class="tool-icon">@</span><span>Customer (F5)</span></button>
              <button class="tool-btn icon-tool" id="newSaleIcon" type="button" title="Transaksi baru (F11)" aria-label="Transaksi baru"><span class="tool-icon">+</span><span>Baru (F11)</span></button>
            </aside>
          </div>
          <div id="cashierSessionBadge" class="cashier-session-badge"></div>
        </section>

        <section id="master-panel" class="tab-panel">
          <div class="panel-grid">
            <div class="card form-card">
              <h3>Master Data Produk</h3>
              <form id="productForm">
                <div class="field-grid">
                  <label>
                    <span>Kode Produk</span>
                    <input id="productCode" type="text" placeholder="Kosongkan untuk SKU otomatis" />
                  </label>
                  <label>
                    <span>Nama Produk</span>
                    <input id="productName" type="text" required />
                  </label>
                  <label>
                    <span>Satuan</span>
                    <input id="productUnit" type="text" placeholder="PCS" value="PCS" required />
                  </label>
                  <label>
                    <span>Kategori</span>
                    <input id="productCategory" type="text" placeholder="Contoh: Shampoo" />
                  </label>
                  <label>
                    <span>Harga Beli</span>
                    <input id="productBuyPrice" class="money-input" type="text" inputmode="numeric" required />
                  </label>
                  <label>
                    <span>Harga Jual</span>
                    <input id="productSellPrice" class="money-input" type="text" inputmode="numeric" required />
                  </label>
                  <label>
                    <span>Stok Awal</span>
                    <input id="productStock" type="number" min="0" value="0" />
                  </label>
                  <label>
                    <span>Minimum Stok</span>
                    <input id="productMinStock" type="number" min="0" value="0" />
                  </label>
                  <label>
                    <span>Harga Grosir <small>(opsional)</small></span>
                    <input id="productWholesalePrice" class="money-input" type="text" inputmode="numeric" placeholder="Kosongkan jika tidak ada" />
                  </label>
                  <label>
                    <span>Qty Grosir <small>(opsional)</small></span>
                    <input id="productWholesaleQty" type="number" min="1" placeholder="Minimal qty grosir" />
                  </label>
                </div>
                <div class="form-actions">
                  <button type="submit" class="primary-btn">Simpan Produk</button>
                  <button type="reset" class="secondary-btn">Reset</button>
                </div>
              </form>
            </div>

            <div class="card table-card">
              <div class="card-heading-row">
                <h3>Daftar Produk</h3>
                <button id="downloadProductTemplateBtn" type="button" class="secondary-btn">Download Template Excel</button>
                <button id="exportProductsBtn" type="button" class="secondary-btn">Export Excel</button>
                <button id="openProductImportBtn" type="button" class="secondary-btn">Impor Produk</button>
              </div>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Nama</th>
                      <th>Satuan</th>
                      <th>Kategori</th>
                      <th>Harga Beli</th>
                      <th>Harga Jual</th>
                      <th>Grosir</th>
                      <th>Stok</th>
                      <th>Min</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="productTableBody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="purchase-panel" class="tab-panel">
          <div class="panel-grid purchase-grid">
            <div class="card form-card">
              <h3>Input Stok Masuk</h3>
              <form id="purchaseForm">
                <div class="field-grid compact">
                  <label>
                    <span>No Faktur</span>
                    <input id="purchaseInvoice" type="text" readonly />
                  </label>
                  <label>
                    <span>Supplier</span>
                    <input id="purchaseSupplier" type="text" required />
                  </label>
                  <label>
                    <span>Tanggal</span>
                    <input id="purchaseDate" type="date" required />
                  </label>
                  <label>
                    <span>Status</span>
                    <select id="purchaseStatus">
                      <option value="Lunas">Lunas</option>
                      <option value="Belum Lunas">Belum Lunas</option>
                    </select>
                  </label>
                </div>

                <div class="operation-row">
                  <label>
                    <span>Produk</span>
                    <select id="purchaseProductSelect"></select>
                  </label>
                  <label>
                    <span>Qty</span>
                    <input id="purchaseQty" type="number" min="1" value="1" />
                  </label>
                  <label>
                    <span>Harga Beli</span>
                    <input id="purchasePrice" class="money-input" type="text" inputmode="numeric" value="0" />
                  </label>
                  <button type="button" id="addPurchaseItemBtn" class="secondary-btn">Tambah Item</button>
                </div>

                <div class="purchase-items-box">
                  <h4>Item Pembelian</h4>
                  <div id="purchaseItemsList" class="purchase-items-list"></div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="primary-btn">Simpan Pembelian</button>
                </div>
              </form>
            </div>

            <div class="card table-card">
              <h3>Riwayat Pembelian</h3>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Faktur</th>
                      <th>Supplier</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody id="purchaseTableBody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="report-panel" class="tab-panel">
          <div class="report-grid">
            <div class="card metric-card">
              <h3>Ringkasan Stok</h3>
              <div class="metric-box">
                <span>Total Produk</span>
                <strong id="totalProductsMetric">0</strong>
              </div>
              <div class="metric-box">
                <span>Stok Tersedia</span>
                <strong id="stockAvailableMetric">0</strong>
              </div>
              <div class="metric-box">
                <span>Modal Total</span>
                <strong id="modalMetric">Rp. 0</strong>
              </div>
              <div class="metric-box">
                <span>Estimasi Omset</span>
                <strong id="omsetMetric">Rp. 0</strong>
              </div>
            </div>

            <div class="card table-card">
              <h3>Detail Stok</h3>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Nama</th>
                      <th>Stok</th>
                      <th>Min</th>
                      <th>Modal / Stok</th>
                      <th>Potensi Omset</th>
                    </tr>
                  </thead>
                  <tbody id="stockTableBody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="sales-report-panel" class="tab-panel">
          <div class="card report-filter-card">
            <h3>Laporan Penjualan per Tanggal</h3>
            <div class="filter-row">
              <label>
                <span>Dari Tanggal</span>
                <input id="salesReportStart" type="date" />
              </label>
              <label>
                <span>Sampai Tanggal</span>
                <input id="salesReportEnd" type="date" />
              </label>
              <button id="applySalesReportBtn" type="button" class="primary-btn">Tampilkan</button>
              <button id="printSalesReportBtn" type="button" class="secondary-btn">Cetak Laporan</button>
            </div>
          </div>
          <div class="report-grid sales-report-grid">
            <div class="card metric-card">
              <h3>Ringkasan Penjualan</h3>
              <div class="metric-box"><span>Jumlah Transaksi</span><strong id="salesCountMetric">0</strong></div>
              <div class="metric-box"><span>Total Omset</span><strong id="salesRevenueMetric">Rp 0</strong></div>
              <div class="metric-box"><span>Total Diskon</span><strong id="salesDiscountMetric">Rp 0</strong></div>
              <div class="metric-box"><span>Total Item Terjual</span><strong id="salesItemsMetric">0</strong></div>
            </div>
            <div class="card table-card">
              <h3>Rincian Transaksi</h3>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr><th>Tanggal</th><th>Customer</th><th>Kasir</th><th>Item</th><th>Total</th><th>Bayar</th><th>Kembalian</th></tr>
                  </thead>
                  <tbody id="salesReportTableBody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="settings-panel" class="tab-panel">
          <div class="panel-grid">
            <div class="card form-card">
              <h3>Hak Akses Login</h3>
              <form id="userForm">
                <div class="field-grid">
                  <label>
                    <span>Username</span>
                    <input id="userUsername" type="text" required />
                  </label>
                  <label>
                    <span>Nama Lengkap</span>
                    <input id="userName" type="text" required />
                  </label>
                  <label>
                    <span>Password</span>
                    <input id="userPassword" type="password" placeholder="Kosongkan jika tidak diubah" />
                  </label>
                  <label>
                    <span>Role</span>
                    <select id="userRole">
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="cashier">Cashier</option>
                    </select>
                  </label>
                </div>
                <div class="form-actions">
                  <button type="submit" class="primary-btn">Simpan User</button>
                  <button type="button" id="cancelUserEdit" class="secondary-btn">Batal</button>
                </div>
              </form>
            </div>

            <div class="card table-card">
              <h3>Daftar User</h3>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Nama</th>
                      <th>Role</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody id="userTableBody"></tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="operations-panel" class="tab-panel">
          <div class="operations-grid">
            <div class="card form-card">
              <h3>Pengaturan Proses Kasir</h3>
              <form id="cashierSettingsForm">
                <label class="switch-row"><span>Izinkan Kas Keluar</span><input id="allowCashOutInput" type="checkbox" /><span class="switch-ui"></span></label>
                <label class="switch-row"><span>Wajib Isi Modal Awal</span><input id="requireOpeningBalanceInput" type="checkbox" /><span class="switch-ui"></span></label>
                <button type="submit" class="primary-btn">Simpan Pengaturan Kasir</button>
              </form>
              <p class="form-help">Buka kasir, kas keluar, dan tutup kasir dilakukan dari ikon pada sisi kiri halaman Kasir.</p>
            </div>

            <div class="card form-card">
              <h3>Pengaturan Pembayaran</h3>
              <form id="paymentSettingsForm">
                <label><span>Metode Pembayaran Aktif</span><input id="paymentMethodsInput" type="text" placeholder="Cash, Transfer, QRIS, Debit" /></label>
                <label><span>Pembayaran Default</span><select id="defaultPaymentSelect"></select></label>
                <label><span>Pajak (%)</span><input id="taxPercentInput" type="number" min="0" max="100" step="0.01" /></label>
                <button type="submit" class="primary-btn">Simpan Pembayaran</button>
              </form>
            </div>

            <div class="card form-card">
              <h3>Printer dan Desain Struk</h3>
              <form id="receiptSettingsForm">
                <label><span>Nama Printer Pilihan</span><input id="printerNameInput" type="text" placeholder="Pilih saat dialog cetak Windows" /></label>
                <label><span>Nama Toko</span><input id="receiptStoreNameInput" type="text" /></label>
                <label><span>Alamat / Kontak</span><textarea id="receiptStoreAddressInput" rows="2"></textarea></label>
                <label><span>Footer Struk</span><textarea id="receiptFooterInput" rows="2"></textarea></label>
                <div class="form-actions">
                  <button type="submit" class="primary-btn">Simpan Desain</button>
                  <button id="testReceiptBtn" type="button" class="secondary-btn">Preview / Cetak</button>
                </div>
              </form>
              <p class="form-help">Daftar printer Windows dibuka oleh dialog cetak. Nama printer di sini menjadi pengingat printer pilihan.</p>
            </div>

            <div class="card form-card">
              <h3>Backup dan Restore Database</h3>
              <p class="form-help">Backup menyimpan produk, transaksi, pembelian, user, konfigurasi, dan sesi kasir dalam satu file JSON.</p>
              <div class="form-actions">
                <button id="backupDataBtn" type="button" class="primary-btn">Download Backup</button>
                <label class="file-btn secondary-btn">Pilih File Restore<input id="restoreDataInput" type="file" accept="application/json,.json" hidden /></label>
              </div>
              <p id="backupStatus" class="form-help"></p>
            </div>
          </div>
        </section>

        <div id="cashierActionModal" class="action-modal hidden">
          <div class="action-modal-card">
            <button id="closeCashierActionModal" class="modal-close" type="button" aria-label="Tutup">X</button>
            <h3 id="cashierActionTitle">Buka Kasir</h3>
            <form id="cashierActionForm">
              <label id="openingBalanceField"><span>Modal Awal Kasir</span><input id="openingBalanceInput" class="money-input" type="text" inputmode="numeric" /></label>
              <label id="cashOutNoteField" class="hidden"><span>Keterangan Kas Keluar</span><input id="cashOutNote" type="text" /></label>
              <label id="cashOutAmountField" class="hidden"><span>Nominal Kas Keluar</span><input id="cashOutAmount" class="money-input" type="text" inputmode="numeric" /></label>
              <button id="cashierActionSubmit" type="submit" class="primary-btn">Buka Kasir</button>
            </form>
          </div>
        </div>

        <div id="paymentModal" class="action-modal hidden">
          <div class="action-modal-card payment-modal-card">
            <button id="closePaymentModal" class="modal-close" type="button" aria-label="Tutup">X</button>
            <h3>Pembayaran</h3>
            <div class="payment-total-summary">
              <div class="summary-row"><span>Subtotal</span><strong id="paymentSubtotalValue">Rp. 0</strong></div>
              <div class="summary-row"><span>Diskon</span><strong id="paymentDiscountValue">Rp. 0</strong></div>
              <div class="summary-row grand"><span>Total Bayar</span><strong id="paymentTotalValue">Rp. 0</strong></div>
            </div>
            <label class="payment-discount-field">
              <span>Diskon Total (Rp)</span>
              <input id="discountInput" class="money-input" type="text" inputmode="numeric" value="0" />
            </label>
            <div class="payment-method-heading">
              <h4>Metode Pembayaran</h4>
              <select id="salePaymentSelect" class="visually-hidden" aria-label="Metode Pembayaran"></select>
            </div>
            <div id="paymentMethodsList" class="payment-method-grid" role="group" aria-label="Pilih metode pembayaran"></div>
            <label class="payment-cash-field">
              <span>Uang Diterima</span>
              <input id="cashInput" class="money-input" type="text" inputmode="numeric" placeholder="0" />
            </label>
            <div class="payment-change-row"><span>Kembalian</span><strong id="paymentChangeValue">Rp. 0</strong></div>
            <div class="payment-modal-actions">
              <button id="cancelPaymentBtn" class="secondary-btn" type="button">Batal</button>
              <button id="confirmPaymentBtn" class="main-action" type="button">Proses Pembayaran</button>
            </div>
          </div>
        </div>

        <div id="cashierCloseModal" class="action-modal hidden">
          <div class="action-modal-card cashier-summary-modal">
            <button id="closeCashierSummaryBtn" class="modal-close" type="button" aria-label="Tutup">X</button>
            <h3>Ringkasan Penjualan Kasir</h3>
            <div id="cashierSummaryMetrics" class="cashier-summary-metrics"></div>
            <div id="cashierPaymentSummary" class="cashier-payment-summary"></div>
            <h4>Produk Terjual</h4>
            <div id="cashierProductSummary" class="cashier-product-summary"></div>
            <div class="form-actions">
              <button id="confirmCloseCashierBtn" type="button" class="primary-btn">Konfirmasi Tutup Kasir</button>
            </div>
          </div>
        </div>

        <div id="productImportModal" class="action-modal hidden">
          <div class="action-modal-card import-modal-card">
            <button id="closeProductImportBtn" class="modal-close" type="button" aria-label="Tutup">X</button>
            <h3>Impor Produk Excel</h3>
            <div id="productDropZone" class="product-drop-zone" tabindex="0">
              <strong>Tarik file Excel ke sini</strong>
              <span>atau klik untuk memilih .xlsx, .xls, .csv</span>
              <input id="productImportInput" type="file" accept=".json,.csv,.xls,.xlsx,text/csv,application/json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" multiple hidden />
            </div>
            <div id="productImportLoading" class="import-loading hidden"><span class="loading-spinner"></span><span>Membaca file Excel...</span></div>
            <p id="productImportHelp" class="form-help">Untuk file Excel lama berbasis frameset, pilih juga folder/file pendamping yang berisi <strong>sheet001.htm</strong>.</p>
          </div>
        </div>
      </main>
    </div>

    <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>
    <script src="app.js"></script>
  </body>
</html>
