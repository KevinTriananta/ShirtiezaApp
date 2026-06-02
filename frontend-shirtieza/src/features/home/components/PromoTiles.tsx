import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, TicketPercent } from 'lucide-react';
import { useAuth } from '@app/providers/AuthContext';
import { voucherService } from '@shared/api/voucherService';
import type { Voucher } from '@shared/types';

const formatRupiah = (value: number) => `Rp ${Math.round(value).toLocaleString('id-ID')}`;

export default function PromoTiles() {
  const { isAuthenticated } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [claimedIds, setClaimedIds] = useState<number[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    voucherService.getActiveVouchers().then((response) => setVouchers(response.data || [])).catch(() => setVouchers([]));
    if (isAuthenticated) {
      voucherService.getUserVouchers().then((response) => setClaimedIds((response.data || []).map((item) => item.voucher_id))).catch(() => setClaimedIds([]));
    }
  }, [isAuthenticated]);

  const claimVoucher = async (voucherId: number) => {
    if (!isAuthenticated) return;
    await voucherService.claimVoucher(voucherId);
    setClaimedIds((current) => [...new Set([...current, voucherId])]);
  };

  const scroll = (direction: 'left' | 'right') => {
    scrollerRef.current?.scrollBy({ left: direction === 'left' ? -420 : 420, behavior: 'smooth' });
  };

  return (
    <section className="bg-black py-10 sm:py-12 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40">claimable offers</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">Voucher & Promo</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll('left')} className="flex h-10 w-10 items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black"><ChevronLeft size={18} /></button>
            <button onClick={() => scroll('right')} className="flex h-10 w-10 items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div ref={scrollerRef} className="no-scrollbar flex gap-4 overflow-x-auto pb-2 scroll-smooth">
          {vouchers.length === 0 && (
            <div className="min-w-full border border-white/10 bg-white/5 p-8 text-white sm:min-w-[430px] lg:min-w-[460px]">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/35">No active voucher</p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight">Promo belum tersedia</h3>
              <p className="mt-2 max-w-sm text-sm text-white/55">Tambahkan voucher dari admin dashboard untuk menampilkannya di section ini.</p>
            </div>
          )}
          {vouchers.map((voucher) => (
            <div key={`voucher-${voucher.id}`} className="relative min-w-[82vw] overflow-hidden bg-white p-6 aspect-[16/9] sm:min-w-[430px] lg:min-w-[460px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#f5f5f5_45%,#e9e9e9_100%)]" />
              <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:18px_18px]" />
              <div className="absolute -right-12 -top-10 h-36 w-36 rounded-full border border-black/10" />
              <div className="absolute -bottom-16 right-10 h-44 w-44 rounded-full border border-black/10" />
              <div className="absolute right-5 top-5 text-[3.5rem] font-black uppercase leading-none tracking-tight text-black/[0.04] sm:text-[4.5rem]">Deal</div>
              <div className="absolute inset-y-0 left-0 w-1.5 bg-black" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/78 to-white/20" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-black px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white"><TicketPercent size={13} /> {voucher.code}</div>
                  <h3 className="mt-5 max-w-[15rem] text-3xl font-black leading-none tracking-tight text-black">{voucher.discount_percentage}% OFF</h3>
                  <p className="mt-2 text-sm font-bold text-neutral-600">{voucher.name}</p>
                  {voucher.description && <p className="mt-1 max-w-[16rem] text-xs text-neutral-500">{voucher.description}</p>}
                  <p className="mt-1 text-xs text-neutral-400">Valid until {new Date(voucher.expires_at).toLocaleDateString('id-ID')}</p>
                  {voucher.category && <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">Only {voucher.category.name}</p>}
                  <div className="mt-2 flex flex-wrap gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-500">
                    {Boolean(voucher.min_purchase) && <span className="bg-neutral-100 px-2 py-1">Min {formatRupiah(voucher.min_purchase || 0)}</span>}
                    {Boolean(voucher.max_discount) && <span className="bg-neutral-100 px-2 py-1">Max {formatRupiah(voucher.max_discount || 0)}</span>}
                  </div>
                </div>
                <button disabled={!isAuthenticated || claimedIds.includes(voucher.id)} onClick={() => claimVoucher(voucher.id)} className="w-fit bg-black px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white disabled:bg-neutral-200 disabled:text-neutral-500">
                  {!isAuthenticated ? 'Login to Claim' : claimedIds.includes(voucher.id) ? 'Claimed' : 'Claim Voucher'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
