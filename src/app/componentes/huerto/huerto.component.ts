import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { CultivosService } from '../../servicios/cultivos.service';
import { PlantasService } from '../../servicios/plantas.service';
import { HuertosService } from '../../servicios/huertos.service';
import { AmenazasService } from '../../servicios/amenazas.service';
import { Cultivo } from '../../modelos/cultivo.model';
import { Planta } from '../../modelos/planta.model';
import { Huerto } from '../../modelos/huerto.model';
import { Amenaza } from '../../modelos/amenaza.model';

@Component({
  selector: 'app-huerto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './huerto.component.html',
  styleUrl: './huerto.component.scss'
})
export class HuertoComponent implements OnInit {

  huertoId!: string;
  uid: string | null = null;
  esVistaAdmin: boolean = false;
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
    private amenazasService: AmenazasService,
    private auth: Auth
  ) {}

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

  onEliminarCultivo(cultivoId: string | undefined): void {
    if (!cultivoId) return;
    
    const uidToUse = this.esVistaAdmin && this.uid ? this.uid : this.auth.currentUser!.uid;
    this.cultivosService.removeCultivo(uidToUse, this.huertoId, cultivoId);
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
}