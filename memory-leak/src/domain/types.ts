export interface Link {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: number;
  expiresAt: number;
}

export interface GeoInfo {
  ip: string;
  country: string;
  city: string;
}

export interface ClickEvent {
  linkId: string;
  ip: string;
  timestamp: number;
  mockedGeo: GeoInfo;
}
