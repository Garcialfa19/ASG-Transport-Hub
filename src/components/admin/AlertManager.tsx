'use client';

import { useState } from 'react';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
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
import type { Alert } from '@/lib/definitions';
import { addAlert, deleteAlert } from '@/lib/actions';
import { AlertForm } from './forms/AlertForm';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface AlertManagerProps {
  initialAlerts: Alert[];
}

export function AlertManager({ initialAlerts }: AlertManagerProps) {
  const [alerts, setAlerts] = useState(initialAlerts || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddAlert = async (data: { titulo: string }) => {
    setIsLoading(true);
    const result = await addAlert(data);
    if (result.success) {
      // I prepend new alerts so the dashboard matches the descending sort in Firestore.
      const newAlert = { ...data, id: result.data, lastUpdated: new Date().toISOString() };
      setAlerts((prev) => [newAlert, ...prev]);
      toast({ title: 'Éxito', description: 'Alerta creada correctamente.' });
      setIsFormOpen(false);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(false);
  };
  
  const handleDeleteAlert = async (id: string) => {
    setIsLoading(true);
    const result = await deleteAlert(id);
    if (result.success) {
      // I immediately drop the alert locally so the table reflects the change before the listener fires.
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      toast({ title: 'Éxito', description: 'Alerta eliminada correctamente.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Alerta
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Última Actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts && alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.titulo}</TableCell>
                <TableCell>{format(new Date(alert.lastUpdated), "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell className="text-right">
                  <DeleteConfirmationDialog
                    onConfirm={() => handleDeleteAlert(alert.id)}
                    isLoading={isLoading}
                    itemName={alert.titulo}
                  >
                    <Button variant="ghost" size="icon" disabled={isLoading}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteConfirmationDialog>
                </TableCell>
              </TableRow>
            ))}
            {(!alerts || alerts.length === 0) && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No hay alertas para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Alerta</DialogTitle>
            <DialogDescription>
              Cree una nueva alerta de servicio que se mostrará públicamente en la página de Alertas.
            </DialogDescription>
          </DialogHeader>
          <AlertForm onSubmit={handleAddAlert} isLoading={isLoading} onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
