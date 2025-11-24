import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionServiciosComponent } from './gestion-servicios';
import { ApiService } from '../../../services/api';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor

describe('GestionServiciosComponent', () => {
  let component: GestionServiciosComponent;
  let fixture: ComponentFixture<GestionServiciosComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockActivatedRoute: any;

  const mockServicios = [
    { id: 1, nombreServicio: 'Corte de Pelo', duracionEstimada: 30, precio: 25.00 },
    { id: 2, nombreServicio: 'Tinte de Cabello', duracionEstimada: 90, precio: 75.00 },
  ];

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getServiciosByNegocio']);
    mockActivatedRoute = {
      paramMap: of(convertToParamMap({ negocioId: '123' }))
    };

    await TestBed.configureTestingModule({
      imports: [GestionServiciosComponent, CommonModule], // Import CommonModule here
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionServiciosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set negocioId from route params and load servicios on ngOnInit', () => {
    mockApiService.getServiciosByNegocio.and.returnValue(of(mockServicios));
    fixture.detectChanges(); // Calls ngOnInit

    expect(component.negocioId).toBe(123);
    expect(mockApiService.getServiciosByNegocio).toHaveBeenCalledWith(123);
    expect(component.servicios).toEqual(mockServicios);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading servicios fails', () => {
    const errorMessage = 'Error al cargar los servicios. Por favor, inténtelo de nuevo más tarde.';
    mockApiService.getServiciosByNegocio.and.returnValue(throwError(() => new Error('API Error')));
    fixture.detectChanges(); // Calls ngOnInit

    expect(component.negocioId).toBe(123);
    expect(mockApiService.getServiciosByNegocio).toHaveBeenCalledWith(123);
    expect(component.servicios).toEqual([]);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe(errorMessage);
  });

  it('should set error if negocioId is not provided in route params', () => {
    mockActivatedRoute.paramMap = of(convertToParamMap({})); // Simulate no negocioId
    // Recreate component to pick up new mockActivatedRoute
    fixture = TestBed.createComponent(GestionServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Calls ngOnInit

    expect(component.negocioId).toBeNull();
    expect(mockApiService.getServiciosByNegocio).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBe('No se proporcionó un ID de negocio.');
  });

  it('should not call loadServicios if negocioId is null', () => {
    component.negocioId = null; // Manually set negocioId to null
    component.loadServicios(); // Call loadServicios directly

    expect(mockApiService.getServiciosByNegocio).not.toHaveBeenCalled();
    expect(component.error).toBe('No se puede cargar servicios sin un ID de negocio.');
    expect(component.isLoading).toBeFalse();
  });
});
