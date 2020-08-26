import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistRendererComponent } from './playlist-renderer.component';

describe('PlaylistRendererComponent', () => {
  let component: PlaylistRendererComponent;
  let fixture: ComponentFixture<PlaylistRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
