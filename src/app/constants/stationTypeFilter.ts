export const STATION_TYPE_QUERY_KEY = 'stationType';

export type StationTypeFilterValue = '' | 'operation' | 'rent' | 'franchise' | 'investment' | 'ownership';

export interface StationTypeFilterOption {
  value: StationTypeFilterValue;
  label: string;
}

export const STATION_TYPE_FILTER_OPTIONS: StationTypeFilterOption[] = [
  { value: '', label: 'All Stations' },
  { value: 'operation', label: 'Operational' },
  { value: 'rent', label: 'Rental' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'investment', label: 'Investment' },
  { value: 'ownership', label: 'Ownership' },
];

export const isStationTypeFilterValue = (value: string | null): value is StationTypeFilterValue => {
  if (value === null) return false;
  return STATION_TYPE_FILTER_OPTIONS.some((option) => option.value === value);
};
