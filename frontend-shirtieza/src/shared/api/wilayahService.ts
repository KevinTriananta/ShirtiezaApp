import api from '@shared/lib/api';

export interface Province {
  id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  type: string;
  name: string;
  code: string;
  full_code: string;
  provinsi_id?: number;
  province_id?: number;
}

export interface District {
  id: number;
  name: string;
  code: string;
  full_code: string;
  kabupaten_id?: number;
  city_id?: number;
}

export interface Village {
  id: number;
  name: string;
  code: string;
  full_code: string;
  pos_code: string;
  kecamatan_id?: number;
  district_id?: number;
}

interface WilayahResponse<T> {
  data: T[];
}

export const wilayahService = {
  getProvinces: async () => {
    const response = await api.get<WilayahResponse<Province>>('/wilayah/provinces');
    return response.data.data;
  },
  getCities: async (provinceId: number) => {
    const response = await api.get<WilayahResponse<City>>('/wilayah/cities', { params: { province_id: provinceId } });
    return response.data.data;
  },
  getDistricts: async (cityId: number) => {
    const response = await api.get<WilayahResponse<District>>('/wilayah/districts', { params: { city_id: cityId } });
    return response.data.data;
  },
  getVillages: async (districtId: number) => {
    const response = await api.get<WilayahResponse<Village>>('/wilayah/villages', { params: { district_id: districtId } });
    return response.data.data;
  },
};
