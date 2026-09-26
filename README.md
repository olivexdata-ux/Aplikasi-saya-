# Aplikasi Kasir Retail

Aplikasi kasir sederhana berbasis web untuk mengelola:

- Master data produk
- Stok masuk dari pembelian
- Status pembelian lunas / belum lunas
- Transaksi penjualan
- Ringkasan stok dan estimasi omset
- Buka kasir dengan modal awal dan kas keluar
- Pengaturan metode pembayaran dan pajak
- Laporan penjualan berdasarkan rentang tanggal
- Desain struk dan cetak melalui dialog printer Windows
- Backup dan restore seluruh data aplikasi

## Cara menjalankan

1. Buka folder project.
2. Jalankan server lokal:

```bash
cd "c:\Users\majoo\Documents\aplikasi kasir salon\V2\Retail"
python -m http.server 8000
```

3. Buka browser ke alamat:

```text
http://localhost:8000
```

## Fitur utama

- Search produk cepat di layar kasir
- Tambah item ke keranjang
- Input diskon, uang bayar, dan kembalian
- Master produk dengan harga beli, harga jual, stok, minimum stok
- Input stok masuk berdasarkan faktur pembelian
- Laporan stok dengan modal total dan estimasi omset
- Laporan penjualan per tanggal dengan ringkasan transaksi, omset, diskon, dan item
- Menu Operasional untuk membuka/menutup kasir dan mencatat kas keluar
- Ikon di sisi kiri menu Kasir untuk buka kasir, kas keluar, tutup kasir, edit qty, edit harga, customer, dan transaksi baru
- Shortcut kasir: F2 edit harga, F4 edit qty, F5 customer, F11 transaksi baru, Ctrl+F11 histori penjualan
- Pengaturan pembayaran, nama toko, alamat, footer struk, dan printer pilihan
- Backup menghasilkan file JSON yang dapat dipulihkan dari menu Operasional

## Catatan

Data disimpan menggunakan localStorage browser. Jadi data akan tersimpan di browser yang digunakan saat aplikasi berjalan.

## Catatan printer

Browser tidak mengizinkan halaman web membaca daftar printer Control Panel secara langsung. Tombol `Preview / Cetak` membuka dialog cetak Windows, sehingga printer yang tersedia dapat dipilih di sana. Field nama printer pada menu Operasional berfungsi sebagai pengingat printer pilihan.
