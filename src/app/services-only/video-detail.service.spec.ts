import { TestBed } from '@angular/core/testing';

import { VideoDetailService } from './video-detail.service';

describe('VideoDetailService', () => {
  let service: VideoDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
