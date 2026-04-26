import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable, switchMap, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { HuertosService } from '../../../servicios/huertos.service';
import { HomeResumeComponent } from '../home-resume/home-resume.component';
import { Modal } from 'bootstrap';
import { Huerto } from '../../../modelos/huerto.model';

@Component({
  selector: 'app-home-list',
  standalone: true,
  imports: [CommonModule, HomeResumeComponent],
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.scss'
})
export class HomeListComponent implements OnInit, OnDestroy {

  huertos$!: Observable<Huerto[]>;
  huertoAEliminar: Huerto | null = null;
  private modalInstance: Modal | null = null;

  @ViewChild('deleteModal') deleteModal!: ElementRef;

  constructor(
    private huertoService: HuertosService,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    // Esperamos a que Firebase confirme el usuario antes de cargar huertos
    this.huertos$ = authState(this.auth).pipe(
      switchMap(user => {
        if (!user) return of([]);
        return this.huertoService.getAllHuertosFirebase();
      })
    );
  }

  onEditHuerto(huerto: Huerto): void {
    this.router.navigate(['/app/huertoform', huerto.id]);
  }

  irACrear(): void {
    this.router.navigate(['/app/huertoform']);
  }

  onDeleteHuerto(huerto: Huerto): void {
    this.huertoAEliminar = huerto;
    
    // UGH! Destruir modal viejo si existir
    if (this.modalInstance) {
      this.modalInstance.dispose();
      this.modalInstance = null;
    }
    
    // UGH! Crear nuevo modal
    this.modalInstance = new Modal(this.deleteModal.nativeElement);
    this.modalInstance.show();
  }

  confirmarEliminacion(): void {
    if (!this.huertoAEliminar || !this.huertoAEliminar.id) {
      this.cerrarModal();
      return;
    }

    // UGH! Primero cerrar modal
    this.cerrarModal();

    // UGH! DESPUÉS eliminar huerto
    this.huertoService.removeObject(this.huertoAEliminar.id)
      .then(() => {
        console.log('✅ Huerto eliminado correctamente');
        this.huertoAEliminar = null;
      })
      .catch(error => {
        console.error('❌ Error al eliminar huerto:', error);
      });
  }

  cerrarModal(): void {
    // UGH! Cerrar modal si existir
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance.dispose(); // ← Destruir completamente
      this.modalInstance = null;
    }

    // UGH! Limpiar TODO backdrop y estilos
    setTimeout(() => {
      // Eliminar TODOS los backdrops (puede haber varios)
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => {
        backdrop.remove();
      });
      
      // Restaurar body a estado normal
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      
      console.log('🧹 Modal limpiado completamente');
    }, 150); // UGH! Más tiempo para asegurar limpieza
  }

  ngOnDestroy(): void {
    // Limpiar al destruir el componente
    this.cerrarModal();
  }
}