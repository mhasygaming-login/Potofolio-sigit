export type AccentColor = 'blue' | 'red' | 'yellow' | 'green';

export const ACCENT_HEX_MAP: Record<AccentColor, string> = {
  blue: '#4285f4',
  red: '#ea4335',
  yellow: '#fbbc04',
  green: '#34a853',
};

export const BRAND_COLORS = [
  ACCENT_HEX_MAP.blue,
  ACCENT_HEX_MAP.red,
  ACCENT_HEX_MAP.yellow,
  ACCENT_HEX_MAP.green,
] as const;

export interface LightboxMedia {
  title: string;
  caption: string;
  src: string;
  alt: string;
}

export interface TechFilterState {
  tech: string;
  excludeSlug: string;
  sourceTitle: string;
}

export function tokenizeTechLabel(label: string): string[] {
  return label
    .split('/')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

export function projectMatchesTechnology(project: ProjectItem, tech: string): boolean {
  const targetTokens = tokenizeTechLabel(tech);
  if (targetTokens.length === 0) return false;
  return project.stack.some((item) => {
    const itemTokens = tokenizeTechLabel(item);
    return targetTokens.some((token) => itemTokens.includes(token));
  });
}

export type FeatureStatus = 'Berjalan' | 'Simulasi' | 'Eksperimen' | 'Belum Selesai';

export interface FeatureMatrixItem {
  name: string;
  status: FeatureStatus;
  note: string;
}

export interface ArchitectureStep {
  step: string;
  title: string;
  detail: string;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  label: string;
}

export interface ProjectItem {
  slug: string;
  title: string;
  subtitle: string;
  tier: 'utama' | 'eksperimen';
  category: string;
  year: string;
  accent: AccentColor;
  liveUrl: string;
  demoStatusNote: string;
  summary: string;
  stack: string[];
  screenshots: ProjectScreenshot[];
  problem: string;
  solutionApproach: string;
  architectureSummary: string;
  architectureSteps: ArchitectureStep[];
  privacyOrDisclaimer: {
    heading: string;
    points: string[];
  };
  myRole: {
    roleTitle: string;
    doneByMe: string[];
    aiAssisted: string[];
    collaboration: string;
    technicalChallenge: string;
    resolution: string;
    outcome: string;
  };
  featureMatrix: FeatureMatrixItem[];
  auditImprovements: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  roleTag: string;
  accent: AccentColor;
  items: {
    name: string;
    detail: string;
  }[];
}

export const PROFILE = {
  name: 'Sigit Hasyim Nasution',
  shortMark: 'SH',
  school: 'SMK Madinatul Quran',
  major: 'Teknik Komputer dan Jaringan (TKJ)',
  headlineRole: 'Siswa TKJ (Teknik Komputer & Jaringan)',
  supportingRole: 'Hobi Desain UI/UX (Figma) & Pembuatan Website',
  heroSummary:
    'Pelajar SMK Madinatul Quran jurusan Teknik Komputer dan Jaringan (TKJ) yang terbiasa mengonfigurasi jaringan di MikroTik, Cisco Packet Tracer, dan Linux Debian 12. Di luar materi jaringan, saya senang mendesain tampilan di Figma lalu mengembangkannya menjadi website.',
  focusLines: [
    'konfigurasi router dan jaringan di MikroTik',
    'simulasi topologi jaringan di Cisco Packet Tracer',
    'administrasi server dasar di Linux Debian 12',
    'desain antarmuka di Figma sebelum membuat website',
  ],
  aboutParagraphs: [
    'Saya adalah siswa SMK Madinatul Quran jurusan Teknik Komputer dan Jaringan (TKJ). Kegiatan belajar saya sehari-hari berfokus pada jaringan komputer, mulai dari mengatur router MikroTik, merancang simulasi topologi di Cisco Packet Tracer, sampai mengelola sistem dasar menggunakan Linux Debian 12.',
    'Di sekolah, saya juga mendapatkan pelajaran UI dan UX. Karena itu, setiap kali ingin membuat website, saya terbiasa merancang tampilannya terlebih dahulu di Figma supaya tata letak dan alurnya rapi sebelum mulai membuat kode.',
    'Saya bukan seorang developer ahli, melainkan pelajar TKJ yang hobi membuat website sebagai sarana latihan dan mencoba hal baru di luar jam praktik jaringan.',
  ],
  email: 'mhasy.gaming@gmail.com',
  instagram: {
    handle: '@mhasy_hasyim',
    url: 'https://www.instagram.com/mhasy_hasyim/',
  },
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'tkj-network',
    title: 'Jaringan & Sistem (TKJ)',
    roleTag: 'Fokus Utama',
    accent: 'blue',
    items: [
      {
        name: 'MikroTik',
        detail: 'Konfigurasi routing dasar, DHCP, NAT, firewall, dan manajemen bandwidth.',
      },
      {
        name: 'Cisco Packet Tracer',
        detail: 'Simulasi topologi jaringan, pembagian subnet IP, serta pengaturan VLAN.',
      },
      {
        name: 'Linux Debian 12',
        detail: 'Pengoperasian CLI, pengaturan jaringan dasar, hak akses file, dan layanan server.',
      },
    ],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    roleTag: 'Pelajaran Sekolah',
    accent: 'red',
    items: [
      {
        name: 'Figma',
        detail: 'Merancang wireframe, tata letak halaman, dan alur pengguna sebelum coding.',
      },
      {
        name: 'Kerapian & Keterbacaan',
        detail: 'Menjaga ukuran teks, jarak antar bagian, serta kontras warna agar nyaman dilihat.',
      },
    ],
  },
  {
    id: 'web-dev',
    title: 'Pembuatan Website',
    roleTag: 'Minat & Latihan',
    accent: 'yellow',
    items: [
      {
        name: 'HTML, CSS & Tailwind CSS',
        detail: 'Menerapkan desain dari Figma menjadi halaman web yang rapi di desktop dan HP.',
      },
      {
        name: 'JavaScript, React & TypeScript',
        detail: 'Mempelajari pembuatan komponen dan logika interaktif lewat proyek latihan.',
      },
      {
        name: 'Google AI Studio',
        detail: 'Digunakan sebagai alat bantu belajar dan penyusunan prototipe awal website.',
      },
    ],
  },
];

