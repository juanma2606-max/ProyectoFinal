import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="acceso-denegado-container d-flex align-items-center justify-content-center min-vh-100">
      <div class="text-center">
        
        <!-- Icono animado -->
        <div class="mb-4">
          <i class="fa-solid fa-shield-halved text-danger" style="font-size: 120px; animation: shake 0.5s infinite;"></i>
        </div>

        <!-- Título -->
        <h1 class="text-light fw-bold mb-3">
          <i class="fa-solid fa-ban text-danger me-2"></i>
          Acceso Denegado
        </h1>

        <!-- Mensaje -->
        <p class="text-light opacity-75 mb-4 px-3" style="max-width: 500px; margin: 0 auto;">
          No tienes permisos para acceder a esta sección. 
          Solo los administradores pueden ver este contenido.
        </p>

        <!-- Botones -->
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <button 
            class="btn btn-success px-4"
            (click)="volverHome()">
            <i class="fa-solid fa-home me-2"></i>
            Volver al inicio
          </button>
          
          <button 
            class="btn btn-outline-light px-4"
            (click)="volverAtras()">
            <i class="fa-solid fa-arrow-left me-2"></i>
            Ir atrás
          </button>
        </div>

        <!-- Contador de redirección automática -->
        <p class="text-light opacity-50 small mt-4">
          <i class="fa-solid fa-clock me-1"></i>
          Serás redirigido automáticamente en {{ countdown }} segundos...
        </p>

      </div>
    </div>
  `,
  styles: [`
    .acceso-denegado-container {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      position: relative;
      overflow: hidden;
    }

    .acceso-denegado-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(220, 53, 69, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(220, 53, 69, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    @keyframes shake {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }

    .btn {
      transition: all 0.3s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
  `]
})
export class AccesoDenegadoComponent implements OnInit {
  
  countdown: number = 5;
  private intervalId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Iniciar contador regresivo
    this.intervalId = setInterval(() => {
      this.countdown--;
      
      if (this.countdown <= 0) {
        this.volverHome();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    // Limpiar intervalo al destruir componente
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  volverHome(): void {
    this.router.navigate(['/app/home']);
  }

  volverAtras(): void {
    window.history.back();
  }
}