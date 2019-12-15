import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEditarProductoPage } from './ver-editar-producto.page';

describe('VerEditarProductoPage', () => {
  let component: VerEditarProductoPage;
  let fixture: ComponentFixture<VerEditarProductoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEditarProductoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEditarProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
