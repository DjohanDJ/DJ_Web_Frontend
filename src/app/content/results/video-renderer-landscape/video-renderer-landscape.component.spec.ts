import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRendererLandscapeComponent } from './video-renderer-landscape.component';

describe('VideoRendererLandscapeComponent', () => {
  let component: VideoRendererLandscapeComponent;
  let fixture: ComponentFixture<VideoRendererLandscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoRendererLandscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoRendererLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
