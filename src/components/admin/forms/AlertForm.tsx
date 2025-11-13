'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import type { Alert } from '@/lib/definitions';

// Keeping the schema tiny ensures quick data entry when ops needs to publish a notice fast.
const alertSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres.'),
});

type AlertFormValues = z.infer<typeof alertSchema>;

interface AlertFormProps {
  onSubmit: (data: AlertFormValues) => void;
  isLoading: boolean;
  onClose: () => void;
}

export function AlertForm({ onSubmit, isLoading, onClose }: AlertFormProps) {
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: { titulo: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* I only capture the headline here—the body of the notice lives directly on the route cards. */}
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de la Alerta</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Suspensión de servicio en..." {...field} />
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
            Crear Alerta
          </Button>
        </div>
      </form>
    </Form>
  );
}
