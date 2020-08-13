import { TestBed } from '@angular/core/testing';

import { CommentDetailService } from './comment-detail.service';

describe('CommentDetailService', () => {
  let service: CommentDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
