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
  huerto: Huerto | null = null;
  cultivos$!: Observable<Cultivo[]>;
  plantasMap: Map<string, Planta> = new Map();
  // Mapa de amenazas
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
    this.huertoId = this.route.snapshot.paramMap.get('id')!;

    // Cargamos los datos del huerto
    this.huertosService.getHuertoById(this.huertoId).then(huerto => {
      this.huerto = huerto;
    });

    // Cargamos los cultivos
    this.cultivos$ = this.cultivosService.getCultivosByHuerto(this.huertoId);

    this.cultivos$.subscribe(cultivos => {
      cultivos.forEach(cultivo => {
        if (!this.plantasMap.has(cultivo.plantaId)) {
          this.plantasService.getPlantaById(cultivo.plantaId).then(planta => {
            if (planta) this.plantasMap.set(cultivo.plantaId, planta);
          });
        }
      });
    });

    this.cultivos$.subscribe(cultivos => {
  cultivos.forEach(cultivo => {
    // Plantas
    if (!this.plantasMap.has(cultivo.plantaId)) {
      this.plantasService.getPlantaById(cultivo.plantaId).then(planta => {
        if (planta) this.plantasMap.set(cultivo.plantaId, planta);
      });
    }
    // Amenazas
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
    this.router.navigate(['/app/cultivoform', this.huertoId]);
  }

  onEliminarCultivo(cultivoId: string): void {
    this.cultivosService.removeCultivo(this.huertoId, cultivoId);
  }
  onEditarCultivo(cultivoId: string): void {
  this.router.navigate(['/app/cultivoform', this.huertoId, cultivoId]);
}
}