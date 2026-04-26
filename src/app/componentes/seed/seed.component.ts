import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantasService } from '../../servicios/plantas.service';
import { AmenazasService } from '../../servicios/amenazas.service';
import { PLANTAS_SEED, AMENAZAS_SEED } from '../../scripts/seed-data';

@Component({
  selector: 'app-seed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          
          <h2 class="text-center mb-4">
            <i class="fa-solid fa-database me-2"></i>Importar Datos
          </h2>

          <div class="alert alert-warning">
            <i class="fa-solid fa-triangle-exclamation me-2"></i>
            <strong>Atención:</strong> Esta herramienta es solo para desarrollo. 
            Elimina la ruta después de usar.
          </div>

          <!-- Plantas -->
          <div class="card mb-4 shadow">
            <div class="card-body">
              <h5 class="card-title">
                <i class="fa-solid fa-leaf text-success me-2"></i>Plantas
              </h5>
              <p class="card-text">
                {{ PLANTAS_SEED.length }} plantas listas para importar
              </p>
              
              <button 
                class="btn btn-success w-100"
                (click)="importarPlantas()"
                [disabled]="importandoPlantas">
                <i class="fa-solid me-2" 
                   [class.fa-spinner]="importandoPlantas"
                   [class.fa-spin]="importandoPlantas"
                   [class.fa-download]="!importandoPlantas"></i>
                {{ importandoPlantas ? 'Importando...' : 'Importar Plantas' }}
              </button>
              
              <div *ngIf="plantasImportadas > 0" 
                   class="alert alert-success mt-3 mb-0">
                <i class="fa-solid fa-check-circle me-2"></i>
                {{ plantasImportadas }} de {{ PLANTAS_SEED.length }} plantas importadas
              </div>

              <div *ngIf="errorPlantas" 
                   class="alert alert-danger mt-3 mb-0">
                <i class="fa-solid fa-exclamation-circle me-2"></i>
                {{ errorPlantas }}
              </div>
            </div>
          </div>

          <!-- Amenazas -->
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title">
                <i class="fa-solid fa-bug text-danger me-2"></i>Amenazas
              </h5>
              <p class="card-text">
                {{ AMENAZAS_SEED.length }} amenazas listas para importar
              </p>
              
              <button 
                class="btn btn-danger w-100"
                (click)="importarAmenazas()"
                [disabled]="importandoAmenazas">
                <i class="fa-solid me-2" 
                   [class.fa-spinner]="importandoAmenazas"
                   [class.fa-spin]="importandoAmenazas"
                   [class.fa-download]="!importandoAmenazas"></i>
                {{ importandoAmenazas ? 'Importando...' : 'Importar Amenazas' }}
              </button>
              
              <div *ngIf="amenazasImportadas > 0" 
                   class="alert alert-success mt-3 mb-0">
                <i class="fa-solid fa-check-circle me-2"></i>
                {{ amenazasImportadas }} de {{ AMENAZAS_SEED.length }} amenazas importadas
              </div>

              <div *ngIf="errorAmenazas" 
                   class="alert alert-danger mt-3 mb-0">
                <i class="fa-solid fa-exclamation-circle me-2"></i>
                {{ errorAmenazas }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .fa-spin {
      animation: fa-spin 1s infinite linear;
    }
    @keyframes fa-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SeedComponent {
  PLANTAS_SEED = PLANTAS_SEED;
  AMENAZAS_SEED = AMENAZAS_SEED;
  
  importandoPlantas = false;
  importandoAmenazas = false;
  plantasImportadas = 0;
  amenazasImportadas = 0;
  errorPlantas: string | null = null;
  errorAmenazas: string | null = null;

  constructor(
    private plantasService: PlantasService,
    private amenazasService: AmenazasService
  ) {}

  async importarPlantas(): Promise<void> {
    this.importandoPlantas = true;
    this.plantasImportadas = 0;
    this.errorPlantas = null;

    try {
      for (const planta of PLANTAS_SEED) {
        await this.plantasService.createPlanta(planta);
        this.plantasImportadas++;
        console.log(`✅ Importada: ${planta.nombre}`);
      }
      console.log('🎉 Importación de plantas completada');
    } catch (error) {
      console.error('❌ Error importando plantas:', error);
      this.errorPlantas = 'Error al importar plantas. Ver consola.';
    } finally {
      this.importandoPlantas = false;
    }
  }

  async importarAmenazas(): Promise<void> {
    this.importandoAmenazas = true;
    this.amenazasImportadas = 0;
    this.errorAmenazas = null;

    try {
      for (const amenaza of AMENAZAS_SEED) {
        await this.amenazasService.createAmenaza(amenaza);
        this.amenazasImportadas++;
        console.log(`✅ Importada: ${amenaza.nombre}`);
      }
      console.log('🎉 Importación de amenazas completada');
    } catch (error) {
      console.error('❌ Error importando amenazas:', error);
      this.errorAmenazas = 'Error al importar amenazas. Ver consola.';
    } finally {
      this.importandoAmenazas = false;
    }
  }
}