'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';
import type { Route } from '@/lib/definitions';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/actions';

const routeSchema = z.object({
  nombre: z.string().min(3, 'El nombre es requerido.'),
  especificacion: z.string().min(10, 'La especificación es requerida.'),
  category: z.enum(['grecia', 'sarchi'], { required_error: 'La categoría es requerida.' }),
  duracionMin: z.coerce.number().min(1, 'La duración debe ser al menos 1.'),
  tarifaCRC: z.coerce.number().min(1, 'La tarifa es requerida.'),
  imagenTarjetaUrl: z.string().optional(),
  imagenHorarioUrl: z.string().optional(),
});

type RouteFormValues = z.infer<typeof routeSchema>;

interface RouteFormProps {
  initialData?: Route | null;
  onSubmit: (data: RouteFormValues) => void;
  isLoading: boolean;
  onClose: () => void;
}

export function RouteForm({ initialData, onSubmit, isLoading, onClose }: RouteFormProps) {
  const { toast } = useToast();
  const [isUploadingCard, setIsUploadingCard] = useState(false);
  const [isUploadingSchedule, setIsUploadingSchedule] = useState(false);
  
  const cardImageRef = useRef<HTMLInputElement>(null);
  const scheduleImageRef = useRef<HTMLInputElement>(null);

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: initialData || {
      nombre: '',
      especificacion: '',
      category: 'grecia',
      duracionMin: 30,
      tarifaCRC: 500,
      imagenTarjetaUrl: '',
      imagenHorarioUrl: '',
    },
  });

  const handleFileUpload = async (file: File, field: 'imagenTarjetaUrl' | 'imagenHorarioUrl') => {
    const setIsUploading = field === 'imagenTarjetaUrl' ? setIsUploadingCard : setIsUploadingSchedule;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadFile(formData, 'route-images');
    
    if (result.success && result.data) {
      // In a real app, result.data would be a full URL from a storage service.
      // Here, we use a placeholder ID to find the image in placeholder-images.json
      // For a more robust solution, you'd save the URL directly.
      // This is a workaround for the prompt's constraints.
      // We will save the path returned by the server action.
      form.setValue(field, result.data);
      toast({ title: 'Éxito', description: 'Imagen subida correctamente.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsUploading(false);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Info */}
        <FormField name="nombre" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Nombre de la Ruta</FormLabel><FormControl><Input placeholder="Ej: Grecia - San Roque" {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <FormField name="especificacion" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Especificación</FormLabel><FormControl><Textarea placeholder="Ej: Por el EBAIS..." {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField name="category" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Categoría</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="grecia">Grecia</SelectItem><SelectItem value="sarchi">Sarchí</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField name="duracionMin" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Duración (min)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField name="tarifaCRC" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Tarifa (CRC)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>
        
        {/* Image Uploads */}
        <FormField name="imagenTarjetaUrl" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Imagen de Tarjeta</FormLabel>
            <FormControl>
                <div className="flex items-center gap-4">
                    <Input readOnly value={field.value || 'No seleccionada'} className="flex-1"/>
                    <input type="file" ref={cardImageRef} hidden onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'imagenTarjetaUrl')} accept="image/*" />
                    <Button type="button" variant="outline" onClick={() => cardImageRef.current?.click()} disabled={isUploadingCard}>
                        {isUploadingCard ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                        Subir
                    </Button>
                </div>
            </FormControl>
            <FormDescription>Esta imagen aparece en la tarjeta de la ruta.</FormDescription>
            <FormMessage />
          </FormItem>
        )}/>
        <FormField name="imagenHorarioUrl" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Imagen de Horario</FormLabel>
            <FormControl>
                <div className="flex items-center gap-4">
                    <Input readOnly value={field.value || 'No seleccionada'} className="flex-1"/>
                    <input type="file" ref={scheduleImageRef} hidden onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'imagenHorarioUrl')} accept="image/*" />
                    <Button type="button" variant="outline" onClick={() => scheduleImageRef.current?.click()} disabled={isUploadingSchedule}>
                        {isUploadingSchedule ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                        Subir
                    </Button>
                </div>
            </FormControl>
             <FormDescription>Esta imagen se muestra en el modal del horario.</FormDescription>
            <FormMessage />
          </FormItem>
        )}/>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading || isUploadingCard || isUploadingSchedule}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Guardar Cambios' : 'Crear Ruta'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
