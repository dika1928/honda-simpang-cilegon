/**
 * ============================================================================
 * HONDA SIMPANG CORE - ROUTER MODULE
 * ============================================================================
 * * Modul ini menangani navigasi dan inisialisasi script berdasarkan URL.
 * Memastikan script yang berat (seperti kalkulator kredit) hanya jalan
 * di halaman yang membutuhkannya.
 * * @author  Andika Rendi Prakarsa
 * @version 1.0.0
 */

import Auth from './auth.js';

const Router = (function() {
    'use strict';

    // Peta Halaman vs Judul Dokumen
    const routes = {
        '/': { title: 'Beranda', script: 'initHome' },
        '/produk': { title: 'Katalog Motor', script: 'initProduk' },
        '/detail': { title: 'Detail Unit', script: 'initDetail' },
        '/kredit': { title: 'Simulasi Kredit', script: 'initKredit' },
        '/admin/': { title: 'Dashboard Admin', script: 'initAdmin', protected: true },
        404: { title: 'Halaman Tidak Ditemukan', script: 'init404' }
    };

    /**
     * Mendapatkan path URL saat ini (tanpa domain)
     */
    const getCurrentPath = () => {
        let path = window.location.pathname;
        // Hapus trailing slash kecuali root, misal /produk/ jadi /produk
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        // Khusus netlify kadang index.html muncul di url
        return path.replace('/index.html', '/');
    };

    /**
     * Fungsi utama yang dijalankan saat halaman dimuat
     */
    const loadRoute = () => {
        const path = getCurrentPath();
        const route = routes[path] || routes[404];

        // 1. Ubah Judul Tab Browser
        document.title = `${route.title} | Honda Simpang Cilegon`;

        // 2. Cek Proteksi Halaman (Integrasi dengan Auth.js)
        if (route.protected) {
            console.log('🔒 [Router] Checking access for protected route...');
            Auth.init(); // Pastikan auth siap
            Auth.protect(); // Tendang kalau belum login
        }

        // 3. Jalankan Script Khusus Halaman (Dynamic Import)
        // Ini teknik "Lazy Loading" agar web ringan
        console.log(`🚀 [Router] Loaded: ${path}`);
        
        // Menandai menu navigasi yang aktif
        updateActiveMenu(path);
    };

    /**
     * Menandai link navigasi yang sedang aktif (UX)
     */
    const updateActiveMenu = (path) => {
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // Event Listener: Saat user menekan tombol Back/Forward browser
    window.addEventListener('popstate', loadRoute);

    // Public API
    return {
        init: loadRoute,
        current: getCurrentPath
    };

})();

// Jalankan otomatis saat file diimport
document.addEventListener('DOMContentLoaded', Router.init);

export default Router;
