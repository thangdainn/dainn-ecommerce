import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleActionComponent } from './role-action.component';

describe('RoleActionComponent', () => {
  let component: RoleActionComponent;
  let fixture: ComponentFixture<RoleActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
