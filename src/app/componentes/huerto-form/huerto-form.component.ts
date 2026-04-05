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

  constructor(
    private fb: FormBuilder,
    private huertoService: HuertosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

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
      tipo: ['parcela', Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(200)]]
    });
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
          tipo: huerto.tipo,
          nombre: huerto.nombre,
          descripcion: huerto.descripcion || ''
        });
      }
    } catch (error) {
      this.errorMensaje = 'No se pudo cargar el huerto.';
    }
  }

  setTipo(tipo: 'parcela' | 'maceta'): void {
    this.huertoForm.get('tipo')?.setValue(tipo);
  }

  async onSubmit(): Promise<void> {
    if (this.huertoForm.invalid) {
      this.huertoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    const { tipo, nombre, descripcion } = this.huertoForm.value;

    try {
      if (this.modoEdicion && this.huertoId) {
        const huertoActualizado = new Huerto(this.huertoId, nombre, descripcion, new Date(), tipo);

        if (this.esVistaAdmin && this.uid) {
          await this.huertoService.updateObjectByUid(this.uid, huertoActualizado);
        } else {
          await this.huertoService.updateObject(huertoActualizado);
        }
      } else {
        const nuevoHuerto = new Huerto('', nombre, descripcion, new Date(), tipo);
        await this.huertoService.createHuerto(nuevoHuerto);
      }

      // Redirigir según contexto
      if (this.esVistaAdmin && this.uid) {
        this.router.navigate(['/app/admin/usuario', this.uid]);
      } else {
        this.router.navigate(['/app/home']);
      }

    } catch (error) {
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