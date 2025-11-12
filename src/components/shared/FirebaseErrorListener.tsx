'use client';

import { useEffect, useState } from 'react';
import { errorEmitter } from '@/lib/error-emitter';
import type { FirestorePermissionError } from '@/lib/errors';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, X } from 'lucide-react';
import { Button } from '../ui/button';

export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (e: FirestorePermissionError) => {
      console.log('Permission error received by listener:', e);
      setError(e);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  if (!error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[200] max-w-lg w-full">
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Firestore Security Rule Error</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-1 text-xs">
            <p>
              <strong>Operation:</strong> <code className="bg-red-900/50 px-1 py-0.5 rounded">{error.operation}</code>
            </p>
            <p>
              <strong>Path:</strong> <code className="bg-red-900/50 px-1 py-0.5 rounded">{error.refPath}</code>
            </p>
            {error.resource && (
               <p>
                <strong>Resource:</strong>
                <pre className="mt-1 p-2 bg-red-900/50 rounded overflow-x-auto">
                    {JSON.stringify(error.resource, null, 2)}
                </pre>
               </p>
            )}
          </div>
        </AlertDescription>
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setError(null)}
            className="absolute top-2 right-2 h-6 w-6"
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </Button>
      </Alert>
    </div>
  );
}
