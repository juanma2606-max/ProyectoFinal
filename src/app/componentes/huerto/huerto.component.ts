import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Planta } from '../../modelos/planta.model';
import { Huerto } from '../../modelos/huerto.model';
import { CultivosService } from '../../servicios/cultivos.service';
import { PlantasService } from '../../servicios/plantas.service';
import { HuertosService } from '../../servicios/huertos.service';
import { Cultivo } from '../../modelos/cultivo.model';
import { Amenaza } from '../../modelos/amenaza.model';
import { AmenazasService } from '../../servicios/amenazas.service';

@Component({
  selector: 'app-huerto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './huerto.component.html',
  styleUrl: './huerto.component.scss'
})
export class HuertoComponent implements OnInit {

  huertoId!: string;
  uid: string | null = null;       // uid del usuario visto por el admin
  esVistaAdmin: boolean = false;   // true si viene desde la ruta del admin
  huerto: Huerto | null = null;
  cultivos$!: Observable<Cultivo[]>;
  plantasMap: Map<string, Planta> = new Map();
  amenazasMap: Map<string, Amenaza> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cultivosService: CultivosService,
    private plantasService: PlantasService,
    private huertosService: HuertosService,
    private amenazasService: AmenazasService
  ) {}

  ngOnInit(): void {
    this.huertoId = this.route.snapshot.paramMap.get('huertoId')
                 ?? this.route.snapshot.paramMap.get('id')!;

    // Detectamos si viene desde la ruta del admin
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.esVistaAdmin = !!this.uid;

    // Cargamos el huerto según si es admin o usuario normal
    if (this.esVistaAdmin && this.uid) {
      this.huertosService.getHuertoByUidAndId(this.uid, this.huertoId).then(huerto => {
        this.huerto = huerto;
      });
      this.cultivos$ = this.cultivosService.getCultivosByUidAndHuerto(this.uid, this.huertoId);
    } else {
      this.huertosService.getHuertoById(this.huertoId).then(huerto => {
        this.huerto = huerto;
      });
      this.cultivos$ = this.cultivosService.getCultivosByHuerto(this.huertoId);
    }

    // Cargamos plantas y amenazas
    this.cultivos$.subscribe(cultivos => {
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

irACrearCultivo(): void {
  if (this.esVistaAdmin && this.uid) {
    this.router.navigate(['/app/admin/usuario', this.uid, 'cultivoform', this.huertoId]);
  } else {
    this.router.navigate(['/app/cultivoform', this.huertoId]);
  }
}

onEliminarCultivo(cultivoId: string): void {
  if (this.esVistaAdmin && this.uid) {
    this.cultivosService.removeCultivoByUid(this.uid, this.huertoId, cultivoId);
  } else {
    this.cultivosService.removeCultivo(this.huertoId, cultivoId);
  }
}

onEditarCultivo(cultivoId: string): void {
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
}