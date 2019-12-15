import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEditarAbonoPage } from './ver-editar-abono.page';

describe('VerEditarAbonoPage', () => {
  let component: VerEditarAbonoPage;
  let fixture: ComponentFixture<VerEditarAbonoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEditarAbonoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEditarAbonoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
