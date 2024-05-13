import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CristianHomeComponent } from './cristian-home.component';

describe('CristianHomeComponent', () => {
  let component: CristianHomeComponent;
  let fixture: ComponentFixture<CristianHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CristianHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CristianHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
