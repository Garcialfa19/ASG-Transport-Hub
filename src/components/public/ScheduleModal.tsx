'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface ScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  imageUrl: string;
  routeName: string;
}

export function ScheduleModal({ isOpen, onOpenChange, imageUrl, routeName }: ScheduleModalProps) {
    const [loading, setLoading] = useState(true);
    
    return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        onOpenChange(open);
        // Reset loading state when dialog is closed to ensure it shows on next open
        if (!open) {
            setTimeout(() => setLoading(true), 300); // Delay to allow animation
        }
    }}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{routeName}</DialogTitle>
          <DialogDescription>Horario de la ruta. Las horas pueden variar.</DialogDescription>
        </DialogHeader>
        <div className="relative flex-1 overflow-auto p-2">
            {loading && <Skeleton className="absolute inset-2" />}
            <Image
                src={imageUrl}
                alt={`Horario para ${routeName}`}
                fill
                className="object-contain"
                onLoad={() => setLoading(false)}
                sizes="90vw"
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
