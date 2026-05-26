import { MapPin } from 'lucide-react';
import { useWilayahSelection } from '../../hooks/useWilayahSelection';

interface WilayahFieldsProps {
  city: string;
  country: string;
  zipCode: string;
  onCityChange: (city: string) => void;
  onCountryChange: (country: string) => void;
  onZipCodeChange: (zipCode: string) => void;
  labelClass: string;
  inputClass: string;
}

export default function WilayahFields({ city, country, zipCode, onCityChange, onCountryChange, onZipCodeChange, labelClass, inputClass }: WilayahFieldsProps) {
  const wilayah = useWilayahSelection();

  const handleCityChange = (cityId: number) => {
    wilayah.selectCity(cityId);
    const selectedCity = wilayah.cities.find((item) => item.id === cityId);
    onCityChange(selectedCity ? `${selectedCity.type} ${selectedCity.name}` : '');
    onZipCodeChange('');
  };

  const handleVillageChange = (villageId: number) => {
    wilayah.selectVillage(villageId);
    const village = wilayah.villages.find((item) => item.id === villageId);
    if (village?.pos_code) onZipCodeChange(village.pos_code);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Province</label>
        <div className="relative">
          <MapPin size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" />
          <select value={wilayah.selectedRegion.provinceId} onChange={(e) => wilayah.selectProvince(Number(e.target.value))} className={`${inputClass} appearance-none bg-white pl-11`}>
            <option value={0}>Select province</option>
            {wilayah.provinces.map((province) => <option key={province.id} value={province.id}>{province.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>City / Regency</label>
          <select value={wilayah.selectedRegion.cityId} onChange={(e) => handleCityChange(Number(e.target.value))} className={`${inputClass} appearance-none bg-white`}>
            <option value={0}>{city || 'Select city'}</option>
            {wilayah.cities.map((item) => <option key={item.id} value={item.id}>{item.type} {item.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>District</label>
          <select value={wilayah.selectedRegion.districtId} onChange={(e) => wilayah.selectDistrict(Number(e.target.value))} className={`${inputClass} appearance-none bg-white`}>
            <option value={0}>Select district</option>
            {wilayah.districts.map((district) => <option key={district.id} value={district.id}>{district.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Village</label>
          <select value={wilayah.selectedRegion.villageId} onChange={(e) => handleVillageChange(Number(e.target.value))} className={`${inputClass} appearance-none bg-white`}>
            <option value={0}>Select village</option>
            {wilayah.villages.map((village) => <option key={village.id} value={village.id}>{village.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>ZIP Code</label>
          <input type="text" value={zipCode} onChange={(e) => onZipCodeChange(e.target.value)} placeholder="Postal code" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Country</label>
        <input type="text" value={country} onChange={(e) => onCountryChange(e.target.value)} className={inputClass} />
      </div>
    </div>
  );
}
