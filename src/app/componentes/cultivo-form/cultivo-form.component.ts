import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { PlantasService } from '../../servicios/plantas.service';
import { CultivosService } from '../../servicios/cultivos.service';
import { AmenazasService } from '../../servicios/amenazas.service';
import { Planta } from '../../modelos/planta.model';
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

  nombre: string = '';
  plantaIdSeleccionada: string = '';
  notas: string = '';
  cantidad: number = 1;
  estado: 'plantado' | 'creciendo' | 'maduro' | 'cosechado' | 'enfermo' = 'plantado';
  amenazaIdSeleccionada: string = '';
  fecha_siembra: string = '';

  guardando: boolean = false;
  error: string = '';

  readonly estados: { 
    valor: 'plantado' | 'creciendo' | 'maduro' | 'cosechado' | 'enfermo', 
    etiqueta: string, 
    icono: string, 
    clase: string 
  }[] = [
    { valor: 'plantado',  etiqueta: 'Plantado',  icono: 'fa-seedling',      clase: 'btn-secondary' },
    { valor: 'creciendo', etiqueta: 'Creciendo', icono: 'fa-leaf',          clase: 'btn-info' },
    { valor: 'maduro',    etiqueta: 'Maduro',    icono: 'fa-check-circle',  clase: 'btn-success' },
    { valor: 'cosechado', etiqueta: 'Cosechado', icono: 'fa-box',           clase: 'btn-dark' },
    { valor: 'enfermo',   etiqueta: 'Enfermo',   icono: 'fa-virus',         clase: 'btn-warning' },
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
          if (!cultivo) { 
            this.error = 'No se encontró el cultivo.'; 
            return; 
          }
          this.nombre                = cultivo.nombre;
          this.plantaIdSeleccionada  = cultivo.plantaId;
          this.notas                 = cultivo.notas;
          this.cantidad              = cultivo.cantidad;
          this.estado                = cultivo.estado;
          this.fecha_siembra         = cultivo.fecha_siembra;
          this.amenazaIdSeleccionada = cultivo.amenazaId ?? '';
          this.filtrarAmenazas();
        });
    }
  }

  onEstadoChange(nuevoEstado: 'plantado' | 'creciendo' | 'maduro' | 'cosechado' | 'enfermo'): void {
    this.estado = nuevoEstado;
    
    // Si cambia a un estado que NO es enfermo, limpiar amenaza
    if (nuevoEstado !== 'enfermo') {
      this.amenazaIdSeleccionada = '';
    }
    
    this.filtrarAmenazas();
  }

  private filtrarAmenazas(): void {
    // Solo mostrar amenazas cuando el estado es 'enfermo'
    if (this.estado === 'enfermo') {
      this.amenazasFiltradas = this.amenazas;
    } else {
      this.amenazasFiltradas = [];
    }
  }

  get mostrarDashboardAmenaza(): boolean {
    return this.estado === 'enfermo';
  }

  async guardarCultivo(): Promise<void> {
    if (!this.plantaIdSeleccionada) {
      this.error = 'Debes seleccionar una planta.';
      return;
    }
    
    if (this.mostrarDashboardAmenaza && !this.amenazaIdSeleccionada) {
      this.error = 'Debes seleccionar la amenaza que afecta a la planta.';
      return;
    }

    if (this.cantidad < 1) {
      this.error = 'La cantidad debe ser al menos 1.';
      return;
    }

    this.guardando = true;
    this.error = '';
    const uid = this.getUidToUse();

    try {
      if (this.modoEdicion && this.cultivoId) {
        // Actualizar cultivo existente
        // Constructor: nombre, plantaId, fecha_siembra, estado, cantidad, notas, amenazaId, id
        const cultivoActualizado = new Cultivo(
          this.nombre.trim() || 'Cultivo sin nombre',
          this.plantaIdSeleccionada,
          this.fecha_siembra,
          this.estado,
          this.cantidad,
          this.notas.trim(),
          this.estado === 'enfermo' ? this.amenazaIdSeleccionada : null,
          this.cultivoId
        );
        
        await this.cultivosService.updateCultivo(uid, this.huertoId, cultivoActualizado);
      } else {
        // Crear nuevo cultivo
        // Generar nombre automático si no se proporciona
        const nombreCultivo = this.nombre.trim() || `Cultivo ${new Date().getTime()}`;
        
        const nuevoCultivo = new Cultivo(
          nombreCultivo,
          this.plantaIdSeleccionada,
          new Date().toISOString(),
          this.estado, // Usar el estado seleccionado por el usuario
          this.cantidad,
          this.notas.trim(),
          this.estado === 'enfermo' ? this.amenazaIdSeleccionada : null // Amenaza si está enfermo
        );
        
        await this.cultivosService.createCultivo(uid, this.huertoId, nuevoCultivo);
      }

      this.navegarDeVuelta();
    } catch (e) {
      console.error('Error al guardar cultivo:', e);
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