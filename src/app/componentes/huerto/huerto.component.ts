import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { CultivosService } from '../../servicios/cultivos.service';
import { PlantasService } from '../../servicios/plantas.service';
import { HuertosService } from '../../servicios/huertos.service';
import { AmenazasService } from '../../servicios/amenazas.service';
import { HuertoAnalisisService } from '../../servicios/huerto-analisis.service';
import { Cultivo } from '../../modelos/cultivo.model';
import { Planta } from '../../modelos/planta.model';
import { Huerto } from '../../modelos/huerto.model';
import { Amenaza } from '../../modelos/amenaza.model';
import { ImagenAmenazaComponent } from '../imagen-amenaza/imagen-amenaza.component';
import { ImagenPlantaComponent } from '../imagen-planta/imagen-planta.component';

@Component({
  selector: 'app-huerto',
  standalone: true,
  imports: [CommonModule, ImagenAmenazaComponent, ImagenPlantaComponent],
  templateUrl: './huerto.component.html',
  styleUrl: './huerto.component.scss'
})
export class HuertoComponent implements OnInit {

  huertoId!: string;
  uid: string | null = null;
  esVistaAdmin: boolean = false;
  huerto: Huerto | null = null;
  cultivos$!: Observable<Cultivo[]>;
  cultivosArray: Cultivo[] = []; // Array local para búsqueda
  plantasMap: Map<string, Planta> = new Map();
  amenazasMap: Map<string, Amenaza> = new Map();

  // Estado del análisis IA
  analizandoHuerto: boolean = false;
  analisisResultado: string | null = null;
  analisisError: string | null = null;
  mostrarModalAnalisis: boolean = false;

  // Modal eliminar cultivo
  modalEliminarCultivo = {
    mostrar: false,
    cultivo: null as Cultivo | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cultivosService: CultivosService,
    private plantasService: PlantasService,
    private huertosService: HuertosService,
    private amenazasService: AmenazasService,
    private analisisService: HuertoAnalisisService,
    private auth: Auth
  ) {}

  /**
 * Obtener URL completa de la foto del huerto
 */
getFotoHuertoUrl(): string {
  return this.huertosService.getFotoHuertoUrl(this.huerto?.foto);
}

  ngOnInit(): void {
    this.huertoId = this.route.snapshot.paramMap.get('huertoId')
                 ?? this.route.snapshot.paramMap.get('id')!;
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.esVistaAdmin = !!this.uid;

    this.cultivos$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);

        const uidToUse = this.esVistaAdmin && this.uid ? this.uid : user.uid;

        // Cargamos el huerto
        if (this.esVistaAdmin && this.uid) {
          this.huertosService.getHuertoByUidAndId(this.uid, this.huertoId).then(huerto => {
            this.huerto = huerto;
          });
        } else {
          this.huertosService.getHuertoById(this.huertoId).then(huerto => {
            this.huerto = huerto;
          });
        }

