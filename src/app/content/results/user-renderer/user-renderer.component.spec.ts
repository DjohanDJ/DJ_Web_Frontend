import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRendererComponent } from './user-renderer.component';

describe('UserRendererComponent', () => {
  let component: UserRendererComponent;
  let fixture: ComponentFixture<UserRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
