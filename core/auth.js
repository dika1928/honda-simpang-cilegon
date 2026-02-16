/**
 * ============================================================================
 * HONDA SIMPANG CORE - AUTHENTICATION MODULE
 * ============================================================================
 * * Modul ini menangani manajemen sesi pengguna menggunakan Netlify Identity.
 * Berfungsi sebagai "Satpam" yang memeriksa izin akses sebelum admin masuk dashboard.
 * * @author  Andika Rendi Prakarsa
 * @version 1.0.0
 * @security Critical
 */

const Auth = (function() {
    'use strict';

    // Konfigurasi internal
    const CONFIG = {
        adminPath: '/admin/',
        loginRedirect: '/admin/',
        homeRedirect: '/',
        storageKey: 'gotrue.user' // Key standar Netlify Identity di LocalStorage
    };

    /**
     * Inisialisasi Event Listener Netlify Identity
     * Dipanggil saat halaman dimuat.
     */
    const init = () => {
        if (window.netlifyIdentity) {
            // Event saat user berhasil login
            window.netlifyIdentity.on('login', user => {
                console.log('✅ [Auth] User logged in:', user.email);
                // Redirect ke admin jika belum di sana
                if (!window.location.pathname.startsWith(CONFIG.adminPath)) {
                    window.location.href = CONFIG.loginRedirect;
                }
            });

            // Event saat user logout
            window.netlifyIdentity.on('logout', () => {
                console.log('🔒 [Auth] User logged out');
                // Tendang balik ke homepage
                window.location.href = CONFIG.homeRedirect;
            });
            
            console.log('🛡️ [Auth] System Initialized');
        } else {
            console.warn('⚠️ [Auth] Netlify Identity Widget not found on this page.');
        }
    };

    /**
     * Mendapatkan objek User saat ini
     * @returns {Object|null} Data user atau null jika belum login
     */
    const getUser = () => {
        if (window.netlifyIdentity) {
            return window.netlifyIdentity.currentUser();
        }
        return null;
    };

    /**
     * Memaksa user login (Membuka Modal)
     */
    const openLogin = () => {
        if (window.netlifyIdentity) {
            window.netlifyIdentity.open();
        }
    };

    /**
     * Fungsi Proteksi Halaman (Gatekeeper)
     * Pasang ini di halaman yang butuh login.
     */
    const requireAuth = () => {
        const user = getUser();
        if (!user) {
            console.warn('⛔ [Auth] Access Denied. Redirecting to login...');
            openLogin(); // Buka popup login
            // Opsional: Redirect ke home jika mau lebih ketat
            // window.location.href = CONFIG.homeRedirect; 
        } else {
            console.log('✅ [Auth] Access Granted for:', user.email);
        }
    };

    // Public API (Hanya fungsi ini yang bisa diakses dari luar)
    return {
        init: init,
        getUser: getUser,
        login: openLogin,
        logout: () => window.netlifyIdentity && window.netlifyIdentity.logout(),
        protect: requireAuth
    };

})();

// Export modul agar bisa dipakai di file lain
export default Auth;
