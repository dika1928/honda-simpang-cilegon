/**
 * ============================================================================
 * HONDA SIMPANG - RECOMMENDATION ENGINE (AI SALES)
 * ============================================================================
 * * Modul ini bertindak sebagai "Sales Digital".
 * * Menganalisa input user (Siapa, Untuk Apa, Budget) dan memberikan
 * * rekomendasi motor yang paling relevan beserta alasan persuasifnya.
 * *
 * * @module CategoryGen
 * * @author Andika Rendi Prakarsa
 */

const CategoryGen = (function() {
    'use strict';

    // ========================================================================
    // 1. DATABASE KECERDASAN PRODUK
    // ========================================================================
    // Database ini memetakan karakteristik motor dengan profil pembeli.
    // Score system: 1 (Kurang), 2 (Cukup), 3 (Sangat Cocok)
    const MOTOR_DB = [
        {
            id: 'beat-deluxe',
            name: 'Honda Beat Deluxe',
            img: '../assets/img/motor/beat-deluxe.jpg', // Pastikan nanti gambarnya ada
            tags: ['student', 'daily', 'low'],
            priceRange: '18 - 20 Jt',
            salesPitch: {
                student: "Sahabat terbaik pelajar! Sangat irit (60.6 km/liter), body ramping gampang nyalip, dan ada Power Charger buat HP kamu.",
                worker: "Pilihan paling ekonomis untuk komuter harian. Hemat biaya bensin, hemat perawatan.",
                mom: "Ringan banget dikendarai, standar tengah gampang dipasang, pas buat antar jemput anak sekolah."
            }
        },
        {
            id: 'genio-cbs',
            name: 'Honda Genio',
            img: '../assets/img/motor/genio.jpg',
            tags: ['student', 'style', 'low'],
            priceRange: '19 - 21 Jt',
            salesPitch: {
                default: "Desain casual fashionable! Lebih eksis dari Beat, tapi tetap irit dan harganya terjangkau."
            }
        },
        {
            id: 'scoopy-prestige',
            name: 'Honda Scoopy Prestige',
            img: '../assets/img/motor/scoopy.jpg',
            tags: ['student', 'style', 'medium', 'mom'],
            priceRange: '22 - 24 Jt',
            salesPitch: {
                student: "Trendsetter anak muda! Desain retro modern, fitur Smart Key (Keyless) bikin aman dari maling di parkiran kampus/sekolah.",
                mom: "Desain cantik dan elegan. Punya fitur hook barang yang fungsional buat belanjaan pasar."
            }
        },
        {
            id: 'vario-125',
            name: 'Honda Vario 125',
            img: '../assets/img/motor/vario-125.jpg',
            tags: ['worker', 'daily', 'medium'],
            priceRange: '23 - 25 Jt',
            salesPitch: {
                worker: "Keseimbangan sempurna! Bagasi muat helm open face, tangki bensin cukup besar, dan mesin bandel buat kerja keras tiap hari."
            }
        },
        {
            id: 'vario-160',
            name: 'Honda Vario 160 ABS',
            img: '../assets/img/motor/vario-160.jpg',
            tags: ['worker', 'sport', 'medium'],
            priceRange: '27 - 30 Jt',
            salesPitch: {
                worker: "Mesin 160cc eSP+ paling bertenaga di kelasnya. Gak perlu takut telat kerja, salip bus/truk enteng banget!",
                hobby: "Desain tajam dan sporty. Cocok buat kamu yang suka akselerasi responsif di lampu merah."
            }
        },
        {
            id: 'stylo-160',
            name: 'Honda Stylo 160',
            img: '../assets/img/motor/stylo-160.jpg',
            tags: ['hobby', 'style', 'medium', 'high'],
            priceRange: '28 - 31 Jt',
            salesPitch: {
                default: "Fashion meets Power! Desain retro klasiknya bikin kamu jadi pusat perhatian di tongkrongan, tapi mesinnya gahar 160cc."
            }
        },
        {
            id: 'pcx-160',
            name: 'Honda PCX 160',
            img: '../assets/img/motor/pcx-160.jpg',
            tags: ['worker', 'distance', 'high', 'hobby'],
            priceRange: '33 - 36 Jt',
            salesPitch: {
                worker: "Kenyamanan kelas atas (Big Scooter). Posisi kaki selonjoran, gak pegal walau macet atau perjalanan jauh serang-cilegon.",
                hobby: "Tampilan mewah dan elegan. Bagasi super luas (30 Liter), helm full face masuk!"
            }
        },
        {
            id: 'adv-160',
            name: 'Honda ADV 160',
            img: '../assets/img/motor/adv-160.jpg',
            tags: ['hobby', 'distance', 'high'],
            priceRange: '36 - 40 Jt',
            salesPitch: {
                default: "Siap segala medan! Suspensi Showa tabung empuk banget buat jalan rusak. Pilihan utama petualang sejati."
            }
        },
        {
            id: 'cbr-150r',
            name: 'Honda CBR 150R',
            img: '../assets/img/motor/cbr-150r.jpg',
            tags: ['hobby', 'sport', 'high'],
            priceRange: '37 - 42 Jt',
            salesPitch: {
                default: "Total Control. Feel balap sejati dengan fitur Assist & Slipper Clutch. Ganteng maksimal di jalan raya."
            }
        }
    ];

    // ========================================================================
    // 2. LOGIKA PENCOCOKAN (MATCHMAKING LOGIC)
    // ========================================================================
    
    /**
     * Mencari motor terbaik berdasarkan 3 parameter user.
     * Menggunakan sistem prioritas tag.
     */
    const getRecommendation = (userType, usage, budget) => {
        console.log(`🤖 AI Analyzing: ${userType} | ${usage} | ${budget}`);

        // 1. Filter Tahap Awal (Berdasarkan Budget Dulu - Paling Krusial)
        let candidates = MOTOR_DB.filter(motor => {
            // Jika budget 'high', dia bisa beli apa saja (termasuk low/med)
            if (budget === 'high') return true; 
            // Jika budget 'medium', dia bisa beli low & medium
            if (budget === 'medium') return motor.tags.includes('low') || motor.tags.includes('medium');
            // Jika budget 'low', hanya bisa beli low
            return motor.tags.includes('low');
        });

        // 2. Scoring System (Sistem Nilai)
        // Kita beri poin untuk setiap kecocokan tag
        const scoredCandidates = candidates.map(motor => {
            let score = 0;
            
            // Poin User Type (Student, Worker, etc)
            if (motor.tags.includes(userType)) score += 3;
            
            // Poin Usage (Daily, Sport, etc)
            if (motor.tags.includes(usage)) score += 5; // Usage bobotnya lebih besar
            
            return { ...motor, score };
        });

        // 3. Urutkan dari Score Tertinggi
        scoredCandidates.sort((a, b) => b.score - a.score);

        // 4. Ambil Pemenang (Juara 1)
        // Jika tidak ada yang cocok sama sekali, kembalikan 'Beat' sebagai default (Safe choice)
        const winner = scoredCandidates.length > 0 ? scoredCandidates[0] : MOTOR_DB[0];

        // 5. Generate Alasan (Sales Pitch) yang Dinamis
        // Jika ada pitch khusus untuk userType tersebut, pakai itu.
        // Jika tidak, pakai pitch default.
        const reason = winner.salesPitch[userType] || winner.salesPitch.default || winner.salesPitch[Object.keys(winner.salesPitch)[0]];

        return {
            id: winner.id,
            name: winner.name,
            img: winner.img,
            priceRange: winner.priceRange,
            reason: reason,
            waLink: generateWALink(winner.name, userType, usage)
        };
    };

    /**
     * Membuat Link WA Hasil Analisa
     */
    const generateWALink = (motorName, type, usage) => {
        const phone = "6281316445477";
        const text = `Halo Mas Andika, saya barusan coba fitur *Cari Motor* di web.
        
Profil saya:
👤 Tipe: ${type}
kegunaan: ${usage}

Hasil rekomendasinya: *${motorName}*
Apakah unit ini ready stock? Saya mau minta simulasi kreditnya.`;

        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    // ========================================================================
    // 3. PUBLIC API
    // ========================================================================
    return {
        analyze: getRecommendation
    };

})();

export default CategoryGen;
