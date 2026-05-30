import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HuertosService } from '../../servicios/huertos.service';
import { Huerto } from '../../modelos/huerto.model';

@Component({
  selector: 'app-huerto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './huerto-form.component.html',
  styleUrl: './huerto-form.component.scss'
})
export class HuertoFormComponent implements OnInit {

  huertoForm!: FormGroup;
  modoEdicion = false;
  huertoId: string | null = null;
  uid: string | null = null;
  esVistaAdmin = false;
  cargando = false;
  errorMensaje = '';
  estacionActual: string = '';

// Fotos disponibles para el huerto (solo nombres)
fotosDisponiblesNombres: string[] = [
  'huerto1.jpg',
  'huerto2.webp',
  'huerto3.webp',
];

// URLs completas generadas dinámicamente
get fotosDisponibles(): string[] {
  return this.fotosDisponiblesNombres.map(nombre => 
    this.huertoService.getFotoHuertoUrl(nombre)
  );
}

fotoSeleccionada: string = 'huerto1.jpg'; // Guardar solo el nombre

  constructor(
    private fb: FormBuilder,
    private huertoService: HuertosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
 * Obtener URL completa de la foto
 */
getFotoUrl(nombreFoto: string): string {
  return this.huertoService.getFotoHuertoUrl(nombreFoto);
}

  ngOnInit(): void {
    this.initForm();
    this.calcularEstacion();

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      this.uid = params.get('uid');
      this.esVistaAdmin = !!this.uid;

      if (id) {
        this.huertoId = id;
        this.modoEdicion = true;
        await this.cargarHuerto(id);
      }
    });
  }

private initForm(): void {
  this.huertoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    descripcion: ['', [Validators.maxLength(200)]],
    ubicacion: ['', [Validators.required, Validators.minLength(3)]],
    superficie: [null, [Validators.required, Validators.min(0.1)]],
    tipo_suelo: ['', Validators.required],
    horas_sol: [null, [Validators.required, Validators.min(0), Validators.max(24)]],
    tiene_riego: [false],
    fecha_creacion: [this.getFechaActual(), Validators.required],
    notas: ['', [Validators.maxLength(500)]],
    foto: ['huerto1.jpg', Validators.required] // Solo nombre
  });
}

  private getFechaActual(): string {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  private calcularEstacion(): void {
    const mes = new Date().getMonth() + 1;
    
    if (mes >= 3 && mes <= 5) {
      this.estacionActual = 'Primavera';
    } else if (mes >= 6 && mes <= 8) {
      this.estacionActual = 'Verano';
    } else if (mes >= 9 && mes <= 11) {
      this.estacionActual = 'Otoño';
    } else {
      this.estacionActual = 'Invierno';
    }
  }

private async cargarHuerto(id: string): Promise<void> {
  try {
    let huerto: Huerto | null;

    if (this.esVistaAdmin && this.uid) {
      huerto = await this.huertoService.getHuertoByUidAndId(this.uid, id);
    } else {
      huerto = await this.huertoService.getHuertoById(id);
    }

    if (huerto) {
      // Guardar solo el nombre del archivo
      this.fotoSeleccionada = huerto.foto || 'huerto1.jpg';
      
      this.huertoForm.patchValue({
        nombre: huerto.nombre,
        descripcion: huerto.descripcion || '',
        ubicacion: huerto.ubicacion,
        superficie: huerto.superficie,
        tipo_suelo: huerto.tipo_suelo,
        horas_sol: huerto.horas_sol,
        tiene_riego: huerto.tiene_riego,
        fecha_creacion: huerto.fecha_creacion ? huerto.fecha_creacion.split('T')[0] : this.getFechaActual(),
        notas: huerto.notas || '',
        foto: huerto.foto || 'huerto1.jpg'
      });
    }
  } catch (error) {
    this.errorMensaje = 'No se pudo cargar el huerto.';
  }
}

/**
 * Seleccionar una foto
 */
seleccionarFoto(fotoUrl: string): void {
  // Extraer solo el nombre del archivo de la URL
  const nombreFoto = fotoUrl.split('/').pop() || 'huerto1.jpg';
  
  this.fotoSeleccionada = nombreFoto;
  this.huertoForm.patchValue({ foto: nombreFoto });
  console.log('Foto seleccionada:', nombreFoto);
}

  async onSubmit(): Promise<void> {
    if (this.huertoForm.invalid) {
      this.huertoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    const formValue = this.huertoForm.value;

    try {
      if (this.modoEdicion && this.huertoId) {
        const huertoActualizado = new Huerto(
          formValue.nombre,
          formValue.descripcion,
          formValue.ubicacion,
          formValue.superficie,
          formValue.tipo_suelo,
          formValue.horas_sol,
          formValue.tiene_riego,
          new Date(formValue.fecha_creacion).toISOString(),
          this.huertoId,
          formValue.notas,
          formValue.foto
        );

        if (this.esVistaAdmin && this.uid) {
          await this.huertoService.updateObjectByUid(this.uid, huertoActualizado);
        } else {
          await this.huertoService.updateObject(huertoActualizado);
        }

      } else {
        const nuevoHuerto = new Huerto(
          formValue.nombre,
          formValue.descripcion,
          formValue.ubicacion,
          formValue.superficie,
          formValue.tipo_suelo,
          formValue.horas_sol,
          formValue.tiene_riego,
          new Date(formValue.fecha_creacion).toISOString(),
          undefined,
          formValue.notas,
          formValue.foto
        );
        
        await this.huertoService.createHuerto(nuevoHuerto);
      }

      if (this.esVistaAdmin && this.uid) {
        this.router.navigate(['/app/admin/usuario', this.uid]);
      } else {
        this.router.navigate(['/app/home']);
      }

    } catch (error) {
      console.error('Error al guardar huerto:', error);
      this.errorMensaje = 'Ocurrió un error al guardar. Inténtalo de nuevo.';
    } finally {
      this.cargando = false;
    }
  }

  onCancelar(): void {
    if (this.esVistaAdmin && this.uid) {
      this.router.navigate(['/app/admin/usuario', this.uid]);
    } else {
      this.router.navigate(['/app/home']);
    }
  }
}