'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Route } from '@/lib/definitions';
import { addRoute, updateRoute, deleteRoute } from '@/lib/actions';
import { RouteForm } from './forms/RouteForm';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface RouteManagerProps {
  initialRoutes: Route[];
}

export function RouteManager({ initialRoutes }: RouteManagerProps) {
  const [routes, setRoutes] = useState(initialRoutes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    const result = editingRoute
      ? await updateRoute(editingRoute.id, data)
      : await addRoute(data);

    if (result.success) {
      if (editingRoute) {
        setRoutes((prev) =>
          prev.map((r) => (r.id === editingRoute.id ? { ...r, ...data, lastUpdated: new Date().toISOString() } : r))
        );
      } else {
        const newRoute = result.data as Route;
        setRoutes(prev => [newRoute, ...prev]);
      }
      toast({ title: 'Éxito', description: `Ruta ${editingRoute ? 'actualizada' : 'creada'} correctamente.` });
      closeForm();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(false);
  };
  
  const handleDeleteRoute = async (id: string) => {
    setIsLoading(true);
    const result = await deleteRoute(id);
    if (result.success) {
      setRoutes((prev) => prev.filter((route) => route.id !== id));
      toast({ title: 'Éxito', description: 'Ruta eliminada correctamente.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(false);
  };

  const openForm = (route: Route | null = null) => {
    setEditingRoute(route);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingRoute(null);
    setIsFormOpen(false);
  };

  const getImageUrl = (imagePath?: string) => {
    if (imagePath && imagePath.startsWith('https://')) {
      return imagePath;
    }
    const placeholder = PlaceHolderImages.find(p => p.id === imagePath);
    return placeholder?.imageUrl || PlaceHolderImages.find(p => p.id === 'route-grecia-centro')?.imageUrl || '/default-image.png';
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Ruta
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Tarifa (CRC)</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>
                  <Image
                    src={getImageUrl(route.imagenTarjetaUrl)}
                    alt={route.nombre}
                    width={64}
                    height={48}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{route.nombre}</TableCell>
                <TableCell><Badge variant="secondary">{route.category}</Badge></TableCell>
                <TableCell>₡{route.tarifaCRC.toLocaleString('es-CR')}</TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openForm(route)} disabled={isLoading}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmationDialog
                        onConfirm={() => handleDeleteRoute(route.id)}
                        isLoading={isLoading}
                        itemName={route.nombre}
                    >
                        <Button variant="ghost" size="icon" disabled={isLoading}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                  </DeleteConfirmationDialog>
                </TableCell>
              </TableRow>
            ))}
            {routes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay rutas para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoute ? 'Editar Ruta' : 'Agregar Nueva Ruta'}</DialogTitle>
          </DialogHeader>
          <RouteForm
            initialData={editingRoute}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            onClose={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
