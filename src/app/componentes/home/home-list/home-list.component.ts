// huerto-list.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Huerto } from '../../../modelos/huerto.model';
import { HuertosService } from '../../../servicios/huertos.service';
import { HomeResumeComponent } from '../home-resume/home-resume.component';
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-home-list',
  standalone: true,
  imports: [CommonModule, HomeResumeComponent],
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.scss'
})
export class HomeListComponent implements OnInit {
  
  huertos$!: Observable<Huerto[]>;
  huertoAEliminar: Huerto | null = null;

  @ViewChild('deleteModal') deleteModal!: ElementRef;

  constructor(
    private huertoService: HuertosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.huertos$ = this.huertoService.getAllHuertosFirebase();
  }

onEditHuerto(huerto: Huerto): void {
  this.router.navigate(['/app/huertoform', huerto.id]);
}

  irACrear(): void {
  this.router.navigate(['/app/huertoform']);
}
onDeleteHuerto(huerto: Huerto): void {
  this.huertoAEliminar = huerto;
  const modal = new Modal(this.deleteModal.nativeElement);
  modal.show();
}

confirmarEliminacion(): void {
  if (!this.huertoAEliminar) return;

  const modalInstance = Modal.getInstance(this.deleteModal.nativeElement);

  // 1. Escuchar cuando el modal termine de cerrarse
  this.deleteModal.nativeElement.addEventListener('hidden.bs.modal', () => {
    // 2. Limpiar el backdrop manualmente por si acaso
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }, { once: true }); // { once: true } para que solo se ejecute una vez

  // 3. Eliminar y cerrar
  this.huertoService.removeObject(this.huertoAEliminar.id)
    .then(() => {
      this.huertoAEliminar = null;
      modalInstance?.hide();
    })
    .catch(error => console.error('Error al eliminar:', error));
}
}