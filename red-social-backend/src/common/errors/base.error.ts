// Corregido
export default class BaseError extends Error {
  constructor(message: string) {
    super(message);
    // Esto asegura que el nombre del error sea el de la clase hija
    this.name = this.constructor.name;

    // Captura el stack trace correctamente (importante en Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}
