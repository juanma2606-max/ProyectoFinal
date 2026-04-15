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
import { AmenazasService } from '../../../servicios/amenazas.service';
import { Amenaza } from '../../../modelos/amenaza.model';


@Component({
  selector: 'app-amenazaform',
  standalone: true,
  templateUrl: './amenazas-form.component.html',
  styleUrls: ['./amenazas-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class AmenazaformComponent implements OnInit {

  vieneDeAdmin: boolean = false;
  amenazaForm: FormGroup;

  // UGH! Imágenes por tipo (plaga, enfermedad, hongo)
  readonly imagenesPorTipo: Record<string, string> = {
    plaga:      'images/plagas/pulgon.png',
    enfermedad: 'images/enfermedades/mildiu.png',
    hongo:      'images/hongos/oidio.png'
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
      tratamiento: ['', [Validators.required, Validators.maxLength(500)]], // Obligatorio según modelo
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

      // Limpiar sintomas existentes
      this.sintomas.clear();

      // Añadir síntomas de la amenaza cargada
      (amenaza.sintomas ?? []).forEach(s => {
        this.sintomas.push(this.formBuilder.control(s, Validators.required));
      });

      // Llenar formulario
      this.amenazaForm.patchValue({
        nombre:      amenaza.nombre,
        descripcion: amenaza.descripcion,
        tipo:        amenaza.tipo,
        tratamiento: amenaza.tratamiento
      });
    });
  }

  onSubmit(): void {
    if (this.amenazaForm.invalid) {
      this.amenazaForm.markAllAsTouched();
      return;
    }

    const { nombre, descripcion, tipo, tratamiento, sintomas } = this.amenazaForm.value;
    const imagen = this.imagenesPorTipo[tipo] || 'images/default-amenaza.png';
    const id = this.route.snapshot.paramMap.get('id');

    // Filtrar síntomas vacíos
    const sintomasLimpios = sintomas.filter((s: string) => s.trim() !== '');

    if (id) {
      // UGH! Actualizar amenaza existente
      const amenazaEditada = new Amenaza(
        nombre,
        descripcion,
        tipo,
        imagen,
        sintomasLimpios,
        tratamiento,
        id
      );

      this.amenazasService.updateAmenaza(amenazaEditada)
        .then(() => this.navegarDeVuelta())
        .catch(error => {
          console.error('Error actualizando amenaza:', error);
          alert('Error al actualizar la amenaza. Inténtalo de nuevo.');
        });
    } else {
      // UGH! Crear nueva amenaza
      const nuevaAmenaza = new Amenaza(
        nombre,
        descripcion,
        tipo,
        imagen,
        sintomasLimpios,
        tratamiento
      );

      this.amenazasService.createAmenaza(nuevaAmenaza)
        .then(() => this.navegarDeVuelta())
        .catch(error => {
          console.error('Error creando amenaza:', error);
          alert('Error al crear la amenaza. Inténtalo de nuevo.');
        });
    }
  }

  public navegarDeVuelta(): void {
    if (this.vieneDeAdmin) {
      this.router.navigate(['/app/admin']);
    } else {
      this.router.navigate(['/app/amenazas']);
    }
  }
}