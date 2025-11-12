'use client';
import { Bell, Info } from 'lucide-react';
import type { Alert } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/lib/firebase/hooks/use-collection';
import { collection, orderBy, query } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/client';

export default function AlertasPage() {
  const { data: alerts, loading } = useCollection<Alert>(
    query(collection(firestore, 'alerts'), orderBy('lastUpdated', 'desc'))
  );

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Alertas del Servicio</h1>
        <p className="mt-2 text-lg text-muted-foreground">Manténgase informado sobre cualquier eventualidad en nuestras rutas.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <Bell className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <CardTitle>{alert.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Publicado: {new Date(alert.lastUpdated).toLocaleString('es-CR')}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-12">
            <CardContent className="flex flex-col items-center text-center gap-4">
              <Info className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No hay alertas activas en este momento.</p>
              <p className="text-muted-foreground">Todos nuestros servicios operan con normalidad.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
