import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeManagementComponent } from './size-management.component';

describe('SizeManagementComponent', () => {
  let component: SizeManagementComponent;
  let fixture: ComponentFixture<SizeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SizeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
