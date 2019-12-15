import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPagoPage } from './add-pago.page';

describe('AddPagoPage', () => {
  let component: AddPagoPage;
  let fixture: ComponentFixture<AddPagoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPagoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
