import type { Timestamp } from 'firebase/firestore';

// Firestore type definitions stay here so both client and server code speak the same language.
export type Route = {
  id: string;
  nombre: string;
  especificacion: string;
  category: 'grecia' | 'sarchi';
  duracionMin: number;
  tarifaCRC: number;
  imagenHorarioUrl?: string;
  imagenTarjetaUrl?: string;
  lastUpdated: string;
};

export type Alert = {
  id: string;
  titulo: string;
  lastUpdated: string;
};

// Drivers get a few optional fields so I can progressively enhance the dashboard without breaking
// older documents.
export type Driver = {
  id: string;
  nombre: string;
  busPlate?: string;
  routeId?: string;
  status?: string;
  comment?: string;
  lastUpdated: string;
};

// This mirrors what I care about from `firebase.auth().currentUser` when rendering the dashboard.
export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
};
