import { useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: localStorage.getItem('store_name') || 'Shirtieza',
    supportEmail: localStorage.getItem('support_email') || 'info@shirtieza.com',
    shippingCost: localStorage.getItem('shipping_cost') || '50000',
    taxRate: localStorage.getItem('tax_rate') || '5',
    announcement: localStorage.getItem('store_announcement') || 'Free shipping for orders above Rp 1.000.000',
  });
  const [saved, setSaved] = useState(false);

  const saveSettings = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem('store_name', settings.storeName);
    localStorage.setItem('support_email', settings.supportEmail);
    localStorage.setItem('shipping_cost', settings.shippingCost);
    localStorage.setItem('tax_rate', settings.taxRate);
    localStorage.setItem('store_announcement', settings.announcement);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={saveSettings} className="space-y-6 max-w-3xl">
      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <h2 className="text-xl font-black uppercase tracking-tight mb-2">Store Settings</h2>
        <p className="text-sm text-neutral-400 mb-8">Pengaturan demo ini tersimpan lokal untuk kebutuhan presentasi.</p>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            ['storeName', 'Store Name'],
            ['supportEmail', 'Support Email'],
            ['shippingCost', 'Default Shipping Cost'],
            ['taxRate', 'Tax Rate (%)'],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">{label}</span>
              <input
                value={settings[key as keyof typeof settings]}
                onChange={(event) => setSettings({ ...settings, [key]: event.target.value })}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-black"
              />
            </label>
          ))}
          <label className="block md:col-span-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">Announcement Bar</span>
            <input
              value={settings.announcement}
              onChange={(event) => setSettings({ ...settings, announcement: event.target.value })}
              className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm outline-none focus:border-black"
            />
          </label>
        </div>
      </div>
      <button className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest">
        <Save size={15} /> {saved ? 'Saved' : 'Save Settings'}
      </button>
    </form>
  );
}
