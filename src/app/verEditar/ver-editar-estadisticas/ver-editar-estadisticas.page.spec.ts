import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEditarEstadisticasPage } from './ver-editar-estadisticas.page';

describe('VerEditarEstadisticasPage', () => {
  let component: VerEditarEstadisticasPage;
  let fixture: ComponentFixture<VerEditarEstadisticasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEditarEstadisticasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEditarEstadisticasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
