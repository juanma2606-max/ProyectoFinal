import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Planta } from '../../modelos/planta.model';
import { PlantasService } from '../../servicios/plantas.service';
import { CultivosService } from '../../servicios/cultivos.service';
import { Cultivo } from '../../modelos/modelos.model';

@Component({
  selector: 'app-cultivo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cultivo-form.component.html',
  styleUrl: './cultivo-form.component.scss'
})
export class CultivoFormComponent implements OnInit {

  huertoId!: string;
  plantas$!: Observable<Planta[]>;

  plantaIdSeleccionada: string = '';
  notas: string = '';
  guardando: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plantasService: PlantasService,
    private cultivosService: CultivosService
  ) {}

  ngOnInit(): void {
    this.huertoId = this.route.snapshot.paramMap.get('huertoId')!;
    this.plantas$ = this.plantasService.getAllPlantasFirebase();
  }

  async guardarCultivo(): Promise<void> {
    if (!this.plantaIdSeleccionada) {
      this.error = 'Debes seleccionar una planta.';
      return;
    }

    this.guardando = true;
    this.error = '';

    const nuevoCultivo: Omit<Cultivo, 'id'> = {
      plantaId: this.plantaIdSeleccionada,
      estado: 'creciendo',
      fechaSiembra: new Date().toISOString(),
      notas: this.notas.trim()
    };

    try {
      await this.cultivosService.createCultivo(this.huertoId, nuevoCultivo);
      this.router.navigate(['/app/huerto', this.huertoId]);
    } catch (e) {
      this.error = 'Error al guardar el cultivo. Inténtalo de nuevo.';
      this.guardando = false;
    }
  }

  cancelar(): void {
    this.router.navigate(['/app/huerto', this.huertoId]);
  }
}