/**
 * ============================================================================
 * HONDA SIMPANG CORE - VALIDATOR MODULE
 * ============================================================================
 * * Modul ini menangani validasi formulir dan logika bisnis.
 * Mencegah data sampah (GIGO - Garbage In Garbage Out) masuk ke sistem.
 * * @author  Andika Rendi Prakarsa
 * @version 1.0.0
 */

const Validator = (function() {
    'use strict';

    // Regex Pola Standar
    const PATTERNS = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^(\+62|62|0)8[1-9][0-9]{6,9}$/, // Format HP Indonesia (08xx / 628xx)
        number: /^[0-9]+$/,
        name: /^[a-zA-Z\s\.]+$/
    };

    /**
     * Cek apakah input kosong
     */
    const required = (value) => {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    };

    /**
     * Validasi format Email
     */
    const isEmail = (value) => {
        return PATTERNS.email.test(value);
    };

    /**
     * Validasi Nomor HP Indonesia
     */
    const isPhone = (value) => {
        // Hapus spasi atau dash (-)
        const cleanNumber = value.toString().replace(/[\s-]/g, '');
        return PATTERNS.phone.test(cleanNumber);
    };

    /**
     * Validasi Angka Minimal (Untuk DP/Harga)
     */
    const min = (value, limit) => {
        return Number(value) >= limit;
    };

    /**
     * Validasi Pilihan Tenor (Khusus Kredit Motor)
     * Biasanya tenor Honda itu: 11, 17, 23, 29, 35 bulan.
     */
    const isValidTenor = (value) => {
        const allowed = [11, 17, 23, 27, 29, 33, 35];
        return allowed.includes(Number(value));
    };

    /**
     * Fungsi Utama: Memvalidasi Objek Data berdasarkan Schema
     * Mirip library 'Joi' atau 'Yup' tapi versi ringan.
     * * @param {Object} data - Data dari form (misal: {nama: 'Dika', dp: 500000})
     * @param {Object} schema - Aturan validasi
     * @returns {Object|null} Objek error jika ada, atau null jika valid/aman.
     */
    const validate = (data, schema) => {
        const errors = {};
        let isValid = true;

        for (const field in schema) {
            const rules = schema[field];
            const value = data[field];

            // 1. Cek Required
            if (rules.required && !required(value)) {
                errors[field] = 'Wajib diisi.';
                isValid = false;
                continue; // Skip validasi lain jika kosong
            }

            // Skip jika kosong dan tidak required
            if (!required(value)) continue;

            // 2. Cek Tipe Data
            if (rules.type === 'email' && !isEmail(value)) {
                errors[field] = 'Format email tidak valid.';
                isValid = false;
            }
            if (rules.type === 'phone' && !isPhone(value)) {
                errors[field] = 'Nomor HP tidak valid (Gunakan 08xxx).';
                isValid = false;
            }
            if (rules.type === 'number' && isNaN(value)) {
                errors[field] = 'Harus berupa angka.';
                isValid = false;
            }

            // 3. Cek Logic Bisnis (Min/Max)
            if (rules.min && !min(value, rules.min)) {
                errors[field] = `Minimal ${rules.min.toLocaleString('id-ID')}.`;
                isValid = false;
            }

            // 4. Cek Tenor Khusus
            if (rules.custom === 'tenor' && !isValidTenor(value)) {
                errors[field] = 'Pilihan tenor tidak tersedia.';
                isValid = false;
            }
        }

        return isValid ? null : errors;
    };

    // Public API
    return {
        check: validate,
        rules: {
            required,
            isEmail,
            isPhone,
            min
        }
    };

})();

export default Validator;
