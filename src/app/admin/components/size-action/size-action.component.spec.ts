import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeActionComponent } from './size-action.component';

describe('SizeActionComponent', () => {
  let component: SizeActionComponent;
  let fixture: ComponentFixture<SizeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeActionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SizeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
