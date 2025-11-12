import { EventEmitter } from 'events';
import type { FirestorePermissionError } from './errors';

// An event emitter to broadcast errors across the application.
// This is used to decouple error reporting from the components that display them.
class ErrorEmitter extends EventEmitter {
  emitPermissionError(error: FirestorePermissionError) {
    this.emit('permission-error', error);
  }
}

export const errorEmitter = new ErrorEmitter();
