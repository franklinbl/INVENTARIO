import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVentaPage } from './add-venta.page';

describe('AddVentaPage', () => {
  let component: AddVentaPage;
  let fixture: ComponentFixture<AddVentaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVentaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
