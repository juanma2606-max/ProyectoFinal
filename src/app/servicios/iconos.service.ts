import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconosService {

  private readonly iconosPlantas: Record<string, string> = {
    'hortaliza': 'fa-solid fa-carrot',
    'fruta': 'fa-solid fa-apple-whole',
    'hierba': 'fa-solid fa-spa',
    'flor': 'fa-solid fa-flower',
    'arbol': 'fa-solid fa-tree'
  };

  private readonly coloresPlantas: Record<string, string> = {
    'hortaliza': '#28a745',
    'fruta': '#dc3545',
    'hierba': '#20c997',
    'flor': '#e83e8c',
    'arbol': '#795548'
  };

  private readonly iconosAmenazas: Record<string, string> = {
    'plaga': 'fa-solid fa-bug',
    'enfermedad': 'fa-solid fa-virus'
  };

  private readonly coloresAmenazas: Record<string, string> = {
    'plaga': '#dc3545',
    'enfermedad': '#ffc107'
  };

  constructor() { }

  getIconoPlanta(tipo: string): string {
    return this.iconosPlantas[tipo] || 'fa-solid fa-leaf';
  }

  getColorPlanta(tipo: string): string {
    return this.coloresPlantas[tipo] || '#6c757d';
  }

  getIconoAmenaza(tipo: string): string {
    return this.iconosAmenazas[tipo] || 'fa-solid fa-shield-virus';
  }

  getColorAmenaza(tipo: string): string {
    return this.coloresAmenazas[tipo] || '#6c757d';
  }
}