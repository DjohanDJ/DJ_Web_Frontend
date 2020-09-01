import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostChannelComponent } from './post-channel.component';

describe('PostChannelComponent', () => {
  let component: PostChannelComponent;
  let fixture: ComponentFixture<PostChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
