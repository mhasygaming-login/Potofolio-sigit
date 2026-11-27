# Sigit Hasyim Nasution — TKJ & Web Portfolio

Personal portfolio of **Sigit Hasyim Nasution**, a **Teknik Komputer dan Jaringan (TKJ)** vocational high school student at **SMK Madinatul Quran** who practices network engineering (**MikroTik**, **Cisco Packet Tracer**, **Linux Debian 12**) and builds web interfaces designed first in **Figma**.

**Language / Bahasa:** [English](#english) · [Bahasa Indonesia](#bahasa-indonesia)

---

<a id="english"></a>

## English

### 1. Portfolio Showcase Overview

This web application presents Sigit's vocational networking background alongside UI/UX case studies and front-end web practice projects. Rather than disguising school assignments as production enterprise software, every project explicitly documents:

- **Problem & Solution Approach** — What problem the project explores and how it was structured.
- **My Role & Contribution** — Clear separation between manual work (Figma layout, component logic, deployment) and AI-assisted parts.
- **Honest Feature Matrix** — Transparent status badges (`Berjalan` / Active, `Simulasi` / Simulation, `Eksperimen` / Experimental, `Belum Selesai` / Incomplete).

#### Featured Projects & Credentials

| Category | Item | Highlight |
| :--- | :--- | :--- |
| **Main Project** | **SakuKu** | Local-first personal finance tracker with browser `LocalStorage` persistence and optional Gemini AI summary. |
| **Main Project** | **KPK Intelligence** | Non-official school data visualization dashboard mapping public anti-corruption case datasets and sector charts. |
| **Main Project** | **Gantthers Barbershop** | Fictional business company profile audited for metric consistency and clear booking simulation labeling. |
| **Experiment** | **Escape the Police: Cyber Pursuit** | 60 FPS neon browser arcade prototype built as a UI/gameplay experiment in Google AI Studio. |
| **Certification** | **Networking Basics** | Cisco Networking Academy · SMK Madinatul Quran (22 hours, issued September 27, 2025). |
| **Achievement** | **Data Detective Bootcamp 2026** | SSBDA Laboratory, SBM ITB — 6-module Business Analytics completion (Team Gokfive). |

---

### 2. TKJ-Themed Design Philosophy

The visual language is rooted in **TKJ (Computer & Network Engineering)** discipline combined with structured **Figma-first UI/UX**:

1. **Blueprint & Topology Clarity**
   - Subtle `.dot-grid-canvas` radial-masked backgrounds echo technical graph paper and network topology canvases without cluttering typography.
   - Clean `1px` hairline dividers (`--line`) and generous whitespace organize sections like modular network racks rather than floating card soup.
2. **Authentic Vocational Identity (`TKJ PASS`)**
   - The Hero section features an interactive hanging name tag for **SMK Madinatul Quran · Teknik Komputer & Jaringan**, paired with rotating practice lines (`MikroTik`, `Cisco Packet Tracer`, `Linux Debian 12`, `Figma`).
   - The About section centers around a tactile, two-sided **TKJ PASS** badge card that flips between student credentials and quick-access practice focus + contact actions.
3. **4-Color Signal Rhythm**
   - Uses a focused 4-color accent system (`#4285f4` Blue, `#ea4335` Red, `#fbbc04` Yellow, `#34a853` Green) across section `< >` bracket icons, top card accent strips, chevron brackets, and the sequential top viewport scroll progress bar.
4. **Engineering Honesty & Transparency**
   - Just like network documentation requires accurate topology diagrams and interface states, each project includes a clear disclaimer, technical challenge + resolution notes, and realistic feature status tables.

---

### 3. Tech Stack & Motion Architecture

#### Core Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **UI Framework** | **React 19** (`react`, `react-dom`) | Modular functional components, client routing state, and history navigation. |
| **Language** | **TypeScript** (`tsc --noEmit`) | Strict static typing for project data, filter states, and component props. |
| **Styling** | **Tailwind CSS v4** (`@tailwindcss/vite`) | Utility-first responsive layout driven by CSS custom property tokens in `src/index.css`. |
| **Build Tool** | **Vite 8** (`@vitejs/plugin-react`) | Fast development server (port `3000`) and optimized static production bundle. |
| **Icons & Type** | **Lucide React**, **Plus Jakarta Sans**, **JetBrains Mono** | Crisp technical iconography paired with geometric sans display/body copy and monospace metadata. |

#### Motion & Scroll Architecture

- **Lenis (`lenis`)**: Provides weighted, responsive smooth wheel and touch scrolling synchronized with GSAP's animation ticker (`useSmoothScroll`). Automatically pauses while modals/lightboxes are open.
- **GSAP + ScrollTrigger (`gsap`, `gsap/ScrollTrigger`)**: Powers deep, deliberate `expo.out` entrance reveals for section headings (`SectionHeading`) and staggered text blocks (`[data-gsap-fade]`) using safe standalone `ScrollTrigger.create` instances.
- **Motion (`motion/react`)**: Drives spring-based card entrances, hover elevation, the sequential 4-color `ScrollProgressBar`, Hero entrance choreography, and dual-axis parallax on carousel screenshots.
- **Reduced Motion Compliance**: Every Lenis, GSAP, and Motion effect checks `useReducedMotion()` and `@media (prefers-reduced-motion: reduce)` to disable non-essential motion cleanly.

---

### 4. Interactive Features & Project Filtering

- **Project Carousel with Dual-Axis Parallax (`ProjectCarousel`)**:
  - Supports pointer drag, touch swipe, prev/next buttons, and keyboard `ArrowLeft` / `ArrowRight` navigation.
  - Project screenshots apply subtle vertical scroll parallax (`±10px`) synced with horizontal slide-drag depth (`±12px`).
- **Cross-Project Technology Tag Filtering**:
  - Inside any **Project Detail Page**, each technology pill (`React`, `Tailwind CSS`, `TypeScript`, `JavaScript`, `Vercel`, etc.) is clickable and displays `+N` when other projects share that stack.
  - Clicking a tag returns to the `#project` section on the main page and filters the carousel to show **only other projects** using that technology (supporting composite labels such as `CSS3 / Tailwind CSS` or `JavaScript / TypeScript`).
  - Includes an active technology filter bar with a quick **Hapus filter** reset, highlighted matching stack labels inside filtered carousel cards, and a helpful empty state if no other project shares the tag yet.
- **Category Tier Filter Tabs**: Switch between `Utama (3)`, `Semua (4)`, and `Eksperimen (1)` directly above the carousel.
- **Quick Navigation Command Palette (`Ctrl+K` / `Cmd+K`)**: Instant keyboard-accessible search modal (`↑↓`, `Enter`, `Esc`) to jump to sections, open any project case study, preview certificates, or copy contact email.
- **Interactive Detail Previews (`ProjectVisualPreview`) & `MediaLightbox`**: Live interactive UI demos inside project detail pages plus click-to-zoom modal inspection for all project screenshots and certificates.
- **Hero Micro-Interactions**: Pointer parallax on the four-color `< >` chevrons and portrait frame, draggable spark/wave stickers, and click-to-burst confetti on the chevron brackets.

---

### 5. Light & Dark Contrast System

To prevent cards and secondary text from washing out in bright **Chrome Light Mode** while keeping dark mode comfortable, `src/index.css` defines explicit adaptive tokens (`color-scheme: light dark`):

| Token | Light Mode | Dark Mode | Role |
| :--- | :--- | :--- | :--- |
| `--bg` | `#ffffff` | `#121317` | Main canvas background |
| `--surface` | `#e4ecf7` | `#1b1d23` | Tinted card & panel surfaces with strong separation against `--bg` |
| `--surface-elevated` | `#ffffff` | `#22252d` | Elevated cards, headers, and dialog panels |
| `--surface-tonal` | `#cfe0fc` | `rgba(138, 180, 248, 0.16)` | Tonal action pills and keyboard shortcuts |
| `--line` | `#bcc8dc` | `#343844` | High-clarity borders and hairline dividers |
| `--text` / `--muted` | `#12151a` / `#3b424d` | `#f3f5f7` / `#b4b9c2` | High-contrast primary and secondary typography |
| `--action` | `#1a73e8` | `#8ab4f8` | Primary interactive links, buttons, and active indicators |

---

### 6. Project Directory Overview

```text
.
├── index.html                      # Entry HTML, fonts (Plus Jakarta Sans & JetBrains Mono), SEO/OG & Schema.org metadata
├── package.json                    # Dependencies and Vite/TypeScript scripts
├── vite.config.ts                  # Vite 8 + React + Tailwind v4 configuration (port 3000 dev setup)
├── public/
│   ├── og-preview.svg              # Open Graph preview graphic
│   └── assets/aistudio/            # Portrait photo, project screenshots, Cisco PDF/PNG & SBM ITB certificates
└── src/
    ├── main.tsx                    # React root mount
    ├── index.css                   # Tailwind v4 import, light/dark tokens, Lenis & dot-grid utility styles
    ├── App.tsx                     # View routing state (home vs detail), History API sync, tier & tech filters
    ├── data/
    │   └── portfolioData.ts        # Profile copy, TKJ skills, projects, certificates & tech-matching helpers
    ├── hooks/
    │   └── useSmoothScroll.ts      # Lenis smooth scroll + GSAP ScrollTrigger lifecycle & section fades
    └── components/
        ├── ScrollProgressBar.tsx   # Fixed 4-color sequential viewport progress indicator
        ├── Navbar.tsx              # Sticky top header + compact mobile bottom navigation bar
        ├── Hero.tsx                # Staggered Hero entrance, portrait framing, TKJ name tag, stickers & confetti
        ├── HomeSections.tsx        # About, Skills, Project filter/showcase, Achievements & Contact sections
        ├── TkjIdentityCard.tsx     # Interactive two-sided TKJ PASS credential card
        ├── SectionHeading.tsx      # GSAP ScrollTrigger animated < > section headers
        ├── ProjectCarousel.tsx     # Draggable/keyboard carousel with dual-axis screenshot parallax
        ├── ProjectDetailPage.tsx   # Full case-study view with clickable tech tags, architecture & feature matrix
        ├── ProjectVisualPreview.tsx# Interactive embedded demonstrations per project
        ├── CommandPalette.tsx      # Ctrl+K / Cmd+K quick navigation modal
        └── MediaLightbox.tsx       # Full-screen zoom modal for project screenshots and certificates
```

---

### 7. Local Development & Build Commands

#### Prerequisites

- **Node.js** 18+ (recommended LTS)
- **npm** (or **Bun** — lockfile included)

#### Setup & Scripts

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (runs at http://localhost:3000)
npm run dev

# 3. Run TypeScript static typecheck
npm run lint

# 4. Build optimized production bundle into dist/
npm run build

# 5. Preview the production build locally
npm run preview

# 6. Clean build output
npm run clean
```

---

<a id="bahasa-indonesia"></a>

## Bahasa Indonesia

### 1. Ringkasan Portofolio

Aplikasi web ini merupakan portofolio pribadi **Sigit Hasyim Nasution**, siswa jurusan **Teknik Komputer dan Jaringan (TKJ)** di **SMK Madinatul Quran**. Situs ini memadukan latar belakang praktik jaringan komputer (**MikroTik**, **Cisco Packet Tracer**, dan **Linux Debian 12**) dengan ketertarikan pada desain **UI/UX di Figma** serta pembuatan website latihan.

Setiap proyek di dalamnya ditulis secara jujur dan terstruktur, mencakup:

- **Masalah & Pendekatan Solusi** — Konteks masalah yang diselesaikan dan alur arsitekturnya.
- **My Role & Contribution** — Pemisahan jelas antara bagian yang dikerjakan sendiri dan bagian yang dibantu AI.
- **Matriks Status Fitur** — Pelabelan jujur untuk setiap fitur (`Berjalan`, `Simulasi`, `Eksperimen`, atau `Belum Selesai`).

#### Proyek & Pencapaian yang Ditampilkan

| Kategori | Judul | Ringkasan |
| :--- | :--- | :--- |
| **Proyek Utama** | **SakuKu** | Pencatat keuangan pribadi *local-first* berbasis `LocalStorage` browser dengan analisis AI opsional. |
| **Proyek Utama** | **KPK Intelligence** | Proyek sekolah nonresmi untuk visualisasi dataset publik kasus korupsi dan distribusi sektor. |
| **Proyek Utama** | **Gantthers Barbershop** | Website *company profile* studi kasus bisnis fiktif dengan audit konsistensi data dan simulasi booking. |
| **Eksperimen** | **Escape the Police: Cyber Pursuit** | Prototipe game web arcade neon 60 FPS yang dibuat sebagai eksperimen UI dan gameplay di Google AI Studio. |
| **Sertifikat** | **Networking Basics** | Cisco Networking Academy · SMK Madinatul Quran (22 jam, terbit 27 September 2025). |
| **Pencapaian** | **Data Detective Bootcamp 2026** | SSBDA Laboratory, SBM ITB — Lulus 6 modul pelatihan Business Analytics (Tim Gokfive). |

---

### 2. Filosofi Desain Bertema TKJ

Identitas visual portofolio ini dibangun dari karakter pelajar **TKJ** dan kebiasaan merancang antarmuka terlebih dahulu di **Figma**:

1. **Kejelasan ala Topologi & Blueprint**
   - Latar bertekstur halus `.dot-grid-canvas` menyerupai kertas gambar teknik dan kanvas topologi jaringan tanpa mengganggu keterbacaan teks.
   - Garis pemisah `1px` (`--line`) dan komposisi rapi memisahkan tiap bagian layaknya struktur perangkat yang tertata.
2. **Identitas Pelajar TKJ yang Autentik (`TKJ PASS`)**
   - Bagian Hero menampilkan kartu gantung *name tag* **SMK Madinatul Quran · Teknik Komputer & Jaringan**, dilengkapi baris aktivitas bergantian (`MikroTik`, `Cisco Packet Tracer`, `Linux Debian 12`, `Figma`).
   - Bagian Tentang Saya menghadirkan kartu **TKJ PASS** dua sisi yang dapat dibalik antara ringkasan identitas siswa dan akses cepat fokus praktik + kontak.
3. **Ritme 4 Warna Aksen**
   - Menggunakan palet aksen 4 warna (`#4285f4` Biru, `#ea4335` Merah, `#fbbc04` Kuning, `#34a853` Hijau) pada ikon kurung siku `< >`, garis atas kartu, tanda kurung Hero, serta bilah progres scroll di tepi atas layar.
4. **Kejujuran & Transparansi Teknis**
   - Seperti dokumentasi jaringan yang harus akurat mencatat kondisi perangkat, setiap proyek mencantumkan batasan demo, kendala teknis beserta penyelesaiannya, dan status fitur apa adanya.

---

### 3. Stack Teknologi & Arsitektur Gerak

#### Teknologi Utama

| Lapisan | Teknologi | Peran |
| :--- | :--- | :--- |
| **Framework UI** | **React 19** (`react`, `react-dom`) | Komponen modular, pengelolaan state tampilan beranda/detail, dan integrasi History API. |
| **Bahasa** | **TypeScript** (`tsc --noEmit`) | Pengetikan statis untuk data proyek, status filter teknologi, dan properti komponen. |
| **Styling** | **Tailwind CSS v4** (`@tailwindcss/vite`) | Tata letak responsif berbasis utilitas dengan variabel warna adaptif di `src/index.css`. |
| **Build Tool** | **Vite 8** (`@vitejs/plugin-react`) | Server pengembangan cepat (port `3000`) serta *bundling* produksi yang ringan. |
| **Ikon & Tipografi** | **Lucide React**, **Plus Jakarta Sans**, **JetBrains Mono** | Ikonografi bersih yang dipadukan dengan huruf geometris modern dan monospace untuk label teknis. |

#### Arsitektur Scroll & Animasi

- **Lenis (`lenis`)**: Menghasilkan efek *smooth scroll* yang halus saat halaman digulir, disinkronkan dengan *ticker* GSAP di `useSmoothScroll`, dan otomatis dijeda saat dialog/lightbox terbuka.
- **GSAP + ScrollTrigger (`gsap`, `gsap/ScrollTrigger`)**: Mengatur animasi masuk bertahap (`expo.out`) pada judul bagian (`SectionHeading`) dan teks paragraf (`[data-gsap-fade]`) menggunakan `ScrollTrigger.create` mandiri.
- **Motion (`motion/react`)**: Menangani animasi kartu saat masuk viewport, efek *hover*, bilah progres scroll 4 warna berurutan (`ScrollProgressBar`), koreografi masuk Hero, serta *parallax* gambar di Carousel.
- **Ramah Aksesibilitas (`prefers-reduced-motion`)**: Seluruh animasi Lenis, GSAP, dan Motion otomatis menyesuaikan atau berhenti jika pengguna mengaktifkan pengurangan gerak pada sistem.

---

### 4. Fitur Interaktif & Filter Proyek

- **Project Carousel dengan Parallax Dua Arah (`ProjectCarousel`)**:
  - Mendukung geser dengan mouse/sentuhan, tombol navigasi kiri/kanan, serta tombol papan ketik `ArrowLeft` / `ArrowRight`.
  - Tangkapan layar proyek memiliki efek *parallax* tipis vertikal saat halaman di-scroll (`±10px`) dan pergeseran horizontal halus saat slide digeser (`±12px`).
- **Filter Proyek Berdasarkan Tag Teknologi**:
  - Pada **Halaman Detail Proyek**, setiap tag teknologi (`React`, `Tailwind CSS`, `TypeScript`, `JavaScript`, `Vercel`, dll.) dapat diklik dan menampilkan indikator `+N` jika ada proyek lain yang memakai teknologi serupa.
  - Mengklik salah satu tag akan membawa pengguna kembali ke bagian `#project` di halaman utama dan menyaring Carousel agar hanya menampilkan **proyek lain** dengan teknologi tersebut (termasuk pencocokan label gabungan seperti `CSS3 / Tailwind CSS` atau `JavaScript / TypeScript`).
  - Dilengkapi bilah status filter aktif dengan tombol **Hapus filter**, sorotan warna pada teknologi yang cocok di kartu Carousel, serta tampilan status kosong informatif jika belum ada proyek lain yang memakai teknologi tersebut.
- **Tab Filter Kategori**: Memilih tampilan `Utama (3)`, `Semua (4)`, atau `Eksperimen (1)` di atas Carousel.
- **Navigasi Cepat (`Ctrl+K` / `Cmd+K`)**: Jendela pencarian cepat (`CommandPalette`) dengan dukungan keyboard (`↑↓`, `Enter`, `Esc`) untuk melompat ke bagian mana pun, membuka studi kasus proyek, melihat sertifikat, atau menyalin email.
- **Pratinjau Interaktif & `MediaLightbox`**: Simulasi komponen antarmuka langsung di halaman detail proyek serta tampilan perbesar gambar (*lightbox*) untuk tangkapan layar proyek dan sertifikat.
- **Mikro-interaksi Hero**: Efek *parallax* kursor pada kurung `< >` dan bingkai foto setengah badan, stiker yang dapat digeser (*drag*), serta letupan konfeti saat kurung `< >` diklik.

---

### 5. Sistem Kontras Mode Terang & Gelap

Agar kotak kartu, batas (*border*), dan teks tetap terbaca tegas pada browser **Chrome mode terang** sekaligus nyaman di **mode gelap**, `src/index.css` mendefinisikan token warna adaptif (`color-scheme: light dark`):

| Token | Mode Terang | Mode Gelap | Fungsi |
| :--- | :--- | :--- | :--- |
| `--bg` | `#ffffff` | `#121317` | Latar belakang utama halaman |
| `--surface` | `#e4ecf7` | `#1b1d23` | Warna kotak kartu/panel agar kontras jelas terhadap `--bg` |
| `--surface-elevated` | `#ffffff` | `#22252d` | Permukaan panel terangkat, header kartu, dan dialog |
| `--surface-tonal` | `#cfe0fc` | `rgba(138, 180, 248, 0.16)` | Latar tombol tonal dan pintasan keyboard |
| `--line` | `#bcc8dc` | `#343844` | Garis tepi kotak dan pembatas antarbagian |
| `--text` / `--muted` | `#12151a` / `#3b424d` | `#f3f5f7` / `#b4b9c2` | Warna teks utama dan teks pendukung berketajaman tinggi |
| `--action` | `#1a73e8` | `#8ab4f8` | Warna tombol aksi utama, tautan, dan penanda aktif |

---

### 6. Ringkasan Struktur Direktori

```text
.
├── index.html                      # Dokumen HTML utama, font, serta metadata SEO/Open Graph/Schema.org
├── package.json                    # Daftar dependensi dan skrip npm (Vite & TypeScript)
├── vite.config.ts                  # Konfigurasi Vite 8, React, dan Tailwind CSS v4 (port 3000)
├── public/
│   ├── og-preview.svg              # Gambar pratinjau Open Graph
│   └── assets/aistudio/            # Foto profil setengah badan, screenshot proyek, sertifikat Cisco & SBM ITB
└── src/
    ├── main.tsx                    # Titik masuk render React
    ├── index.css                   # Impor Tailwind v4, token kontras terang/gelap, dan gaya utilitas Lenis/grid
    ├── App.tsx                     # Pengatur tampilan beranda/detail, History API, dan state filter proyek
    ├── data/
    │   └── portfolioData.ts        # Data profil, skill TKJ, studi kasus proyek, sertifikat, & helper filter tag
    ├── hooks/
    │   └── useSmoothScroll.ts      # Integrasi Lenis smooth scroll dan GSAP ScrollTrigger per section
    └── components/
        ├── ScrollProgressBar.tsx   # Indikator progres scroll 4 warna berurutan di tepi atas layar
        ├── Navbar.tsx              # Header navigasi lengket (desktop) dan bar navigasi bawah (mobile)
        ├── Hero.tsx                # Bagian Hero, foto setengah badan, name tag TKJ, stiker geser, & konfeti
        ├── HomeSections.tsx        # Bagian Tentang, Keahlian, Filter/Showcase Proyek, Pencapaian, & Kontak
        ├── TkjIdentityCard.tsx     # Kartu identitas interaktif dua sisi "TKJ PASS"
        ├── SectionHeading.tsx      # Judul bagian dengan ikon < > dan animasi masuk GSAP ScrollTrigger
        ├── ProjectCarousel.tsx     # Carousel geser proyek dengan parallax gambar vertikal & horizontal
        ├── ProjectDetailPage.tsx   # Halaman studi kasus detail dengan tag teknologi interaktif & matriks fitur
        ├── ProjectVisualPreview.tsx# Pratinjau interaktif antarmuka langsung pada halaman detail proyek
        ├── CommandPalette.tsx      # Dialog navigasi cepat Ctrl+K / Cmd+K
        └── MediaLightbox.tsx       # Modal perbesar gambar screenshot proyek dan sertifikat
```

---

### 7. Menjalankan Secara Lokal & Build

#### Prasyarat

- **Node.js** versi 18+
- **npm** (atau **Bun**)

#### Langkah & Perintah

```bash
# 1. Pasang seluruh dependensi
npm install

# 2. Jalankan server pengembangan lokal (aktif di http://localhost:3000)
npm run dev

# 3. Periksa tipe TypeScript tanpa menghasilkan file output
npm run lint

# 4. Bangun versi produksi ke folder dist/
npm run build

# 5. Uji hasil build produksi secara lokal
npm run preview

# 6. Bersihkan folder hasil build
npm run clean
```
