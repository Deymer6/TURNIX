import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProfesionales } from './gestion-profesionales';

describe('GestionProfesionales', () => {
  let component: GestionProfesionales;
  let fixture: ComponentFixture<GestionProfesionales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionProfesionales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionProfesionales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
