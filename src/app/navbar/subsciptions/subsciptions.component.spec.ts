import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsciptionsComponent } from './subsciptions.component';

describe('SubsciptionsComponent', () => {
  let component: SubsciptionsComponent;
  let fixture: ComponentFixture<SubsciptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsciptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsciptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
