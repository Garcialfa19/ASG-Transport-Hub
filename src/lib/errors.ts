// A custom error class for Firestore permission errors.
// This allows us to capture more context about what failed.
export class FirestorePermissionError extends Error {
  refPath: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  resource?: any;

  constructor(
    message: string,
    refPath: string,
    operation: 'get' | 'list' | 'create' | 'update' | 'delete',
    resource?: any
  ) {
    super(message);
    this.name = 'FirestorePermissionError';
    this.refPath = refPath;
    this.operation = operation;
    this.resource = resource;
  }
}
