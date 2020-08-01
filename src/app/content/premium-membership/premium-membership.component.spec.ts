import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumMembershipComponent } from './premium-membership.component';

describe('PremiumMembershipComponent', () => {
  let component: PremiumMembershipComponent;
  let fixture: ComponentFixture<PremiumMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
