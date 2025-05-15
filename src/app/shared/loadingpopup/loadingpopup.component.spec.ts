import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingpopupComponent } from './loadingpopup.component';

describe('LoadingpopupComponent', () => {
  let component: LoadingpopupComponent;
  let fixture: ComponentFixture<LoadingpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
