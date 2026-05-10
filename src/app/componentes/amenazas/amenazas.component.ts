import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AmenazasService } from '../../servicios/amenazas.service';
import { AuthService } from '../../servicios/auth.service';
import { Amenaza } from '../../modelos/amenaza.model';
import { ImagenAmenazaComponent } from '../imagen-amenaza/imagen-amenaza.component';  // IMPORTAR
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-amenazas',
  standalone: true,
  imports: [CommonModule, RouterModule, ImagenAmenazaComponent],  // AGREGAR
  templateUrl: './amenazas.component.html'
})
export class AmenazasComponent implements OnInit, OnDestroy {

  tipoActivo: 'plaga' | 'enfermedad' = 'plaga';
  amenazas: Amenaza[] = [];
  isAdmin$: Observable<boolean>;
  private subscription?: Subscription;

  constructor(
    private service: AmenazasService,
    private authService: AuthService
  ) {
    this.isAdmin$ = this.authService.isAdmin$();
  }

  ngOnInit(): void {
    this.subscription = this.service.getAllAmenazasFirebase().subscribe(data => {
      this.amenazas = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get amenazasFiltradas(): Amenaza[] {
    return this.amenazas.filter(a => a.tipo === this.tipoActivo);
  }

  cambiarTipo(tipo: 'plaga' | 'enfermedad'): void {
    this.tipoActivo = tipo;
  }

  countByType(tipo: string): number {
    return this.amenazas.filter(a => a.tipo === tipo).length;
  }
}