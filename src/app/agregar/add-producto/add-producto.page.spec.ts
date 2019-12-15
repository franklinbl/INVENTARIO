import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductoPage } from './add-producto.page';

describe('AddProductoPage', () => {
  let component: AddProductoPage;
  let fixture: ComponentFixture<AddProductoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
