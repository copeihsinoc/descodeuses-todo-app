import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistrerComponent } from './enregistrer.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

describe('EnregistrerComponent', () => {
  let component: EnregistrerComponent;
  let fixture: ComponentFixture<EnregistrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnregistrerComponent],
      imports:[
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnregistrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formulaire invalide si firstName vade', ()=>{
    component.signUpForm.controls['firstName'].setValue('');
    expect(component.signUpForm.valid).toBeFalse();
  })
});
