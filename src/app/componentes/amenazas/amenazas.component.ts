import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AmenazasService } from '../../servicios/amenazas.service';
import { AuthService } from '../../servicios/auth.service';
import { Amenaza } from '../../modelos/amenaza.model';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-amenazas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './amenazas.component.html'
})
export class AmenazasComponent implements OnInit, OnDestroy {

  tipoActivo: 'plaga' | 'enfermedad' = 'plaga';
  amenazas: Amenaza[] = [];
  isAdmin$: Observable<boolean>; // ← CAMBIAR A OBSERVABLE
  private subscription?: Subscription;

  constructor(
    private service: AmenazasService,
    private authService: AuthService
  ) {
    // 🦴 Crear Observable en constructor
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

  // 🦴 Método para contar
  countByType(tipo: string): number {
    return this.amenazas.filter(a => a.tipo === tipo).length;
  }
}