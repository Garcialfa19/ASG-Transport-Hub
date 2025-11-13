'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Driver, Route } from '@/lib/definitions';
import { addDriver, updateDriver, deleteDriver } from '@/lib/actions';
import { getDrivers } from '@/lib/data-service-client';
import { DriverForm } from './forms/DriverForm';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';

interface DriverManagerProps {
  routes: Route[];
  isAdmin: boolean;
}

export function DriverManager({ routes, isAdmin }: DriverManagerProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAdmin) {
      setDataLoading(false);
      return;
    }
    
    const fetchDrivers = async () => {
      setDataLoading(true);
      try {
        const driversData = await getDrivers();
        setDrivers(driversData);
      } catch (error) {
        // The error is now handled by the global error emitter, 
        // so we don't need to show a toast here.
        console.error("Failed to fetch drivers:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchDrivers();
  }, [isAdmin]);

  const getRouteName = (routeId?: string) => routes.find((r) => r.id === routeId)?.nombre || 'N/A';

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    const result = editingDriver
      ? await updateDriver(editingDriver.id, data)
      : await addDriver(data);

    if (result.success) {
      // Note: For a more robust solution, we would refetch the data.
      // For now, we optimistically update the UI.
      if (editingDriver) {
        setDrivers((prev) =>
          prev.map((d) => (d.id === editingDriver.id ? { ...d, ...data, id: editingDriver.id, lastUpdated: new Date().toISOString() } : d))
        );
      } else {
         const newDriver = { ...data, id: result.data, lastUpdated: new Date().toISOString() };
         setDrivers(prev => [newDriver, ...prev]);
      }
      toast({ title: 'Éxito', description: `Chofer ${editingDriver ? 'actualizado' : 'creado'} correctamente.` });
      closeForm();
    } else {
      // Server action errors are still shown via toast. Permission errors are not server action errors.
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(false);
  };
  
  const handleDeleteDriver = async (id: string) => {
    setIsLoading(true);
    const result = await deleteDriver(id);
    if (result.success) {
      setDrivers((prev) => prev.filter((driver) => driver.id !== id));
      toast({ title: 'Éxito', description: 'Chofer eliminado correctamente.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(false);
  };

  const openForm = (driver: Driver | null = null) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingDriver(null);
    setIsFormOpen(false);
  };
  
  if (dataLoading) {
      return (
          <div className="space-y-4">
              <div className="flex justify-end mb-4">
                  <Skeleton className="h-10 w-36" />
              </div>
              <Skeleton className="h-64 w-full" />
          </div>
      );
  }

  if (!isAdmin) {
    return (
       <div className="border rounded-md p-8 text-center text-muted-foreground">
          No tiene permisos de administrador para ver esta sección.
       </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openForm()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Chofer
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Ruta Asignada</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell className="font-medium">{driver.nombre}</TableCell>
                <TableCell>{driver.busPlate || 'N/A'}</TableCell>
                <TableCell>{getRouteName(driver.routeId)}</TableCell>
                <TableCell><Badge variant={driver.status === 'Activo' ? 'default' : 'secondary'}>{driver.status || 'N/A'}</Badge></TableCell>
                <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openForm(driver)} disabled={isLoading}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteConfirmationDialog
                        onConfirm={() => handleDeleteDriver(driver.id)}
                        isLoading={isLoading}
                        itemName={driver.nombre}
                    >
                        <Button variant="ghost" size="icon" disabled={isLoading}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                  </DeleteConfirmationDialog>
                </TableCell>
              </TableRow>
            ))}
            {drivers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay choferes para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDriver ? 'Editar Chofer' : 'Agregar Nuevo Chofer'}</DialogTitle>
            <DialogDescription>
              {editingDriver ? 'Actualice los detalles del chofer.' : 'Agregue un nuevo chofer al sistema.'}
            </DialogDescription>
          </DialogHeader>
          <DriverForm 
            initialData={editingDriver}
            routes={routes}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            onClose={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
