import { AbstractControl, ValidationErrors } from "@angular/forms";

// Valores permitidos
const PRIORIDADES_VALIDAS = ['Alta', 'Media', 'Baja'];
const ESTADOS_VALIDOS = ['Completada', 'En Progreso', 'Pendiente'];

export function fechaExpiracionValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const fechaIngresada = new Date(valor);
  const ahora = new Date();
  // Resetear horas para comparar solo fecha
  ahora.setHours(0, 0, 0, 0);
  const fechaSinHora = new Date(fechaIngresada);
  fechaSinHora.setHours(0, 0, 0, 0);

  if (fechaSinHora <= ahora) {
    return { fechaNoValida: true };
  }
  return null;
}

export function prioridadValidaValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (valor && !PRIORIDADES_VALIDAS.includes(valor)) {
    return { valorInvalido: true };
  }
  return null;
}

export function estadoValidoValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (valor && !ESTADOS_VALIDOS.includes(valor)) {
    return { valorInvalido: true };
  }
  return null;
}