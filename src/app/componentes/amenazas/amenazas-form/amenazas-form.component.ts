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
      imagen:      ['', [Validators.maxLength(1000)]],
      tratamiento: ['', [Validators.maxLength(500)]],
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
    this.route.queryParamMap.subscribe(queryParams => {
      this.vieneDeAdmin = queryParams.get('from') === 'admin';
    });

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id) return;

      const amenaza = await this.amenazasService.getAmenazaById(id);
      if (!amenaza) return;

      this.sintomas.clear();

      (amenaza.sintomas ?? []).forEach(s => {
        this.sintomas.push(this.formBuilder.control(s, Validators.required));
      });

      this.amenazaForm.patchValue({
        nombre:      amenaza.nombre,
        descripcion: amenaza.descripcion,
        tipo:        amenaza.tipo,
        imagen:      amenaza.imagen || '',
        tratamiento: amenaza.tratamiento || ''
      });
    });
  }

  async onSubmit(): Promise<void> {
    if (this.amenazaForm.invalid) {
      this.amenazaForm.markAllAsTouched();
      return;
    }

    const formValue = this.amenazaForm.value;

    const amenazaData: any = {
      nombre:      formValue.nombre.trim(),
      descripcion: formValue.descripcion.trim(),
      tipo:        formValue.tipo,
      imagen:      formValue.imagen?.trim() || '',
      sintomas:    (formValue.sintomas as string[]).filter((s: string) => s.trim() !== '')
    };

    const tratamiento = formValue.tratamiento?.trim();
    if (tratamiento) {
      amenazaData.tratamiento = tratamiento;
    }

    Object.keys(amenazaData).forEach(key => {
      if (amenazaData[key] === undefined) {
        delete amenazaData[key];
      }
    });

    const id = this.route.snapshot.paramMap.get('id');

    try {
      if (id) {
        await this.amenazasService.updateAmenaza({ id, ...amenazaData });
      } else {
        await this.amenazasService.createAmenaza(amenazaData);
      }
      
      await this.router.navigate(
        this.vieneDeAdmin ? ['/app/admin'] : ['/app/amenazas']
      );
    } catch (error: any) {
      console.error('Error guardando amenaza:', error);
      alert('Error al guardar: ' + error.message);
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