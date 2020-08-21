import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';
import { UserSessionService } from 'src/app/services-only/user-session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export const insertSubscriber = gql`
  mutation insertSubscriber($channel_id: Int!, $user_id: Int!) {
    createSubscriber(input: { channel_id: $channel_id, user_id: $user_id }) {
      id
      channel_id
      user_id
    }
  }
`;

export const deleteSubscriber = gql`
  mutation deleteSubscriber($deleteId: ID!) {
    deleteSubscriber(id: $deleteId)
  }
`;

export const getAllSubscriber = gql`
  query getSubscribers {
    subscribers {
      id
      channel_id
      user_id
    }
  }
`;

@Component({
  selector: 'app-user-renderer',
  templateUrl: './user-renderer.component.html',
  styleUrls: ['./user-renderer.component.scss'],
})
export class UserRendererComponent implements OnInit {
  constructor(
    private videoService: VideoDetailService,
    public userSession: UserSessionService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.countCurrentVideo();
    this.getSubscriber();
  }

  @Input() user: {
    id: number;
    username: string;
    channel_name: string;
    user_image: string;
    channel_banner: string;
    channel_desc: string;
  };

  @Input() users: any;

  videoCount: number = 0;
  videos: any = [];

  countCurrentVideo() {
    this.videoCount = 0;
    this.videos = this.videoService.getVideos();
    for (let i = 0; i < this.videos.length; i++) {
      const element = this.videos[i];
      if (element.user_id == this.user.id) {
        this.videoCount++;
      }
    }
  }

  // subscribing

  subscribeState: boolean = false;
  deleteId: number;

  changeSubscribeState() {
    this.checkSubsRelation();
    if (this.subscribeState == true) {
      this.deleteSubscriber(this.deleteId);
    } else {
      this.insertSubscriber(
        Number(this.user.id),
        Number(this.userSession.getCurrentUserDB().id)
      );
    }
    this.subscribeState = !this.subscribeState;
  }

  checkSubsRelation(): boolean {
    // console.log(this.allSubscribers);
    if (this.userSession.getCurrentUserDB() != null) {
      for (let i = 0; i < this.allSubscribers.length; i++) {
        const element = this.allSubscribers[i];
        if (
          this.userSession.getCurrentUserDB().id == element.user_id &&
          this.user.id == element.channel_id
        ) {
          this.subscribeState = true;
          this.deleteId = element.id;
          return true;
          break;
        }
      }
      this.subscribeState = false;
      return false;
    }
  }

  insertSubscriber(channelId: any, userId: any) {
    this.apollo
      .mutate({
        mutation: insertSubscriber,
        variables: {
          channel_id: channelId,
          user_id: userId,
        },
        refetchQueries: [
          {
            query: getAllSubscriber,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe((result) => {});
  }

  deleteSubscriber(subsId: any) {
    this.apollo
      .mutate({
        mutation: deleteSubscriber,
        variables: {
          deleteId: subsId,
        },
        refetchQueries: [
          {
            query: getAllSubscriber,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe((result) => {});
  }

  getSubscriber() {
    this.apollo
      .watchQuery<any>({
        query: getAllSubscriber,
      })
      .valueChanges.subscribe((result) => {
        this.allSubscribers = result.data.subscribers;
        this.getCurrentSubscriber();
        this.checkSubsRelation();
      });
  }

  getCurrentSubscriber() {
    this.countSubscriber = 0;
    for (let i = 0; i < this.allSubscribers.length; i++) {
      const element = this.allSubscribers[i];
      if (this.user.id == element.channel_id) {
        this.countSubscriber++;
        this.currentSubscriber.push(element);
      }
    }
    this.changeSubsFormat();
  }

  countSubscriber: number;
  currentSubscriber: any = [];
  allSubscribers: any = [];

  temp: any;
  editViewers: any;
  changeSubsFormat() {
    this.temp = this.countSubscriber;
    if (this.temp >= 1000000000) {
      if (this.temp % 1000000000 != 0) {
        this.temp = Math.floor(this.temp / 100000000);
        if (this.temp % 10 != 0) {
          this.temp /= 10;
          this.editViewers = this.temp.toFixed(1) + 'B';
        } else {
          this.temp /= 10;
          this.editViewers = this.temp.toString() + 'B';
        }
      } else {
        this.temp = this.temp / 1000000000;
        this.editViewers = this.temp.toString() + 'B';
      }
    } else if (this.temp >= 1000000) {
      if (this.temp % 1000000 != 0) {
        this.temp = Math.floor(this.temp / 100000);
        if (this.temp % 10 != 0) {
          this.temp /= 10;
          this.editViewers = this.temp.toFixed(1) + 'M';
        } else {
          this.temp /= 10;
          this.editViewers = this.temp.toString() + 'M';
        }
      } else {
        this.temp = this.temp / 1000000;
        this.editViewers = this.temp.toString() + 'M';
      }
    } else if (this.temp >= 1000) {
      if (this.temp % 1000 != 0) {
        this.temp = Math.floor(this.temp / 100);
        if (this.temp % 10 != 0) {
          this.temp /= 10;
          this.editViewers = this.temp.toFixed(1) + 'K';
        } else {
          this.temp /= 10;
          this.editViewers = this.temp.toString() + 'K';
        }
      } else {
        this.temp = this.temp / 1000;
        this.editViewers = this.temp.toString() + 'K';
      }
    } else {
      this.editViewers = this.temp.toString();
    }
  }
}
