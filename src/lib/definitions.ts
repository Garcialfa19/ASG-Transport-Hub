import type { Timestamp } from 'firebase/firestore';

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

export type Driver = {
  id: string;
  nombre: string;
  busPlate?: string;
  routeId?: string;
  status?: string;
  comment?: string;
  lastUpdated: string;
};

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
};