        return this.cultivosService.getCultivosByHuerto(uidToUse, this.huertoId);
      })
    );

    this.cultivos$.subscribe(cultivos => {
      // Guardar en array local
      this.cultivosArray = cultivos;
      
      cultivos.forEach(cultivo => {
        if (!this.plantasMap.has(cultivo.plantaId)) {
          this.plantasService.getPlantaById(cultivo.plantaId).then(planta => {
            if (planta) this.plantasMap.set(cultivo.plantaId, planta);
          });
        }
        if (cultivo.amenazaId && !this.amenazasMap.has(cultivo.amenazaId)) {
          this.amenazasService.getAmenazaById(cultivo.amenazaId).then(amenaza => {
            if (amenaza) this.amenazasMap.set(cultivo.amenazaId!, amenaza);
          });
        }
      });
    });
  }

  getPlanta(plantaId: string): Planta | undefined {
    return this.plantasMap.get(plantaId);
  }

  getAmenaza(amenazaId: string | undefined): Amenaza | undefined {
    if (!amenazaId) return undefined;
    return this.amenazasMap.get(amenazaId);
  }

  /**
   * Verifica si un cultivo tiene incompatibilidades con otros cultivos del huerto
   */
  tieneIncompatibilidades(cultivo: Cultivo): boolean {
    const plantaActual = this.getPlanta(cultivo.plantaId);
    if (!plantaActual) return false;
    
    const cultivosActivos = this.cultivosArray.filter(c => 
      c.id !== cultivo.id && 
      c.estado !== 'cosechado'
    );
    
    return cultivosActivos.some(otroCultivo => {
      const otraPlanta = this.getPlanta(otroCultivo.plantaId);
      if (!otraPlanta) return false;
      
      const incompatibleDirecta = plantaActual.incompatibilidades?.some(
        incomp => incomp.toLowerCase() === otraPlanta.nombre.toLowerCase()
      );
      const incompatibleInversa = otraPlanta.incompatibilidades?.some(
        incomp => incomp.toLowerCase() === plantaActual.nombre.toLowerCase()
      );
      
      return incompatibleDirecta || incompatibleInversa;
    });
  }

  /**
   * Obtiene las plantas incompatibles con este cultivo
   */
  getPlantasIncompatibles(cultivo: Cultivo): string[] {
    const plantaActual = this.getPlanta(cultivo.plantaId);
    if (!plantaActual) return [];
    
    const cultivosActivos = this.cultivosArray.filter(c => 
      c.id !== cultivo.id && 
      c.estado !== 'cosechado'
    );
    
    const incompatibles: string[] = [];
    
    cultivosActivos.forEach(otroCultivo => {
      const otraPlanta = this.getPlanta(otroCultivo.plantaId);
      if (!otraPlanta) return;
      
      // Verificar ambas direcciones comparando por NOMBRE
      const incompatibleDirecta = plantaActual.incompatibilidades?.some(
        incomp => incomp.toLowerCase() === otraPlanta.nombre.toLowerCase()
      );
      const incompatibleInversa = otraPlanta.incompatibilidades?.some(
        incomp => incomp.toLowerCase() === plantaActual.nombre.toLowerCase()
      );
      
      if (incompatibleDirecta || incompatibleInversa) {
        incompatibles.push(otraPlanta.nombre);
      }
    });
    
    return incompatibles;
  }

  irACrearCultivo(): void {
    if (this.esVistaAdmin && this.uid) {
      this.router.navigate(['/app/admin/usuario', this.uid, 'cultivoform', this.huertoId]);
    } else {
      this.router.navigate(['/app/cultivoform', this.huertoId]);
    }
  }

  /**
   * ==================== MODAL ELIMINAR CULTIVO ====================
   */
  abrirModalEliminarCultivo(cultivo: Cultivo): void {
    this.modalEliminarCultivo.cultivo = cultivo;
    this.modalEliminarCultivo.mostrar = true;
  }

  cerrarModalEliminarCultivo(): void {
    this.modalEliminarCultivo.mostrar = false;
    this.modalEliminarCultivo.cultivo = null;
  }

  async confirmarEliminarCultivo(): Promise<void> {
    if (!this.modalEliminarCultivo.cultivo?.id) return;
    
    const cultivoId = this.modalEliminarCultivo.cultivo.id;
    
    this.cerrarModalEliminarCultivo();
    
    try {
      const uidToUse = this.esVistaAdmin && this.uid ? this.uid : this.auth.currentUser!.uid;
      await this.cultivosService.removeCultivo(uidToUse, this.huertoId, cultivoId);
      console.log('✅ Cultivo eliminado');
    } catch (error) {
      console.error('❌ Error eliminando cultivo:', error);
      alert('Error al eliminar el cultivo');
    }
  }

  onEliminarCultivo(cultivoId: string | undefined): void {
    if (!cultivoId) return;
    
    // Buscar en array local
    const cultivo = this.cultivosArray.find(c => c.id === cultivoId);
    if (cultivo) {
      this.abrirModalEliminarCultivo(cultivo);
    }
  }

  onEditarCultivo(cultivoId: string | undefined): void {
    if (!cultivoId) return;
    
    if (this.esVistaAdmin && this.uid) {
      this.router.navigate(['/app/admin/usuario', this.uid, 'cultivoform', this.huertoId, cultivoId]);
    } else {
      this.router.navigate(['/app/cultivoform', this.huertoId, cultivoId]);
    }
  }

  volver(): void {
    if (this.esVistaAdmin && this.uid) {
      this.router.navigate(['/app/admin/usuario', this.uid]);
    } else {
      this.router.navigate(['/app/home']);
    }
  }

  /**
   * Analizar el huerto completo con IA
   */
  async analizarHuertoConIA(): Promise<void> {
    this.analizandoHuerto = true;
    this.analisisError = null;
    this.analisisResultado = null;
    this.mostrarModalAnalisis = true;

    try {
      const uidToUse = this.esVistaAdmin && this.uid ? this.uid : this.auth.currentUser!.uid;
      
      const resultado = await this.analisisService.analizarHuerto(uidToUse, this.huertoId);
      
      this.analisisResultado = resultado;
      
    } catch (error: any) {
      console.error('Error al analizar huerto:', error);
      this.analisisError = error.message || 'Error al analizar el huerto. Intenta de nuevo.';
    } finally {
      this.analizandoHuerto = false;
    }
  }

  /**
   * Cerrar el modal de análisis
   */
  cerrarModalAnalisis(): void {
    this.mostrarModalAnalisis = false;
    this.analisisResultado = null;
    this.analisisError = null;
  }

  /**
   * Ir al chat con el análisis como contexto
   */
  continuarEnChat(): void {
    if (!this.analisisResultado) return;
    
    // Crear un resumen del contexto para el chat
    const contexto = `He analizado mi huerto "${this.huerto?.nombre}" y obtuve estas recomendaciones:

${this.analisisResultado}

Tengo algunas preguntas adicionales sobre esto.`;
    
    this.router.navigate(['/app/chat-ia'], {
      queryParams: { mensaje: contexto }
    });
  }
}