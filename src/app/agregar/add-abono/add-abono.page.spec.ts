import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbonoPage } from './add-abono.page';

describe('AddAbonoPage', () => {
  let component: AddAbonoPage;
  let fixture: ComponentFixture<AddAbonoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAbonoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAbonoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
