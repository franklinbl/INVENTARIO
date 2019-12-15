import { TestBed } from '@angular/core/testing';

import { SqliteBDService } from './sqlite-bd.service';

describe('SqliteBDService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SqliteBDService = TestBed.get(SqliteBDService);
    expect(service).toBeTruthy();
  });
});
