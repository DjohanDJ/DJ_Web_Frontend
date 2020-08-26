import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistRendererLandscapeComponent } from './playlist-renderer-landscape.component';

describe('PlaylistRendererLandscapeComponent', () => {
  let component: PlaylistRendererLandscapeComponent;
  let fixture: ComponentFixture<PlaylistRendererLandscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistRendererLandscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistRendererLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
