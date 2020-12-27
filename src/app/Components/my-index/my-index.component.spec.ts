import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIndexComponent } from './my-index.component';

describe('MyIndexComponent', () => {
  let component: MyIndexComponent;
  let fixture: ComponentFixture<MyIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
