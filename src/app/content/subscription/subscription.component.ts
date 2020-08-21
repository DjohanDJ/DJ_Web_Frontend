import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/services-only/user-session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';

export const getAllSubscriber = gql`
  query getSubscribers {
    subscribers {
      id
      channel_id
      user_id
    }
  }
`;

export const searchUserById = gql`
  query getUsers {
    users {
      id
      username
      channel_name
      user_image
      channel_banner
      restriction
      location
    }
  }
`;

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  constructor(
    public userSession: UserSessionService,
    private apollo: Apollo,
    private videoService: VideoDetailService
  ) {}

  lastKey: any;
  lastKey2: any;
  lastKey3: any;
  observer: any;

  ngOnInit(): void {
    this.lastKey = 3;
    this.lastKey2 = 3;
    this.lastKey3 = 3;
    this.observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        let main = document.querySelector('.video-content');
        for (let i = 0; i < 4; i++) {
          if (this.lastKey < this.todayVideos.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-video-renderer');
            video.setAttribute('video', 'this.todayVideos[this.lastKey]');
            div.appendChild(video);
            main.appendChild(div);
            this.lastKey++;
          } else if (this.lastKey2 < this.thisWeekVideos.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-video-renderer');
            video.setAttribute('video', 'this.thisWeekVideos[this.lastKey]');
            div.appendChild(video);
            main.appendChild(div);
            this.lastKey2++;
          } else if (this.lastKey3 < this.thisMonthVideos.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-video-renderer');
            video.setAttribute('video', 'this.thisMonthVideos[this.lastKey]');
            div.appendChild(video);
            main.appendChild(div);
            this.lastKey3++;
          }
        }
      }
    });
    this.observer.observe(document.querySelector('.end-point'));
    this.getSubscriber();
  }

  // subscription
  allSubscribers: any = [];
  currentSubscriber: any = [];
  getSubscriber(): boolean {
    this.apollo
      .watchQuery<any>({
        query: getAllSubscriber,
      })
      .valueChanges.subscribe((result) => {
        this.allSubscribers = result.data.subscribers;
        this.getCurrentSubscriber();
        return true;
      });
    return false;
  }

  getCurrentSubscriber() {
    this.currentSubscriber = [];
    for (let i = 0; i < this.allSubscribers.length; i++) {
      const element = this.allSubscribers[i];
      if (this.userSession.getCurrentUserDB().id == element.user_id) {
        this.currentSubscriber.push(element);
      }
    }

    this.subsVideos = [];
    var allVideos = this.videoService.getVideos();
    for (let i = 0; i < this.currentSubscriber.length; i++) {
      for (let j = 0; j < allVideos.length; j++) {
        const element = allVideos[j];
        if (element.user_id == this.currentSubscriber[i].channel_id) {
          this.subsVideos.push(element);
        }
      }
    }

    var currentDate = new Date();
    for (let i = 0; i < this.subsVideos.length; i++) {
      const element = this.subsVideos[i];
      var dbDate = new Date(element.upload_date);
      var differentDate = Math.abs(
        Math.floor(
          (dbDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
        )
      );
      if (differentDate <= 1) {
        this.todayVideos.push(element);
      } else if (differentDate <= 7) {
        this.thisWeekVideos.push(element);
      } else if (differentDate <= 30) {
        this.thisMonthVideos.push(element);
      }
    }
  }

  todayVideos: any = [];
  thisWeekVideos: any = [];
  thisMonthVideos: any = [];
  subsVideos: any = [];
  allUsers: any = [];

  getCurrentUsers() {
    this.apollo
      .watchQuery<any>({
        query: searchUserById,
      })
      .valueChanges.subscribe((result) => {
        this.allUsers = result.data.users;
      });
  }

  sortChannelByName() {
    this.userSession.currentSubs = [] = this.userSession.currentSubs.sort(
      (n1, n2) => {
        if (n1.username > n2.username) {
          return 1;
        } else return -1;
      }
    );
  }
}
