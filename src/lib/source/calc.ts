export type CropPattern = 'wheat-paddy' | 'wheat';

export interface DistrictInfo {
  id: string;
  name: string;
  primary: boolean;
}

export const DISTRICTS: DistrictInfo[] = [
  { id: 'ludhiana', name: 'Ludhiana', primary: true },
  { id: 'sangrur', name: 'Sangrur', primary: true },
  { id: 'bathinda', name: 'Bathinda', primary: false },
  { id: 'patiala', name: 'Patiala', primary: false },
  { id: 'amritsar', name: 'Amritsar', primary: false },
  { id: 'jalandhar', name: 'Jalandhar', primary: false },
];
