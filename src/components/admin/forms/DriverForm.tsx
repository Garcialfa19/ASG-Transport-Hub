'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import type { Driver, Route } from '@/lib/definitions';

const driverSchema = z.object({
  nombre: z.string().min(3, 'El nombre es requerido.'),
  busPlate: z.string().optional(),
  routeId: z.string().optional(),
  status: z.string().optional(),
  comment: z.string().optional(),
});

type DriverFormValues = z.infer<typeof driverSchema>;

interface DriverFormProps {
  initialData?: Driver | null;
  routes: Route[];
  onSubmit: (data: DriverFormValues) => void;
  isLoading: boolean;
  onClose: () => void;
}

export function DriverForm({ initialData, routes, onSubmit, isLoading, onClose }: DriverFormProps) {
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: initialData
      ? {
          nombre: initialData.nombre,
          busPlate: initialData.busPlate || '',
          routeId: initialData.routeId || '',
          status: initialData.status || '',
          comment: initialData.comment || '',
        }
      : {
          nombre: '',
          busPlate: '',
          routeId: '',
          status: 'Activo',
          comment: '',
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="busPlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa del Bus (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: AB 1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="routeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ruta Asignada (Opcional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una ruta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Ninguna</SelectItem>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                  <SelectItem value="Vacaciones">Vacaciones</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Anotaciones adicionales..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Guardar Cambios' : 'Crear Chofer'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
