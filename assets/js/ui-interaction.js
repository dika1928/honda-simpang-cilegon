/**
 * ============================================================================
 * HONDA SIMPANG - UI INTERACTION MODULE
 * ============================================================================
 * * Mengatur interaksi antarmuka global (Navbar, Format Uang, Animasi).
 */

const UI = (function() {
    'use strict';

    /**
     * Format angka ke Rupiah (Rp 15.000.000)
     */
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    /**
     * Toggle Menu Mobile (Hamburger)
     * Biar menu bisa dibuka-tutup di HP.
     */
    const initMobileMenu = () => {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav-links');

        if (toggle && nav) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation(); 
                nav.classList.toggle('active');
                
                // Ubah ikon jadi X kalau aktif
                toggle.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
            });

            // Tutup menu kalau klik di luar
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                    nav.classList.remove('active');
                    toggle.innerHTML = '☰';
                }
            });
        }
    };

    /**
     * Efek Sticky Navbar saat discroll
     * Biar navbar ada bayangannya pas digulir ke bawah.
     */
    const initStickyNav = () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.15)";
                } else {
                    navbar.style.boxShadow = "0 5px 15px rgba(0,0,0,0.08)";
                }
            });
        }
    };

    /**
     * Menampilkan Notifikasi Toast (Pesan Singkat di bawah layar)
     */
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = message;
        
        // Style sederhana buat notifikasi
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: type === 'success' ? '#25d366' : '#E10600',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '50px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            zIndex: '9999',
            opacity: '0',
            transition: '0.3s'
        });

        document.body.appendChild(toast);

        // Animasi masuk
        setTimeout(() => toast.style.opacity = '1', 10);

        // Hapus otomatis setelah 3 detik
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Jalankan otomatis saat file dimuat
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initStickyNav();
    });

    // Biar fungsi ini bisa dipakai file lain
    return {
        formatRupiah,
        showToast
    };

})();

export default UI;
