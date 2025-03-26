import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { restrictAdminGuard } from './restrict-admin.guard';

describe('restrictAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => restrictAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
