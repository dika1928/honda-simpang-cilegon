/**
 * ============================================================================
 * HONDA SIMPANG CORE - SECURITY MODULE
 * ============================================================================
 * * Modul ini menangani sanitasi input dan perlindungan terhadap XSS.
 * Wajib digunakan sebelum menampilkan input user ke layar.
 * * @author  Andika Rendi Prakarsa
 * @version 1.0.0
 * @security Critical
 */

const Security = (function() {
    'use strict';

    /**
     * Membersihkan string dari potensi kode HTML jahat (Anti-XSS).
     * Mengubah karakter spesial menjadi entitas HTML aman.
     * * @param {string} str - Input mentah dari user
     * @returns {string} Input yang sudah dibersihkan
     */
    const sanitizeHTML = (str) => {
        if (!str) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, (m) => map[m]);
    };

    /**
     * Memvalidasi apakah URL aman untuk dikunjungi (mencegah javascript: protocol).
     * * @param {string} url - URL yang akan dicek
     * @returns {boolean} True jika aman
     */
    const isSafeURL = (url) => {
        if (!url) return false;
        // Hanya izinkan http, https, dan mailto
        return /^(https?:\/\/|mailto:)/i.test(url);
    };

    /**
     * Membersihkan objek input form secara rekursif.
     * Berguna jika user mengirim banyak data sekaligus (misal JSON).
     * * @param {Object} input - Data objek mentah
     * @returns {Object} Data objek bersih
     */
    const sanitizeObject = (input) => {
        if (typeof input === 'string') {
            return sanitizeHTML(input);
        }
        if (typeof input === 'object' && input !== null) {
            for (let key in input) {
                input[key] = sanitizeObject(input[key]);
            }
        }
        return input;
    };

    // Public API
    return {
        sanitize: sanitizeHTML,
        sanitizeInput: sanitizeObject,
        isSafeURL: isSafeURL
    };

})();

// Export agar bisa dipakai
export default Security;
