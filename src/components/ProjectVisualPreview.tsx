import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
} from 'lucide-react';

interface ProjectVisualPreviewProps {
  slug: string;
  mode?: 'card' | 'detail';
}

/* -------------------------------------------------------------------------- */
/* 1. SakuKu: Alur Transaksi Local-First & Batasan AI                         */
/* -------------------------------------------------------------------------- */
interface TxItem {
  id: number;
  label: string;
  category: 'Makan' | 'Transport' | 'Pemasukan';
  amount: number;
  type: 'in' | 'out';
}

const INITIAL_TX: TxItem[] = [
  { id: 1, label: 'Uang Saku Mingguan', category: 'Pemasukan', amount: 350000, type: 'in' },
  { id: 2, label: 'Makan Siang Kantin', category: 'Makan', amount: 28000, type: 'out' },
  { id: 3, label: 'Ongkos Commuter', category: 'Transport', amount: 18000, type: 'out' },
];

const SakukuPreview: React.FC<{ mode: 'card' | 'detail' }> = ({ mode }) => {
  const [txs, setTxs] = useState<TxItem[]>(INITIAL_TX);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('25000');
  const [category, setCategory] = useState<'Makan' | 'Transport' | 'Pemasukan'>('Makan');
  const [showAiPayload, setShowAiPayload] = useState(false);

  const summary = useMemo(() => {
    const totalIn = txs.filter((t) => t.type === 'in').reduce((s, t) => s + t.amount, 0);
    const totalOut = txs.filter((t) => t.type === 'out').reduce((s, t) => s + t.amount, 0);
    const budgetLimit = 250000;
    const budgetRatio = Math.min(100, Math.round((totalOut / budgetLimit) * 100));
    return { totalIn, totalOut, balance: totalIn - totalOut, budgetLimit, budgetRatio };
  }, [txs]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(amount);
    if (!numeric || numeric <= 0) return;
    const cleanLabel =
      label.trim() || (category === 'Pemasukan' ? 'Tambahan Saldo' : `Pengeluaran ${category}`);
    const newTx: TxItem = {
      id: Date.now(),
      label: cleanLabel,
      category,
      amount: numeric,
      type: category === 'Pemasukan' ? 'in' : 'out',
    };
    setTxs((prev) => [newTx, ...prev].slice(0, 4));
    setLabel('');
  };

  return (
    <div className="grid grid-cols-1 divide-y divide-[var(--line)] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      {/* Left: Simulasi Alur Input -> LocalStorage -> Saldo */}
      <div className="pb-5 lg:pb-0 lg:pr-6">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">Simulasi Saldo Local-First</p>
            <p className="mt-0.5 text-xl font-extrabold tabular-nums text-[var(--text)]">
              Rp {summary.balance.toLocaleString('id-ID')}
            </p>
          </div>
          <span className="text-xs font-medium text-[var(--muted)] tabular-nums">
            Terpakai {summary.budgetRatio}% dari Rp {summary.budgetLimit.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${summary.budgetRatio}%`,
              backgroundColor: summary.budgetRatio > 85 ? '#ea4335' : '#4285f4',
            }}
          />
        </div>

        <form onSubmit={handleAdd} className="mt-4 flex flex-wrap gap-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Catatan transaksi..."
            aria-label="Catatan transaksi"
            className="min-w-[130px] flex-1 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1.5 text-xs text-[var(--text)]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'Makan' | 'Transport' | 'Pemasukan')}
            aria-label="Kategori transaksi"
            className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2 py-1.5 text-xs text-[var(--text)]"
          >
            <option value="Makan">Makan</option>
            <option value="Transport">Transport</option>
            <option value="Pemasukan">Pemasukan</option>
          </select>
          <input
            type="number"
            min={1000}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Nominal transaksi"
            className="w-24 rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2 py-1.5 text-xs tabular-nums text-[var(--text)]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-[var(--action)] px-3 py-1.5 text-xs font-bold text-[var(--on-action)] hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Catat</span>
          </button>
        </form>

        <ul className="mt-3 divide-y divide-[var(--line)]">
          {txs.slice(0, mode === 'detail' ? 4 : 3).map((t) => (
            <li key={t.id} className="flex items-center justify-between py-2 text-xs">
              <span className="truncate font-medium text-[var(--text)]">
                {t.label} <span className="text-[var(--muted)]">· {t.category}</span>
              </span>
              <span
                className={`shrink-0 font-mono font-semibold tabular-nums ${
                  t.type === 'in' ? 'text-[#188038] dark:text-[#81c995]' : 'text-[var(--text)]'
                }`}
              >
                {t.type === 'in' ? '+' : '-'}Rp {t.amount.toLocaleString('id-ID')}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Alur & Batasan Privasi AI */}
      <div className="flex flex-col justify-between pt-5 lg:pl-6 lg:pt-0">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-[var(--text)]">
              Alur Penyimpanan Lokal &amp; Batasan AI
            </p>
            <Lock className="h-3.5 w-3.5 text-[#34a853]" aria-hidden="true" />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[var(--text)]">
            <span className="font-medium">1. Input React</span>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--muted)]" aria-hidden="true" />
            <span className="font-medium">2. LocalStorage JSON</span>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--muted)]" aria-hidden="true" />
            <span className="font-medium">3. Hitung Saldo Lokal</span>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
            Data transaksi tetap tersimpan di browser pengguna. Gemini API bersifat opsional dan
            hanya menerima ringkasan total kategori saat diminta, tanpa rincian pribadi maupun saran
            investasi resmi.
          </p>
        </div>

        <div className="mt-4 border-t border-[var(--line)] pt-3">
          <button
            type="button"
            onClick={() => setShowAiPayload((v) => !v)}
            className="text-xs font-bold text-[var(--action)] hover:underline"
          >
            {showAiPayload
              ? 'Tutup contoh ringkasan yang dikirim ke AI'
              : 'Lihat contoh ringkasan agregat ke AI'}
          </button>

          {showAiPayload && (
            <pre className="mt-2 overflow-x-auto rounded-lg bg-[#0f172a] p-3 font-mono text-[11px] text-slate-200">
{`{
  "totalMasuk": ${summary.totalIn},
  "totalKeluar": ${summary.totalOut},
  "rasioAnggaran": "${summary.budgetRatio}%",
  "identitas": "tidak disertakan"
}`}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. KPK Intelligence: Transparansi Nonresmi & Filter Sektor                 */
/* -------------------------------------------------------------------------- */
const KPK_CASES = [
  { label: 'Tata Niaga Komoditas (Simulasi)', sector: 'BUMN', valueT: 271.0 },
  { label: 'Pengadaan Infrastruktur ICT', sector: 'Pengadaan', valueT: 8.03 },
  { label: 'Izin Ekspor & Tata Kelola', sector: 'Perizinan', valueT: 1.9 },
  { label: 'Belanja Pengadaan Daerah', sector: 'Keuangan', valueT: 0.48 },
];

const KpkPreview: React.FC = () => {
  const [sector, setSector] = useState<string>('Semua');

  const filtered = useMemo(
    () => (sector === 'Semua' ? KPK_CASES : KPK_CASES.filter((c) => c.sector === sector)),
    [sector]
  );

  const maxVal = Math.max(...filtered.map((c) => c.valueT), 1);

  return (
    <div className="grid grid-cols-1 divide-y divide-[var(--line)] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <div className="pb-5 lg:pb-0 lg:pr-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold text-[var(--text)]">
            Visualisasi Kasus per Sektor (Latihan)
          </p>
          <span className="text-[11px] font-medium text-[var(--muted)]">
            Pembaruan Dataset: Maret 2025
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {['Semua', 'BUMN', 'Pengadaan', 'Perizinan', 'Keuangan'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSector(s)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                sector === s
                  ? 'bg-[var(--action)] text-[var(--on-action)]'
                  : 'bg-[var(--bg)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3.5 space-y-2.5">
          {filtered.map((item) => {
            const widthPct = Math.max(8, Math.round((item.valueT / maxVal) * 100));
            return (
              <div key={item.label}>
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[var(--text)]">{item.label}</span>
                  <span className="font-mono font-bold tabular-nums text-[var(--text)]">
                    Rp {item.valueT >= 1 ? `${item.valueT} T` : `${Math.round(item.valueT * 1000)} M`}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
                  <div
                    className="h-full rounded-full bg-[#34a853] transition-all duration-200"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col justify-between pt-5 text-xs lg:pl-6 lg:pt-0">
        <div>
          <p className="flex items-center gap-1.5 font-bold text-[var(--text)]">
            <AlertTriangle className="h-3.5 w-3.5 text-[#188038] dark:text-[#81c995]" aria-hidden="true" />
            Proyek Sekolah — Bukan Situs Resmi KPK
          </p>
          <ul className="mt-2.5 space-y-2 text-[var(--muted)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#34a853]" aria-hidden="true" />
              <span>Grafik &amp; filter sektor berjalan di browser memakai JSON referensi publik.</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b06000] dark:text-[#fdd663]" aria-hidden="true" />
              <span>
                Formulir pengaduan dan ekspor laporan bersifat{' '}
                <strong className="text-[var(--text)]">simulasi antarmuka</strong>, tidak terhubung
                ke kanal resmi.
              </span>
            </li>
          </ul>
        </div>
        <p className="mt-4 border-t border-[var(--line)] pt-3 text-[11px] text-[var(--muted)]">
          Penamaan demo diperjelas agar tidak menimbulkan kesan sebagai portal resmi pemerintah.
        </p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Gantthers Barbershop: Audit Demo & Simulasi Booking                     */
/* -------------------------------------------------------------------------- */
const GantthersPreview: React.FC = () => {
  const [auditTab, setAuditTab] = useState<'after' | 'before'>('after');
  const [selectedService, setSelectedService] = useState('Classic Haircut (Rp 45.000)');
  const [bookedText, setBookedText] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 divide-y divide-[var(--line)] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <div className="pb-5 lg:pb-0 lg:pr-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold text-[var(--text)]">Perbandingan Audit Konten Demo</p>
          <div className="inline-flex rounded-lg bg-[var(--bg)] p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setAuditTab('after')}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                auditTab === 'after'
                  ? 'bg-[var(--action)] text-[var(--on-action)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Sesudah Perbaikan
            </button>
            <button
              type="button"
              onClick={() => setAuditTab('before')}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                auditTab === 'before'
                  ? 'bg-[var(--action)] text-[var(--on-action)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Temuan Awal
            </button>
          </div>
        </div>

        {auditTab === 'after' ? (
          <ul className="mt-3 space-y-2 text-xs text-[var(--muted)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#34a853]" aria-hidden="true" />
              <span>
                Tahun berdiri diseragamkan menjadi <strong className="text-[var(--text)]">2010</strong>{' '}
                sebagai data simulasi konsisten.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#34a853]" aria-hidden="true" />
              <span>Angka statistik 0 yang bertentangan dengan teks 1.000+ pelanggan dihapus.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#34a853]" aria-hidden="true" />
              <span>Klaim hiperbolis diganti label studi kasus bisnis fiktif sekolah.</span>
            </li>
          </ul>
        ) : (
          <ul className="mt-3 space-y-2 text-xs text-[var(--muted)]">
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ea4335]" aria-hidden="true" />
              <span>Klaim 1.000+ pelanggan bertabrakan dengan metrik total pelanggan 0.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ea4335]" aria-hidden="true" />
              <span>Tahun berdiri berbeda antara 2009 dan 2010 serta ada harga layanan template.</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ea4335]" aria-hidden="true" />
              <span>Klaim "barbershop terbesar dan mewah di Indonesia" tanpa bukti pendukung.</span>
            </li>
          </ul>
        )}
      </div>

      <div className="flex flex-col justify-between pt-5 lg:pl-6 lg:pt-0">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-[var(--text)]">Simulasi Alur Booking Layanan</p>
            <span className="text-[11px] font-medium text-[var(--muted)]">Bisnis Fiktif</span>
          </div>

          <label className="mt-2.5 block text-xs text-[var(--muted)]">
            Paket Layanan Simulasi
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setBookedText(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2.5 py-2 text-xs text-[var(--text)]"
            >
              <option value="Classic Haircut (Rp 45.000)">Classic Haircut — Rp 45.000</option>
              <option value="Haircut + Beard Trim (Rp 65.000)">Haircut + Beard Trim — Rp 65.000</option>
              <option value="Creambath & Styling (Rp 75.000)">Creambath &amp; Styling — Rp 75.000</option>
            </select>
          </label>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() =>
              setBookedText(`Simulasi booking: ${selectedService} (tidak terhubung ke toko nyata).`)
            }
            className="rounded-lg bg-[var(--action)] px-4 py-2 text-xs font-bold text-[var(--on-action)] hover:brightness-110"
          >
            Uji Simulasi Booking
          </button>
          {bookedText && (
            <p className="mt-2 text-xs font-medium text-[#188038] dark:text-[#81c995]">
              {bookedText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Escape the Police: Status Fitur & Rancangan Client-Server               */
/* -------------------------------------------------------------------------- */
const EscapePreview: React.FC = () => {
  const features = [
    { name: 'Core Gameplay (Mobil, Nitro, EMP, Bounty)', status: 'Berjalan', tone: 'ok' },
    { name: 'HUD Speedometer & Loading Screen', status: 'Berjalan', tone: 'ok' },
    { name: 'Multiplayer 2 Pemain (Socket.IO / WebRTC)', status: 'Eksperimen', tone: 'exp' },
    { name: 'Ghost Replay, Offline Sync & Electron', status: 'Belum Selesai', tone: 'todo' },
  ];

  return (
    <div className="grid grid-cols-1 divide-y divide-[var(--line)] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <div className="pb-5 lg:pb-0 lg:pr-6">
        <p className="text-xs font-bold text-[var(--text)]">Status Implementasi Fitur</p>
        <ul className="mt-2.5 divide-y divide-[var(--line)] text-xs">
          {features.map((f) => (
            <li key={f.name} className="flex items-center justify-between gap-3 py-2">
              <span className="font-medium text-[var(--text)]">{f.name}</span>
              <span
                className={`shrink-0 font-mono text-[11px] font-bold ${
                  f.tone === 'ok'
                    ? 'text-[#188038] dark:text-[#81c995]'
                    : f.tone === 'exp'
                      ? 'text-[#b06000] dark:text-[#fdd663]'
                      : 'text-[var(--muted)]'
                }`}
              >
                {f.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-between pt-5 lg:pl-6 lg:pt-0">
        <div>
          <p className="text-xs font-bold text-[var(--text)]">
            Rancangan Komunikasi Client–Server (Konsep Lanjutan)
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            Saat ini demo publik menjalankan loop single-player 60 FPS di browser. Sinkronisasi
            multiplayer via Socket.IO masih berupa rancangan arsitektur.
          </p>

          <div className="mt-3 grid grid-cols-3 items-center gap-2 rounded-xl bg-[var(--bg)] p-3 text-center font-mono text-[11px]">
            <div>
              <p className="font-bold text-[var(--text)]">Client</p>
              <p className="text-[10px] text-[var(--muted)]">Loop 60 FPS</p>
            </div>
            <div className="text-[10px] text-[var(--muted)]">
              <span>emit(pos, emp)</span>
              <span className="block text-[var(--action)]">↔</span>
            </div>
            <div>
              <p className="font-bold text-[var(--text)]">Socket Room</p>
              <p className="text-[10px] text-[var(--muted)]">Eksperimen</p>
            </div>
          </div>
        </div>

        <p className="mt-3 border-t border-[var(--line)] pt-2.5 text-[11px] text-[var(--muted)]">
          Dibuat dengan bantuan Google AI Studio; dikelompokkan sebagai proyek eksperimental.
        </p>
      </div>
    </div>
  );
};

export const ProjectVisualPreview: React.FC<ProjectVisualPreviewProps> = ({
  slug,
  mode = 'card',
}) => {
  if (slug === 'sakuku') return <SakukuPreview mode={mode} />;
  if (slug === 'kpk-intelligence') return <KpkPreview />;
  if (slug === 'gantthers-barbershop') return <GantthersPreview />;
  return <EscapePreview />;
};
