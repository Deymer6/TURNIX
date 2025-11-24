import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaNegocios } from './lista-negocios';

describe('ListaNegocios', () => {
  let component: ListaNegocios;
  let fixture: ComponentFixture<ListaNegocios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaNegocios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaNegocios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
