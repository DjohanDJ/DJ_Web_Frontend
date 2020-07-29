import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictioningComponent } from './restrictioning.component';

describe('RestrictioningComponent', () => {
  let component: RestrictioningComponent;
  let fixture: ComponentFixture<RestrictioningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestrictioningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictioningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
