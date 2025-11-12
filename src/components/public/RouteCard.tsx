'use client';
import Image from 'next/image';
import { Clock, DollarSign, MapPin } from 'lucide-react';

export default function RouteCard({ nombre, duracionMin, costo, origen, destino, imagenUrl }: {
  nombre: string;
  duracionMin?: number;
  costo?: number;
  origen?: string;
  destino?: string;
  imagenUrl?: string;
}) {
  const duracion =
    duracionMin ? `${Math.floor(duracionMin / 60)}h ${duracionMin % 60}m` : '—';
  const costoFmt =
    typeof costo === 'number'
      ? new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(costo)
      : '—';

  return (
    <div className="rounded-xl border bg-white shadow hover:shadow-lg transition overflow-hidden">
      {imagenUrl ? (
        <div className="relative h-40 w-full">
          <Image src={imagenUrl} alt={nombre} fill className="object-cover" />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center bg-gray-100 text-gray-500">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{origen && destino ? `${origen} → ${destino}` : 'Ruta'}</span>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{nombre}</h3>
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {duracion}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> {costoFmt}
          </span>
        </div>
        {(origen || destino) && (
          <p className="mt-2 text-xs text-gray-500">
            {origen && destino ? `${origen} → ${destino}` : origen ?? destino}
          </p>
        )}
      </div>
    </div>
  );
}