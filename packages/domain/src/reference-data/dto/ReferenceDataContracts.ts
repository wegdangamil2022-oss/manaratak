export interface ReferenceDataFilters {
  activeOnly?: boolean;
  region?: string;
  countryIso2Code?: string;
  q?: string;
}

export interface ReferenceCountryDto {
  iso2Code: string;
  iso3Code: string;
  name: string;
  officialName?: string | null;
  region?: string | null;
  subregion?: string | null;
  defaultCurrencyCode?: string | null;
  defaultLanguageCode?: string | null;
  callingCode?: string | null;
  flagAssetId?: string | null;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpsertReferenceCountryDto {
  iso2Code: string;
  iso3Code: string;
  name: string;
  officialName?: string | null;
  region?: string | null;
  subregion?: string | null;
  defaultCurrencyCode?: string | null;
  defaultLanguageCode?: string | null;
  callingCode?: string | null;
  flagAssetId?: string | null;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReferenceCurrencyDto {
  isoCode: string;
  numericCode?: string | null;
  name: string;
  symbol?: string | null;
  minorUnit?: number | null;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpsertReferenceCurrencyDto {
  isoCode: string;
  numericCode?: string | null;
  name: string;
  symbol?: string | null;
  minorUnit?: number | null;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReferenceLanguageDto {
  isoCode: string;
  name: string;
  nativeName?: string | null;
  direction: 'LTR' | 'RTL';
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpsertReferenceLanguageDto {
  isoCode: string;
  name: string;
  nativeName?: string | null;
  direction: 'LTR' | 'RTL';
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ReferenceCityDto {
  countryIso2Code: string;
  name: string;
  region?: string | null;
  timezone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpsertReferenceCityDto {
  countryIso2Code: string;
  name: string;
  region?: string | null;
  timezone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}
