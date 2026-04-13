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
  uid: string | null = null;       // uid del usuario que se está editando (admin)
  esVistaAdmin = false;
  cargando = false;
  errorMensaje = '';
  estacionActual: string = '';

  constructor(
    private fb: FormBuilder,
    private huertoService: HuertosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.calcularEstacion(); // Calcular estación al cargar

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
      superficie: [0, [Validators.required, Validators.min(0.1)]],
      tipo_suelo: ['franco', Validators.required],
      horas_sol: [6, [Validators.required, Validators.min(0), Validators.max(24)]],
      tiene_riego: [false],
      fecha_creacion: [this.getFechaActual(), Validators.required], // Fecha por defecto hoy
      notas: ['', [Validators.maxLength(500)]]
    });
  }

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD para el input date
   */
  private getFechaActual(): string {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  /**
   * Calcula la estación del año según el mes actual
   * Hemisferio Norte (España)
   */
  private calcularEstacion(): void {
    const mes = new Date().getMonth() + 1; // 1-12
    
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
        this.huertoForm.patchValue({
          nombre: huerto.nombre,
          descripcion: huerto.descripcion || '',
          ubicacion: huerto.ubicacion,
          superficie: huerto.superficie,
          tipo_suelo: huerto.tipo_suelo,
          horas_sol: huerto.horas_sol,
          tiene_riego: huerto.tiene_riego,
          fecha_creacion: huerto.fecha_creacion ? huerto.fecha_creacion.split('T')[0] : this.getFechaActual(),
          notas: huerto.notas || ''
        });
      }
    } catch (error) {
      this.errorMensaje = 'No se pudo cargar el huerto.';
    }
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
        // Actualizar huerto existente
        const huertoActualizado = new Huerto(
          formValue.nombre,
          formValue.descripcion,
          formValue.ubicacion,
          formValue.superficie,
          formValue.tipo_suelo,
          formValue.horas_sol,
          formValue.tiene_riego,
          new Date(formValue.fecha_creacion).toISOString(), // Convertir fecha del input
          this.huertoId,
          formValue.notas
        );

        if (this.esVistaAdmin && this.uid) {
          await this.huertoService.updateObjectByUid(this.uid, huertoActualizado);
        } else {
          await this.huertoService.updateObject(huertoActualizado);
        }

      } else {
        // Crear nuevo huerto
        const nuevoHuerto = new Huerto(
          formValue.nombre,
          formValue.descripcion,
          formValue.ubicacion,
          formValue.superficie,
          formValue.tipo_suelo,
          formValue.horas_sol,
          formValue.tiene_riego,
          new Date(formValue.fecha_creacion).toISOString(), // Convertir fecha del input
          undefined,
          formValue.notas
        );
        
        await this.huertoService.createHuerto(nuevoHuerto);
      }

      // Redirigir según contexto
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