export const TOOLS_AND_PLATFORMS = [
  {
    category: 'Jaringan & Simulasi',
    name: 'MikroTik & Cisco Packet Tracer',
  },
  {
    category: 'Sistem Operasi',
    name: 'Linux Debian 12',
  },
  {
    category: 'Desain UI/UX',
    name: 'Figma',
  },
  {
    category: 'Kode & Hosting',
    name: 'GitHub & Vercel',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    slug: 'sakuku',
    title: 'SakuKu',
    subtitle: 'Pencatat Keuangan Pribadi Local-First dengan Analisis AI Opsional',
    tier: 'utama',
    category: 'Aplikasi Web',
    year: '2025',
    accent: 'blue',
    liveUrl: 'https://my-wallet-nine-zeta.vercel.app/',
    demoStatusNote: 'Live Demo · Local-First',
    summary:
      'Aplikasi pencatat pemasukan dan pengeluaran yang menyimpan data langsung di browser pengguna, lengkap dengan batas anggaran mingguan dan analisis AI opsional.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'LocalStorage', 'Gemini API'],
    screenshots: [
      {
        src: '/assets/aistudio/image_24d848bf.png',
        alt: 'Tampilan dashboard SakuKu dengan arus saldo pekan ini dan skor kesehatan keuangan AI',
        label: 'Dashboard & Analisis AI',
      },
      {
        src: '/assets/aistudio/image_5fb74451.png',
        alt: 'Tampilan halaman laporan bulanan SakuKu dengan rekapitulasi pemasukan dan pengeluaran',
        label: 'Laporan Bulanan',
      },
      {
        src: '/assets/aistudio/image_07726a38.png',
        alt: 'Tampilan halaman riwayat transaksi SakuKu dengan pencarian, filter kategori, dan ekspor CSV',
        label: 'Riwayat Transaksi',
      },
      {
        src: '/assets/aistudio/image_fcf99586.png',
        alt: 'Tampilan grafik tren pengeluaran mingguan SakuKu dan ringkasan pemasukan pengeluaran bulanan',
        label: 'Tren Pengeluaran Mingguan',
      },
    ],
    problem:
      'Banyak pencatat keuangan menuntut pembuatan akun dan menyimpan transaksi pribadi di server eksternal, sehingga kurang praktis dan berisiko dari sisi privasi.',
    solutionApproach:
      'Menyimpan seluruh transaksi di penyimpanan browser pengguna dengan kalkulasi saldo real-time, sementara Gemini AI hanya dipanggil saat pengguna meminta ringkasan.',
    architectureSummary:
      'State dan LocalStorage di browser sebagai sumber data utama, dengan permintaan ringkasan AI bersifat opsional.',
    architectureSteps: [
      {
        step: '01',
        title: 'Input Transaksi',
        detail: 'Isi nominal, kategori, tipe masuk/keluar, dan catatan dengan validasi otomatis.',
      },
      {
        step: '02',
        title: 'Simpan Lokal',
        detail: 'Data tersimpan langsung di LocalStorage perangkat tanpa kewajiban login.',
      },
      {
        step: '03',
        title: 'Hitung Saldo Instan',
        detail: 'Saldo, arus kas mingguan, dan persentase anggaran dihitung ulang otomatis.',
      },
      {
        step: '04',
        title: 'Ringkasan AI Opsional',
        detail: 'AI hanya membaca total agregat per kategori saat diminta pengguna.',
      },
    ],
    privacyOrDisclaimer: {
      heading: 'Privasi Data & Batasan AI',
      points: [
        'Data transaksi tersimpan lokal di browser pengguna dan dapat dihapus kapan saja.',
        'Fitur Gemini AI bersifat opsional; pencatatan dan laporan tetap berjalan tanpa AI.',
        'Hasil analisis AI hanya berupa ringkasan pola pengeluaran, bukan nasihat keuangan profesional.',
      ],
    },
    myRole: {
      roleTitle: 'UI/UX Designer & Front-end Developer',
      doneByMe: [
        'Merancang alur pencatatan dan tata letak dashboard di Figma.',
        'Membangun komponen form, grafik arus kas, dan laporan bulanan di React + Tailwind CSS.',
        'Mengimplementasikan penyimpanan LocalStorage dan deployment ke Vercel.',
      ],
      aiAssisted: [
        'Menyusun format prompt ringkasan kategori agar output lebih rapi.',
        'Membantu uji validasi format angka Rupiah dan tanggal.',
      ],
      collaboration: 'Proyek mandiri dari desain hingga deployment.',
      technicalChallenge:
        'Total saldo sempat tidak sinkron saat transaksi lama diedit atau dihapus.',
      resolution:
        'Menjadikan daftar transaksi sebagai satu-satunya sumber kebenaran agar saldo selalu dihitung ulang otomatis.',
      outcome:
        'Pencatatan transaksi berjalan cepat tanpa reload dengan batasan privasi yang jelas.',
    },
    featureMatrix: [
      {
        name: 'Tambah, Edit & Hapus Transaksi',
        status: 'Berjalan',
        note: 'Tersimpan persisten di penyimpanan lokal browser.',
      },
      {
        name: 'Batas Anggaran & Laporan Bulanan',
        status: 'Berjalan',
        note: 'Dihitung real-time dari daftar transaksi lokal.',
      },
      {
        name: 'Analisis Pengeluaran Gemini AI',
        status: 'Berjalan',
        note: 'Opsional atas permintaan pengguna menggunakan ringkasan agregat.',
      },
      {
        name: 'Sinkronisasi Cloud Multi-Perangkat',
        status: 'Belum Selesai',
        note: 'Belum ditambahkan untuk menjaga kesederhanaan model local-first.',
      },
    ],
    auditImprovements: [
      'Menjelaskan stack frontend dan model penyimpanan local-first secara eksplisit.',
      'Menambahkan alur kerja aplikasi dan batasan privasi data ke AI.',
    ],
  },
  {
    slug: 'kpk-intelligence',
    title: 'KPK Intelligence',
    subtitle: 'Dashboard Visualisasi Data Kasus & Edukasi Antikorupsi',
    tier: 'utama',
    category: 'Visualisasi Data · Proyek Sekolah',
    year: '2025',
    accent: 'green',
    liveUrl: 'https://kpk-2-0.vercel.app/',
    demoStatusNote: 'Proyek Sekolah Nonresmi',
    summary:
      'Dashboard edukasi untuk memetakan 10 kasus kerugian negara terbesar, distribusi per sektor, matriks risiko, dan materi antikorupsi dari referensi data publik.',
    stack: ['React', 'JavaScript', 'Tailwind CSS', 'Chart Visualization', 'JSON Dataset', 'Vercel'],
    screenshots: [
      {
        src: '/assets/aistudio/image_f6bb596f.png',
        alt: 'Tampilan beranda KPK Intelligence dengan ringkasan transparansi penindakan',
        label: 'Beranda Terminal',
      },
      {
        src: '/assets/aistudio/image_e00b2da7.png',
        alt: 'Tampilan Live Analytics KPK Intelligence dengan grafik 10 kasus terbesar dan distribusi sektor',
        label: 'Live Analytics',
      },
      {
        src: '/assets/aistudio/image_2d6ba8f3.png',
        alt: 'Tampilan terminal analitik keuangan dan live audit stream KPK Intelligence per sektor',
        label: 'Asset Intelligence Terminal',
      },
      {
        src: '/assets/aistudio/image_b0e125dd.png',
        alt: 'Tampilan halaman dossier pelaku kasus korupsi pada KPK Intelligence',
        label: 'Dossier Pelaku',
      },
    ],
    problem:
      'Laporan penindakan korupsi umumnya berbentuk dokumen panjang sehingga sulit dipahami cepat berdasarkan sektor dan nilai kerugian negara.',
    solutionApproach:
      'Menyajikan ringkasan dataset publik dalam grafik batang, grafik donat, filter sektor, dan label keterangan proyek sekolah nonresmi.',
    architectureSummary:
      'Dashboard statis berbasis dataset JSON terkurasi dengan filter sisi klien dan label disclaimer transparan.',
    architectureSteps: [
      {
        step: '01',
        title: 'Kurasi Dataset Terbuka',
        detail: 'Merangkum laporan publik ke struktur JSON latihan dengan catatan tanggal pembaruan.',
      },
      {
        step: '02',
        title: 'Normalisasi Nominal & Sektor',
        detail: 'Mengelompokkan sektor kasus dan menyeragamkan skala Miliar/Triliun.',
      },
      {
        step: '03',
        title: 'Filter & Grafik Client-Side',
        detail: 'Grafik batang, donat, dan matriks risiko diperbarui instan di browser.',
      },
      {
        step: '04',
        title: 'Edukasi & Simulasi KWS',
        detail: 'Materi edukasi antikorupsi dan formulir pengaduan berlabel simulasi.',
      },
    ],
    privacyOrDisclaimer: {
      heading: 'Status Nonresmi & Sumber Data',
      points: [
        'Proyek tugas sekolah independen dan BUKAN situs resmi KPK RI.',
        'Dataset menggunakan referensi publik yang disederhanakan untuk latihan visualisasi (Maret 2025).',
        'Formulir pengaduan dan ekspor laporan hanya simulasi antarmuka, tidak terhubung ke kanal resmi.',
      ],
    },
    myRole: {
      roleTitle: 'Perancang Tampilan & Pembuatan Web',
      doneByMe: [
        'Menyusun struktur dashboard, kategori sektor, dan halaman edukasi.',
        'Mengonversi data referensi terbuka menjadi file JSON dan komponen grafik.',
        'Menambahkan label disclaimer nonresmi serta transparansi status fitur.',
      ],
      aiAssisted: [
        'Membantu format angka Rupiah skala besar dan responsivitas tabel.',
      ],
      collaboration: 'Proyek tugas individu sekolah dengan presentasi di kelas.',
      technicalChallenge:
        'Selisih nominal antara ratusan miliar dan puluhan triliun membuat grafik kasus kecil sulit terbaca.',
      resolution:
        'Menggunakan label ringkas (M/T), tooltip angka lengkap, dan pemeringkatan Top 10.',
      outcome:
        'Visualisasi data tampil informatif, mudah difilter, dan jujur dalam mencantumkan sumber serta status simulasi.',
    },
    featureMatrix: [
      {
        name: 'Grafik Top 10 & Distribusi Sektor',
        status: 'Berjalan',
        note: 'Menggunakan dataset JSON latihan berbasis referensi publik.',
      },
      {
        name: 'Filter Sektor & Matriks Risiko',
        status: 'Berjalan',
        note: 'Berjalan di sisi klien tanpa database backend.',
      },
      {
        name: 'Halaman Edukasi Antikorupsi',
        status: 'Berjalan',
        note: 'Ringkasan materi pembelajaran untuk siswa.',
      },
      {
        name: 'Formulir Pengaduan KWS',
        status: 'Simulasi',
        note: 'Hanya demonstrasi UI; tidak mengirim laporan ke instansi resmi.',
      },
    ],
    auditImprovements: [
      'Menegaskan status tugas sekolah nonresmi agar tidak disalahartikan sebagai portal pemerintah.',
      'Memisahkan fitur filter aktif dari formulir simulasi antarmuka.',
    ],
  },
  {
    slug: 'gantthers-barbershop',
    title: 'Gantthers Barbershop',
    subtitle: 'Website Company Profile Barbershop (Studi Kasus Bisnis Fiktif)',
    tier: 'utama',
    category: 'Company Profile · Proyek Sekolah',
    year: '2025',
    accent: 'yellow',
    liveUrl: 'https://training-oi-brown.vercel.app/',
    demoStatusNote: 'Bisnis Fiktif · Konten Diaudit',
    summary:
      'Website profil barbershop berpalet gelap-merah dengan halaman layanan, galeri, blog, dan simulasi booking yang telah diaudit konsistensi datanya.',
    stack: ['HTML5', 'CSS3 / Tailwind CSS', 'JavaScript', 'Figma', 'Vercel'],
    screenshots: [
      {
        src: '/assets/aistudio/image_de9c76d1.png',
        alt: 'Tampilan halaman beranda dan profil perusahaan Gantthers Barbershop',
        label: 'Beranda & Profil',
      },
      {
        src: '/assets/aistudio/image_bf3108c2.png',
        alt: 'Tampilan bagian profil statistik cabang dan pelanggan Gantthers Barbershop',
        label: 'Statistik & Profil',
      },
      {
        src: '/assets/aistudio/image_760ab1ae.png',
        alt: 'Tampilan jam operasional khusus dan daftar artikel blog Gantthers Barbershop',
        label: 'Jam Buka & Blog',
      },
      {
        src: '/assets/aistudio/image_7da869d0.png',
        alt: 'Tampilan bagian artikel perawatan rambut dan footer Gantthers Barbershop',
        label: 'Artikel & Footer',
      },
    ],
    problem:
      'Versi demo awal memiliki ketidakkonsistenan teks template seperti tahun berdiri berbeda (2009 vs 2010), metrik pelanggan bentrok, dan klaim berlebihan.',
    solutionApproach:
      'Melakukan audit konten menyeluruh: menyeragamkan tahun berdiri simulasi (2010), membersihkan klaim hiperbolis, dan melabeli fitur booking sebagai simulasi.',
    architectureSummary:
      'Situs multi-seksi statis dengan katalog layanan terstruktur dan form simulasi reservasi sisi klien.',
    architectureSteps: [
      {
        step: '01',
        title: 'Audit Konsistensi Konten',
        detail: 'Memeriksa ulang angka statistik, tahun berdiri, dan daftar harga agar seragam.',
      },
      {
        step: '02',
        title: 'Desain Gelap-Merah',
        detail: 'Menjaga kontras teks tetap nyaman dibaca di atas permukaan gelap.',
      },
      {
        step: '03',
        title: 'Layanan, Galeri & Blog',
        detail: 'Menyusun katalog cukur, galeri gaya rambut, dan artikel perawatan.',
      },
      {
        step: '04',
        title: 'Simulasi Booking',
        detail: 'Menampilkan ringkasan pilihan paket dan jadwal tanpa transaksi nyata.',
      },
    ],
    privacyOrDisclaimer: {
      heading: 'Keterangan Studi Kasus Fiktif',
      points: [
        'Gantthers Barbershop adalah merek fiktif untuk latihan pembuatan company profile di sekolah.',
        'Klaim hiperbolis dihapus dan metrik simulasi diseragamkan agar konsisten.',
        'Alur booking bersifat simulasi antarmuka dan tidak terhubung ke sistem toko nyata.',
      ],
    },
    myRole: {
      roleTitle: 'UI Designer & Front-end Developer',
      doneByMe: [
        'Merancang konsep visual gelap dengan aksen merah di Figma dan mengkodekan layout responsif.',
        'Mengaudit dan memperbaiki inkonsistensi statistik, tahun berdiri, dan teks template.',
        'Menambahkan label simulasi pada fitur pemesanan jadwal.',
      ],
      aiAssisted: [
        'Membantu draf awal artikel blog perawatan rambut sebelum disunting ulang.',
      ],
      collaboration: 'Proyek sekolah individu dengan evaluasi masukan desain dan konten.',
      technicalChallenge:
        'Menjaga keterbacaan teks pada tema gelap-merah tanpa membuat warna merah mendominasi konten.',
      resolution:
        'Membatasi aksen merah hanya pada tombol aksi dan penanda utama, serta memusatkan data profil.',
      outcome:
        'Menunjukkan kemampuan desain web sekaligus ketelitian dalam mengaudit kualitas dan kejujuran konten demo.',
    },
    featureMatrix: [
      {
        name: 'Profil, Layanan, Galeri & Blog',
        status: 'Berjalan',
        note: 'Navigasi responsif dengan data simulasi bisnis fiktif yang konsisten.',
      },
      {
        name: 'Simulasi Booking Layanan',
        status: 'Simulasi',
        note: 'Ringkasan jadwal di browser; tidak tersimpan ke database toko.',
      },
      {
        name: 'Audit Statistik & Konten',
        status: 'Berjalan',
        note: 'Seluruh angka dan tahun berdiri telah diseragamkan.',
      },
    ],
    auditImprovements: [
      'Menghapus kontradiksi statistik dan klaim hiperbolis tanpa bukti.',
      'Melabeli proyek sebagai studi kasus bisnis fiktif dengan booking simulasi.',
    ],
  },
  {
    slug: 'escape-the-police',
    title: 'Escape the Police: Cyber Pursuit',
    subtitle: 'Prototipe Game Web Arcade Bergaya Neon',
    tier: 'eksperimen',
    category: 'Eksperimen Game · AI Studio',
    year: '2025',
    accent: 'red',
    liveUrl: 'https://escape-police.vercel.app/',
    demoStatusNote: 'Prototipe Eksperimental',
    summary:
      'Game arcade kejar-kejaran mobil di jalanan neon dengan fitur nitro, pulsa EMP, dan sistem bounty yang berjalan single-player di browser.',
    stack: ['HTML5 Canvas', 'JavaScript / TypeScript', 'Google AI Studio', 'Vercel'],
    screenshots: [
      {
        src: '/assets/aistudio/image_f59ec60e.png',
        alt: 'Layar loading Cyber Pursuit dengan tachometer neon dan indikator turbo',
        label: 'Loading & Speedometer HUD',
      },
      {
        src: '/assets/aistudio/image_e049b6ce.png',
        alt: 'Tampilan lobby Escape the Police untuk memilih arena balap dan tingkat kesulitan',
        label: 'Lobby & Pilih Arena',
      },
      {
        src: '/assets/aistudio/image_e85edb0d.png',
        alt: 'Tampilan garasi dan armada mobil Escape the Police lengkap dengan perbandingan performa mesin',
        label: 'Garasi & Armada',
      },
      {
        src: '/assets/aistudio/image_d4ad03ad.png',
        alt: 'Tampilan gameplay Escape the Police dengan mobil polisi, bar nitro, dan pulsa EMP',
        label: 'Gameplay Kejar-Kejaran',
      },
    ],
    problem:
      'Mengeksplorasi pembuatan prototipe game arcade 60 FPS di browser lengkap dengan HUD speedometer, cooldown skill EMP, dan eskalasi pengejar.',
    solutionApproach:
      'Memfokuskan demo pada core gameplay single-player yang stabil, serta memisahkan ide multiplayer dan desktop build ke roadmap eksperimen.',
    architectureSummary:
      'Loop rendering lokal 60 FPS di browser; arsitektur multiplayer Socket.IO baru sebatas rancangan konsep.',
    architectureSteps: [
      {
        step: '01',
        title: 'Kendali Mobil & Skill (Berjalan)',
        detail: 'Kontrol keyboard/sentuhan untuk manuver, Nitro boost, dan pulsa EMP.',
      },
      {
        step: '02',
        title: 'AI Pengejar & Bounty (Berjalan)',
        detail: 'Skor bounty dan intensitas pengejar meningkat seiring level bertahan.',
      },
      {
        step: '03',
        title: 'Konsep Multiplayer (Eksperimen)',
        detail: 'Rancangan sinkronisasi room WebSocket masih di tahap arsitektur.',
      },
      {
        step: '04',
        title: 'Replay & Desktop (Belum Selesai)',
        detail: 'Ghost Replay dan build Electron masih berupa rencana pengembangan.',
      },
    ],
    privacyOrDisclaimer: {
      heading: 'Ruang Lingkup Eksperimen',
      points: [
        'Merupakan eksperimen eksplorasi game browser dengan Google AI Studio.',
        'Fitur yang aktif dimainkan saat ini adalah mode single-player core pursuit.',
        'Multiplayer, Ghost Replay, dan build desktop tidak diklaim sudah selesai.',
      ],
    },
    myRole: {
      roleTitle: 'Game Concept, Balancing & HUD Tester',
      doneByMe: [
        'Menentukan mekanik nitro vs EMP, tata letak HUD, dan kurva kesulitan level.',
        'Menguji responsivitas kontrol browser dan menyeimbangkan kecepatan pengejar.',
        'Memisahkan status fitur aktif dari rancangan eksperimen agar transparan.',
      ],
      aiAssisted: [
        'Menggunakan Google AI Studio untuk kerangka rendering jalanan neon dan efek visual.',
      ],
      collaboration: 'Eksperimen mandiri dengan bantuan AI.',
      technicalChallenge:
        'Penurunan frame rate saat efek partikel nitro dan jumlah mobil polisi meningkat.',
      resolution:
        'Membatasi jumlah partikel aktif bersamaan dan memakai deteksi tabrakan bounding-box ringan.',
      outcome:
        'Core gameplay single-player berjalan lancar dengan pemetaan status fitur yang jujur.',
    },
    featureMatrix: [
      {
        name: 'Core Gameplay (Mobil, Nitro, EMP, Bounty)',
        status: 'Berjalan',
        note: 'Dapat dimainkan langsung di tautan Live Demo.',
      },
      {
        name: 'HUD Speedometer & Layar Loading',
        status: 'Berjalan',
        note: 'Berfungsi penuh pada versi web.',
      },
      {
        name: 'Multiplayer 2 Pemain (Socket.IO)',
        status: 'Eksperimen',
        note: 'Baru berupa rancangan komunikasi client-server.',
      },
      {
        name: 'Ghost Replay & Build Desktop',
        status: 'Belum Selesai',
        note: 'Masih pada tahap konsep lanjutan.',
      },
    ],
    auditImprovements: [
      'Menghapus klaim fitur lanjutan yang belum tersedia di demo publik.',
      'Menambahkan matriks status fitur dan porsi kontribusi pribadi vs AI Studio.',
    ],
  },
];

