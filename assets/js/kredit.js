/**
 * ============================================================================
 * HONDA SIMPANG - KREDIT CALCULATOR ENGINE
 * ============================================================================
 * * Modul ini menangani logika inti perhitungan angsuran motor.
 * * Menggunakan rumus Bunga Flat Murni (Standar Leasing Indonesia).
 * * @module Kredit
 * * @author Andika Rendi Prakarsa
 */

import UI from './ui-interaction.js';

const Kredit = (function() {
    'use strict';

    // ========================================================================
    // 1. KONFIGURASI LEASING (BISA DIUBAH)
    // ========================================================================
    const CONFIG = {
        // Bunga per tahun (0.30 = 30%). Ini estimasi rata-rata leasing motor.
        // Nanti bisa dibikin dinamis per tipe motor jika data JSON sudah siap.
        bungaPerTahun: 0.28, 
        
        // Asuransi (Opsional, biasanya masuk ke TDP, tapi ini buat jaga-jaga)
        biayaAdmin: 0, 
        
        // Batas Minimal DP (Secara Rupiah)
        minDPRupiah: 500000,
        
        // Batas Minimal DP (Secara Persen, misal 10% dari OTR)
        minDPPersen: 0.10,

        // Pilihan Tenor yang Valid (Bulan)
        validTenor: [11, 17, 23, 27, 29, 33, 35]
    };

    // ========================================================================
    // 2. FUNGSI UTAMA: HITUNG ANGSURAN
    // ========================================================================
    /**
     * Menghitung detail cicilan berdasarkan OTR, DP, dan Tenor.
     * * @param {number} hargaOTR - Harga On The Road Motor
     * @param {number} dpBayar - Uang Muka yang diinput user
     * @param {number} tenorBulan - Jangka waktu (11, 17, 23, dll)
     * @returns {Object} Objek hasil perhitungan lengkap
     */
    const hitung = (hargaOTR, dpBayar, tenorBulan) => {
        
        // --- STEP 1: VALIDASI INPUT (Biar gak ngawur) ---
        if (!hargaOTR || hargaOTR <= 0) {
            throw new Error("Harga motor belum dipilih.");
        }

        if (!dpBayar || dpBayar < 0) {
            throw new Error("Masukkan nominal DP yang benar.");
        }

        // Cek Minimal DP (Rupiah)
        if (dpBayar < CONFIG.minDPRupiah) {
            throw new Error(`DP minimal adalah ${UI.formatRupiah(CONFIG.minDPRupiah)}`);
        }

        // Cek Minimal DP (Persen)
        const minDPValue = hargaOTR * CONFIG.minDPPersen;
        if (dpBayar < minDPValue) {
            throw new Error(`DP terlalu kecil. Minimal 10% (${UI.formatRupiah(minDPValue)})`);
        }

        // Cek Maksimal DP (Tidak boleh lebih besar dari harga motor)
        if (dpBayar >= hargaOTR) {
            throw new Error("DP tidak boleh melebihi harga motor (Itu namanya Cash Keras).");
        }

        // --- STEP 2: LOGIKA MATEMATIKA LEASING ---
        
        // A. Pokok Hutang (PH)
        // Harga Motor dikurangi DP yang dibayar
        const pokokHutang = hargaOTR - dpBayar;

        // B. Hitung Bunga Total
        // Rumus: Pokok Hutang x %Bunga x (Tenor / 12 bulan)
        const bungaPerBulan = CONFIG.bungaPerTahun / 12; 
        const totalBunga = pokokHutang * bungaPerBulan * tenorBulan;

        // C. Total Hutang (Pokok + Bunga + Admin)
        const totalHutang = pokokHutang + totalBunga + CONFIG.biayaAdmin;

        // D. Angsuran Per Bulan (Mentah)
        const angsuranMentah = totalHutang / tenorBulan;

        // E. Pembulatan Angsuran (PENTING!)
        // Leasing biasanya membulatkan ke atas dalam ribuan.
        // Contoh: Rp 754.321 -> Rp 755.000
        const angsuranBulat = Math.ceil(angsuranMentah / 1000) * 1000;

        // --- STEP 3: KEMBALIKAN DATA LENGKAP ---
        return {
            success: true,
            data: {
                otr: hargaOTR,
                dp: dpBayar,
                tenor: tenorBulan,
                pokokHutang: pokokHutang,
                bungaTotal: totalBunga,
                angsuran: angsuranBulat,
                // Versi string yang sudah diformat Rp
                formatted: {
                    otr: UI.formatRupiah(hargaOTR),
                    dp: UI.formatRupiah(dpBayar),
                    pokok: UI.formatRupiah(pokokHutang),
                    angsuran: UI.formatRupiah(angsuranBulat)
                }
            }
        };
    };

    // ========================================================================
    // 3. FUNGSI GENERATOR LINK WHATSAPP
    // ========================================================================
    /**
     * Membuat link WA otomatis yang berisi detail pesanan.
     * Biar user tinggal klik send, sales langsung paham.
     * * @param {string} namaMotor - Nama unit (misal: Vario 160 ABS)
     * @param {Object} hasilHitung - Objek hasil dari fungsi hitung()
     * @returns {string} URL WhatsApp lengkap
     */
    const generateWALink = (namaMotor, hasilHitung) => {
        const nomorSales = "6281316445477"; // Nomor HP Kamu
        
        // Template Pesan (Rapi & Profesional)
        const pesan = `Halo Mas Andika, saya tertarik ajukan kredit motor ini:

🏍️ *Unit:* ${namaMotor}
💰 *Harga OTR:* ${hasilHitung.formatted.otr}

📋 *Rencana Kredit:*
• DP: ${hasilHitung.formatted.dp}
• Tenor: ${hasilHitung.data.tenor} Bulan
• Angsuran: ${hasilHitung.formatted.angsuran}

Mohon info persyaratan dan ketersediaan unitnya. Terima kasih!`;

        // Encode pesan supaya aman di URL
        const encodedPesan = encodeURIComponent(pesan);
        
        return `https://wa.me/${nomorSales}?text=${encodedPesan}`;
    };

    // ========================================================================
    // 4. PUBLIC API (YANG BISA DIAKSES FILE LAIN)
    // ========================================================================
    return {
        hitung: hitung,
        generateLink: generateWALink,
        getConfig: () => CONFIG // Opsional: kalau mau liat config dari luar
    };

})();

export default Kredit;
