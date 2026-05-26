import { useEffect, useState } from 'react';
import { wilayahService } from '../services/wilayahService';
import type { City, District, Province, Village } from '../services/wilayahService';

export function useWilayahSelection() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedRegion, setSelectedRegion] = useState({ provinceId: 0, cityId: 0, districtId: 0, villageId: 0 });

  useEffect(() => {
    wilayahService.getProvinces().then(setProvinces).catch((error) => console.error('Failed to load provinces:', error));
  }, []);

  useEffect(() => {
    if (!selectedRegion.provinceId) {
      setCities([]);
      return;
    }
    wilayahService.getCities(selectedRegion.provinceId).then(setCities).catch((error) => console.error('Failed to load cities:', error));
    setDistricts([]);
    setVillages([]);
  }, [selectedRegion.provinceId]);

  useEffect(() => {
    if (!selectedRegion.cityId) {
      setDistricts([]);
      return;
    }
    wilayahService.getDistricts(selectedRegion.cityId).then(setDistricts).catch((error) => console.error('Failed to load districts:', error));
    setVillages([]);
  }, [selectedRegion.cityId]);

  useEffect(() => {
    if (!selectedRegion.districtId) {
      setVillages([]);
      return;
    }
    wilayahService.getVillages(selectedRegion.districtId).then(setVillages).catch((error) => console.error('Failed to load villages:', error));
  }, [selectedRegion.districtId]);

  const selectProvince = (provinceId: number) => setSelectedRegion({ provinceId, cityId: 0, districtId: 0, villageId: 0 });
  const selectCity = (cityId: number) => setSelectedRegion((current) => ({ ...current, cityId, districtId: 0, villageId: 0 }));
  const selectDistrict = (districtId: number) => setSelectedRegion((current) => ({ ...current, districtId, villageId: 0 }));
  const selectVillage = (villageId: number) => setSelectedRegion((current) => ({ ...current, villageId }));

  return {
    provinces,
    cities,
    districts,
    villages,
    selectedRegion,
    selectProvince,
    selectCity,
    selectDistrict,
    selectVillage,
  };
}
