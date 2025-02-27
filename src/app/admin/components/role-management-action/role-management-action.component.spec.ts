import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleManagementActionComponent } from './role-management-action.component';

describe('RoleManagementActionComponent', () => {
  let component: RoleManagementActionComponent;
  let fixture: ComponentFixture<RoleManagementActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleManagementActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleManagementActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