export const CISCO_CERTIFICATE = {
  title: 'Networking Basics — Cisco Networking Academy',
  subtitle: 'Dasar-Dasar Jaringan SMK Madinatul Quran',
  organizer: 'SMK Madinatul Quran · Cisco Networking Academy',
  recipientName: 'hasyim nasution',
  instructor: 'Fathi Muhammad Shalahuddin',
  issuedDate: '27 September 2025',
  totalHours: '22 Jam',
  summary:
    'Menyelesaikan kursus dasar jaringan komputer mencakup media jaringan, jenis jaringan, layanan lapisan aplikasi, pengalamatan IPv4, akses nirkabel, dan protokol standar.',
  skillsLine:
    'Media Jaringan · Jenis Jaringan · Layanan Lapisan Aplikasi · Alamat IPv4 · Akses Nirkabel · Protokol Standar',
  previewImage: {
    title: 'Sertifikat Networking Basics — Cisco Networking Academy',
    caption: 'Diterbitkan 27 September 2025 · SMK Madinatul Quran (22 Jam)',
    src: '/assets/aistudio/cisco_networking_basics_cert.png',
    alt: 'Sertifikat kelulusan resmi Networking Basics Cisco Networking Academy atas nama hasyim nasution dari SMK Madinatul Quran',
  },
  pdfUrl:
    '/assets/aistudio/Networking_Basics_certificate_mhasy-gaming-gmail-com_4e1eb55f-56e5-47bd-8899-5570ff248ffb_59eb96ba.pdf',
};

