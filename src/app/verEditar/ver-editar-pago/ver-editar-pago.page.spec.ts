import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEditarPagoPage } from './ver-editar-pago.page';

describe('VerEditarPagoPage', () => {
  let component: VerEditarPagoPage;
  let fixture: ComponentFixture<VerEditarPagoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEditarPagoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEditarPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
