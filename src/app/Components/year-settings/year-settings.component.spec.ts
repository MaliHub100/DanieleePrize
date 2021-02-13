import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearSettingsComponent } from './year-settings.component';

describe('YearSettingsComponent', () => {
  let component: YearSettingsComponent;
  let fixture: ComponentFixture<YearSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
