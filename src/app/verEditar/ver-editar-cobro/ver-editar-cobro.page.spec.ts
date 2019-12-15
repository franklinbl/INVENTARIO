import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEditarCobroPage } from './ver-editar-cobro.page';

describe('VerEditarCobroPage', () => {
  let component: VerEditarCobroPage;
  let fixture: ComponentFixture<VerEditarCobroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEditarCobroPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEditarCobroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
