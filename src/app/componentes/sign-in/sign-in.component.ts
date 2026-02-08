import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { PersonService } from '../../servicios/person.service';
import { UserCredential } from '@angular/fire/auth';
import { Person } from '../../modelos/person.model';
import { matchPasswordValidator } from '../../Validations/signin.validator';
import { restrictedWordsValidator } from '../../Validations/login.validator';


//signin.component.ts

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
//signin.component.ts

export class SignInComponent {
registerForm:FormGroup;

constructor (formBuilder:FormBuilder, private authService:AuthService, private router:Router,private personService: PersonService){
  //signin.component.ts
//signin.component.ts
  
  this.registerForm = formBuilder.group({
    'username': ['', [Validators.required,Validators.minLength(5),restrictedWordsValidator(['admin','superadmin'])]],
    'email': ['', [Validators.required,Validators.email]],
    'password': ['', [Validators.required]],
    'confirmPassword': ['', [Validators.required,matchPasswordValidator]]
  }
  );
  }

  onSubmit(){
     console.log(this.registerForm);
  console.log(this.registerForm.errors);
  console.log(this.registerForm.status);
    // Comprobamos que el formulario sea válido
    if(this.registerForm.valid){
      let username = this.registerForm.get("username")?.value;
      let email = this.registerForm.get("email")?.value;
      let password = this.registerForm.get("password")?.value;
      //Operamos con los datos obtenidos
      //Operamos con los datos obtenidos
      this.authService.register(email, password).then(async (user: UserCredential) => {
          const newPerson = new Person(
            user.user.uid,
            username,
            email
          );
          await this.personService.createPerson(newPerson);
        //TODO: Guardar en Firebase Realtime Database los datos del usuario (username, firstname, ...)
        this.router.navigate(['/app'])
      }).catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            console.log("El correo ya está en uso");
          } else {
            console.log(error);
          }
      });
    }
  }

}
