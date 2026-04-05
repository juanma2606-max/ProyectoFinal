import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AmenazasService } from '../../servicios/amenazas.service';
import { Amenaza } from '../../modelos/amenaza.model';

@Component({
  selector: 'app-amenazaform',
  templateUrl: './amenazas-form.component.html',
  styleUrls: ['./amenazas-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class AmenazaformComponent implements OnInit {

  vieneDeAdmin: boolean = false;

  amenazaForm: FormGroup;

  readonly imagenesPorTipo: Record<string, string> = {
    plaga:      'images/plagas/pulgon.png',
    enfermedad: 'images/enfermedades/mildiu.png'
  };

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private amenazasService: AmenazasService,
    private router: Router
  ) {
    this.amenazaForm = this.formBuilder.group({
      nombre:      ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      tipo:        ['', [Validators.required]],
      tratamiento: ['', Validators.maxLength(500)],
      sintomas:    this.formBuilder.array([])
    });
  }

  get sintomas(): FormArray {
    return this.amenazaForm.get('sintomas') as FormArray;
  }

  addSintoma(): void {
    this.sintomas.push(this.formBuilder.control('', Validators.required));
  }

  removeSintoma(index: number): void {
    this.sintomas.removeAt(index);
  }

  ngOnInit(): void {
    // Leer queryParam de forma reactiva
    this.route.queryParamMap.subscribe(queryParams => {
      this.vieneDeAdmin = queryParams.get('from') === 'admin';
    });

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id) return;

      const amenaza = await this.amenazasService.getAmenazaById(id);
      if (!amenaza) return;

      (amenaza.sintomas ?? []).forEach(s => {
        this.sintomas.push(this.formBuilder.control(s, Validators.required));
      });

      this.amenazaForm.setValue({
        nombre:      amenaza.nombre,
        descripcion: amenaza.descripcion,
        tipo:        amenaza.tipo,
        tratamiento: amenaza.tratamiento ?? '',
        sintomas:    amenaza.sintomas ?? []
      });
    });
  }

  onSubmit(): void {
    if (this.amenazaForm.invalid) {
      this.amenazaForm.markAllAsTouched();
      return;
    }

    const { nombre, descripcion, tipo, tratamiento, sintomas } = this.amenazaForm.value;
    const imagen = this.imagenesPorTipo[tipo];
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const amenazaEditada: Amenaza = {
        id, nombre, descripcion, tipo, imagen,
        sintomas: sintomas.filter((s: string) => s.trim() !== ''),
        tratamiento: tratamiento || undefined,
      };
      this.amenazasService.updateAmenaza(amenazaEditada)
        .then(() => this.vieneDeAdmin
          ? this.router.navigate(['/app/admin'])
          : this.router.navigate(['/app/amenazas']))
        .catch(error => alert(error.message));
    } else {
      const nuevaAmenaza: Omit<Amenaza, 'id'> = {
        nombre, descripcion, tipo, imagen,
        sintomas: sintomas.filter((s: string) => s.trim() !== ''),
        tratamiento: tratamiento || undefined,
      };
      this.amenazasService.createAmenaza(nuevaAmenaza)
        .then(() => this.vieneDeAdmin
          ? this.router.navigate(['/app/admin'])
          : this.router.navigate(['/app/amenazas']))
        .catch(error => alert(error.message));
    }
  }
}