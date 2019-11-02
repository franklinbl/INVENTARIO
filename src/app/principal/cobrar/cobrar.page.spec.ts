import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobrarPage } from './cobrar.page';

describe('CobrarPage', () => {
  let component: CobrarPage;
  let fixture: ComponentFixture<CobrarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobrarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