export const ACHIEVEMENT = {
  title: 'Data Detective Bootcamp 2026: Pelatihan Business Analytics',
  subtitle: 'Pelatihan Business Analytics bagi Siswa SMK/SMA/MA Se-Indonesia',
  organizer: 'Laboratory of Social Simulation and Big Data Analytics (SSBDA), SBM ITB',
  participationType: 'Certificate of Completion — Lulus 6 Modul Pelatihan (Tim: Gokfive)',
  period: '12 September – 7 November 2026',
  graduationLocation: 'SBM ITB, Jl. Ganesa No. 10, Bandung (Sabtu, 7 November 2026)',
  signatory: 'Prof. Dr.Eng. Pri Hermawan, S.T., M.T. (Head of SSBDA Laboratory SBM ITB)',
  scopeNote:
    'Berhasil menuntaskan seluruh rangkaian pelatihan intensif selama 6 modul mencakup Marketing Analytics, Finance Analytics, dan Dashboard Data Analytics hingga wisuda di SBM ITB Bandung.',
  skillsPracticed: [
    'Marketing Analytics & pembacaan perilaku data pasar',
    'Finance Analytics & analisis metrik keuangan terstruktur',
    'Penyusunan Dashboard Business Analytics untuk pengambilan keputusan',
  ],
  verificationChecklist: [
    { label: 'Program Resmi', value: 'Data Detective Bootcamp 2026 (SMK/SMA/MA Se-Indonesia)' },
    { label: 'Penyelenggara', value: 'SSBDA Laboratory — SBM ITB (bersama Disdik Jabar & MKKS SMK)' },
    { label: 'Nama / Tim di Sertifikat', value: 'Gokfive (Certificate of Completion)' },
    { label: 'Periode & Kelulusan', value: '12 September – 7 November 2026 · SBM ITB, Bandung' },
  ],
  documents: [
    {
      id: 'cert',
      title: 'Certificate of Completion — Data Detective Bootcamp 2026',
      caption: 'Sertifikat kelulusan resmi dari SSBDA Laboratory SBM ITB (Tim Gokfive · 6 Modul)',
      src: '/assets/aistudio/Congrats__Data_Detective__ed213763.png',
      alt: 'Certificate of Completion Data Detective Bootcamp 2026 untuk Gokfive dari SSBDA SBM ITB',
    },
    {
      id: 'grad',
      title: 'Graduation Party Invitation — SBM ITB Bandung',
      caption: 'Dokumentasi acara wisuda 7 November 2026 di SBM ITB, Jl. Ganesa No. 10, Bandung',
      src: '/assets/aistudio/image_566234ce.png',
      alt: 'Undangan Graduation Party Data Detective Bootcamp 2026 di SBM ITB Bandung pada 7 November 2026',
    },
  ],
};
