# Dunia Rasa Backend

Backend aplikasi *Dunia Rasa* adalah API berbasis Node.js menggunakan Express untuk mendukung fitur-fitur seperti manajemen pengguna, resep, dan favorit.

---

## Prasyarat
Agar aplikasi ini dapat berjalan, pastikan Anda memiliki versi berikut yang sudah terpasang di sistem Anda:
- **Node.js**: v18.20.5
- **MongoDB**: v7.0.11
- **AngularJS**: v1.8.2

---

## Langkah-langkah Menjalankan Backend

1. **Unduh atau Siapkan Kode Backend**

Pastikan Anda memiliki file kode sumber backend di dalam folder lokal Anda.

2. **Pasang Dependensi**

Jalankan perintah berikut di terminal Anda untuk memasang semua dependensi yang diperlukan:

   ```bash
   npm install
   ```
3. **Konfigurasi MongoDB**

Pastikan MongoDB berjalan di sistem Anda pada localhost dengan port default 27017. Buat database bernama dunia_rasa dengan dua koleksi berikut:

- **users**: Untuk menyimpan data pengguna
- **recipes**: Untuk menyimpan data resep    

4. **Menjalankan Server**

Gunakan perintah berikut untuk menjalankan server:
```bash
npm run dev
```
Server akan berjalan secara default pada http://localhost:3000.

---

## Autentikasi dan Otorisasi

Aplikasi ini menggunakan **JWT (JSON Web Token)** untuk autentikasi dan otorisasi.

### Proses Autentikasi
1. **Login**: Pengguna dapat melakukan login dengan memasukkan email dan password. Setelah berhasil, aplikasi akan mengembalikan **JWT** yang digunakan untuk mengakses endpoint yang memerlukan autentikasi.
2. **Token Storage**: Token yang diterima setelah login akan disimpan di **localStorage** di frontend untuk keperluan autentikasi pada request selanjutnya.
3. **Mekanisme Penggunaan Token**:
   - Setiap permintaan ke backend yang membutuhkan autentikasi akan menyertakan token di header `Authorization` dengan format `Bearer <token>`.
   - Jika token valid, pengguna dapat mengakses resource yang dilindungi, jika tidak, akan mendapatkan respons dengan status `401 Unauthorized`.

---