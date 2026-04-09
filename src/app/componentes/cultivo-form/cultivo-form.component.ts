import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { Planta } from '../../modelos/planta.model';
import { PlantasService } from '../../servicios/plantas.service';
import { CultivosService } from '../../servicios/cultivos.service';
import { AmenazasService } from '../../servicios/amenazas.service';
import { Amenaza } from '../../modelos/amenaza.model';
import { Cultivo } from '../../modelos/cultivo.model';

@Component({
  selector: 'app-cultivo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cultivo-form.component.html',
  styleUrl: './cultivo-form.component.scss'
})
export class CultivoFormComponent implements OnInit {

  huertoId!: string;
  cultivoId: string | null = null;
  uid: string | null = null;
  esVistaAdmin: boolean = false;
  modoEdicion: boolean = false;

  plantas$!: Observable<Planta[]>;
  amenazas: Amenaza[] = [];
  amenazasFiltradas: Amenaza[] = [];

  plantaIdSeleccionada: string = '';
  notas: string = '';
  estado: 'sana' | 'enferma' | 'infectada' = 'sana';
  amenazaIdSeleccionada: string = '';
  fechaSiembra: string = '';

  guardando: boolean = false;
  error: string = '';

  readonly estados: { valor: 'sana' | 'enferma' | 'infectada', etiqueta: string, icono: string, clase: string }[] = [
    { valor: 'sana',      etiqueta: 'Sana',                icono: 'fa-circle-check', clase: 'btn-success' },
    { valor: 'enferma',   etiqueta: 'Enferma',             icono: 'fa-virus',        clase: 'btn-warning' },
    { valor: 'infectada', etiqueta: 'Infectada por plaga', icono: 'fa-bug',          clase: 'btn-danger'  },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plantasService: PlantasService,
    private cultivosService: CultivosService,
    private amenazasService: AmenazasService,
    private auth: Auth
  ) {}

  private getUidToUse(): string {
    if (this.esVistaAdmin && this.uid) return this.uid;
    return this.auth.currentUser!.uid;
  }

  ngOnInit(): void {
    this.huertoId  = this.route.snapshot.paramMap.get('huertoId')!;
    this.cultivoId = this.route.snapshot.paramMap.get('cultivoId');
    this.uid       = this.route.snapshot.paramMap.get('uid');
    this.modoEdicion  = !!this.cultivoId;
    this.esVistaAdmin = !!this.uid;

    this.plantas$ = this.plantasService.getAllPlantasFirebase();

    this.amenazasService.getAllAmenazasFirebase().subscribe(amenazas => {
      this.amenazas = amenazas;
      this.filtrarAmenazas();
    });

    if (this.modoEdicion && this.cultivoId) {
      this.cultivosService.getCultivoById(this.getUidToUse(), this.huertoId, this.cultivoId)
        .then((cultivo: Cultivo | null) => {
          if (!cultivo) { this.error = 'No se encontró el cultivo.'; return; }
          this.plantaIdSeleccionada  = cultivo.plantaId;
          this.notas                 = cultivo.notas;
          this.estado                = cultivo.estado;
          this.fechaSiembra          = cultivo.fechaSiembra;
          this.amenazaIdSeleccionada = cultivo.amenazaId ?? '';
          this.filtrarAmenazas();
        });
    }
  }

  onEstadoChange(nuevoEstado: 'sana' | 'enferma' | 'infectada'): void {
    this.estado = nuevoEstado;
    this.amenazaIdSeleccionada = '';
    this.filtrarAmenazas();
  }

  private filtrarAmenazas(): void {
    if (this.estado === 'enferma') {
      this.amenazasFiltradas = this.amenazas.filter(a => a.tipo === 'enfermedad');
    } else if (this.estado === 'infectada') {
      this.amenazasFiltradas = this.amenazas.filter(a => a.tipo === 'plaga');
    } else {
      this.amenazasFiltradas = [];
    }
  }

  get mostrarDashboardAmenaza(): boolean {
    return this.estado === 'enferma' || this.estado === 'infectada';
  }

  async guardarCultivo(): Promise<void> {
    if (!this.plantaIdSeleccionada) {
      this.error = 'Debes seleccionar una planta.';
      return;
    }
    if (this.mostrarDashboardAmenaza && !this.amenazaIdSeleccionada) {
      this.error = 'Debes seleccionar la enfermedad o plaga que afecta a la planta.';
      return;
    }

    this.guardando = true;
    this.error = '';
    const uid = this.getUidToUse();

    try {
      if (this.modoEdicion && this.cultivoId) {
        const cultivoActualizado: Cultivo = {
          id:           this.cultivoId,
          plantaId:     this.plantaIdSeleccionada,
          estado:       this.estado,
          fechaSiembra: this.fechaSiembra,
          notas:        this.notas.trim(),
          amenazaId:    this.estado === 'sana' ? null : this.amenazaIdSeleccionada
        };
        await this.cultivosService.updateCultivo(uid, this.huertoId, cultivoActualizado);
      } else {
        const nuevoCultivo: Cultivo = {
          id:           '',
          plantaId:     this.plantaIdSeleccionada,
          estado:       'sana',
          fechaSiembra: new Date().toISOString(),
          notas:        this.notas.trim(),
          amenazaId:    null
        };
        await this.cultivosService.createCultivo(uid, this.huertoId, nuevoCultivo);
      }

      this.navegarDeVuelta();
    } catch (e) {
      this.error = 'Error al guardar el cultivo. Inténtalo de nuevo.';
      this.guardando = false;
    }
  }

  cancelar(): void {
    this.navegarDeVuelta();
  }

  private navegarDeVuelta(): void {
    if (this.esVistaAdmin && this.uid) {
      this.router.navigate(['/app/admin/usuario', this.uid, 'huerto', this.huertoId]);
    } else {
      this.router.navigate(['/app/huerto', this.huertoId]);
    }
  }
}