import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCobroPage } from './add-cobro.page';

describe('AddCobroPage', () => {
  let component: AddCobroPage;
  let fixture: ComponentFixture<AddCobroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCobroPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCobroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
