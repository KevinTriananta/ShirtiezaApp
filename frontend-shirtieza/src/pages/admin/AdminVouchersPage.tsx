import { useEffect, useState } from 'react';
import { CheckCircle2, Eye, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { categoryService } from '@shared/api/categoryService';
import { voucherService } from '@shared/api/voucherService';
import type { Category, Voucher } from '@shared/types';

const initialForm = {
  code: '',
  name: '',
  description: '',
  discount_percentage: 10,
  min_purchase: 0,
  max_discount: 0,
  category_id: 0,
  expires_at: '',
};

const formatRupiah = (value: number) => `Rp ${Math.round(value).toLocaleString('id-ID')}`;

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setIsLoading(true);
      const [voucherResponse, categoryResponse] = await Promise.all([
        voucherService.getAdminVouchers(),
        categoryService.getAllCategories(),
      ]);
      setVouchers(voucherResponse.data || []);
      setCategories(categoryResponse.data || []);
    } finally {
      setIsLoading(false);
    }
  };

  const createVoucher = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const code = form.code.trim().toUpperCase();
    const name = form.name.trim();
    const description = form.description.trim();
    const discountPercentage = Number(form.discount_percentage);
    const minPurchase = Number(form.min_purchase) || 0;
    const maxDiscount = Number(form.max_discount) || 0;

    if (!code || !name || !form.expires_at) {
      setError('Kode, judul voucher, dan tanggal expired wajib diisi karena semuanya ditampilkan ke customer.');
      return;
    }

    if (discountPercentage < 1 || discountPercentage > 100) {
      setError('Diskon harus antara 1 sampai 100 persen.');
      return;
    }

    if (new Date(`${form.expires_at}T23:59:59`) <= new Date()) {
      setError('Tanggal expired harus setelah hari ini supaya voucher muncul di homepage.');
      return;
    }

    setIsSaving(true);
    try {
      await voucherService.createVoucher({
        code,
        name,
        description,
        discount_percentage: discountPercentage,
        min_purchase: minPurchase,
        max_discount: maxDiscount,
        category_id: form.category_id > 0 ? Number(form.category_id) : null,
        expires_at: new Date(`${form.expires_at}T23:59:59`).toISOString(),
        is_active: true,
      } as Partial<Voucher>);
      setForm(initialForm);
      setSuccess('Voucher berhasil dibuat dan akan tampil di homepage selama aktif dan belum expired.');
      await loadVouchers();
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Voucher gagal dibuat. Pastikan kode belum dipakai dan semua field terisi.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteVoucher = async (id: number) => {
    if (!window.confirm('Delete this voucher?')) return;
    await voucherService.deleteVoucher(id);
    await loadVouchers();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-400">Promo control</p>
          <h2 className="text-2xl font-black uppercase tracking-tight">Vouchers</h2>
          <p className="mt-2 max-w-xl text-sm text-neutral-500">Buat voucher yang tampil di section Voucher & Promo homepage. Customer harus login untuk claim, lalu memakai voucher saat checkout.</p>
        </div>
        <button onClick={loadVouchers} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white sm:w-fit">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <form onSubmit={createVoucher} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-3 rounded-2xl bg-neutral-50 p-4">
            <Eye size={18} className="mt-0.5 shrink-0 text-black" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.18em]">New Voucher</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">Yang tampil di homepage: kode, judul voucher, persentase diskon, tanggal expired, kategori, dan syarat minimum/maksimum jika diisi.</p>
            </div>
          </div>
          {error && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}
          {success && <div className="mb-4 flex gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={17} /> {success}</div>}

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Kode Voucher - tampil di homepage</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })} placeholder="WELCOME10" className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-bold outline-none focus:border-black" />
              <p className="mt-1 text-[11px] text-neutral-400">Contoh: WELCOME10. Jangan pakai spasi, kode harus unik.</p>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Judul Voucher - tampil di homepage</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Diskon member baru" className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black" />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Deskripsi Singkat - opsional</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Bisa dipakai untuk semua produk pilihan Shirtieza." rows={3} className="w-full resize-none rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Diskon (%)</label>
                <input required type="number" min="1" max="100" value={form.discount_percentage} onChange={(e) => setForm({ ...form, discount_percentage: Number(e.target.value) })} className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Expired</label>
                <input required type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Min Belanja</label>
                <input type="number" min="0" value={form.min_purchase} onChange={(e) => setForm({ ...form, min_purchase: Number(e.target.value) })} className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black" />
                <p className="mt-1 text-[11px] text-neutral-400">0 = tanpa minimum.</p>
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Maks Diskon</label>
                <input type="number" min="0" value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: Number(e.target.value) })} className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black" />
                <p className="mt-1 text-[11px] text-neutral-400">0 = tanpa batas.</p>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Kategori Produk</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })} className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black">
                <option value={0}>Semua kategori</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <p className="mt-1 text-[11px] text-neutral-400">Jika pilih kategori, voucher hanya berlaku untuk produk kategori tersebut.</p>
            </div>
            <button disabled={isSaving} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 text-[11px] font-black uppercase tracking-widest text-white disabled:opacity-50">
              <Plus size={15} /> {isSaving ? 'Membuat...' : 'Buat & Tampilkan Voucher'}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.18em]">Active List</h3>
            <span className="text-xs font-bold text-neutral-400">{vouchers.length} vouchers</span>
          </div>
          {isLoading ? (
            <div className="py-14 text-center text-sm text-neutral-400">Loading vouchers...</div>
          ) : vouchers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 py-14 text-center text-sm text-neutral-400">Belum ada voucher. Buat voucher aktif agar muncul di homepage.</div>
          ) : (
            <div className="grid gap-3">
              {vouchers.map((voucher) => (
                <div key={voucher.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">{voucher.code}</span>
                      <span className="text-sm font-black text-black">{voucher.discount_percentage}% off</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-black">{voucher.name}</p>
                    {voucher.description && <p className="mt-1 text-xs text-neutral-500">{voucher.description}</p>}
                    <p className="mt-1 text-xs text-neutral-400">{voucher.category?.name || 'Semua produk'} · Expired {new Date(voucher.expires_at).toLocaleDateString('id-ID')}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      <span className="rounded-full bg-white px-3 py-1">Min {voucher.min_purchase ? formatRupiah(voucher.min_purchase) : 'Tidak ada'}</span>
                      <span className="rounded-full bg-white px-3 py-1">Maks {voucher.max_discount ? formatRupiah(voucher.max_discount) : 'Tidak ada'}</span>
                      {!voucher.is_active && <span className="rounded-full bg-red-50 px-3 py-1 text-red-500">Nonaktif</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteVoucher(voucher.id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-300 transition-colors hover:bg-red-50 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
