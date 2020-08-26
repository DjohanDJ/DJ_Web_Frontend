import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from '../../services-only/video-detail.service';
import { CommentDetailService } from '../../services-only/comment-detail.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { url } from 'inspector';
import { UserSessionService } from 'src/app/services-only/user-session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export const searchUserById = gql`
  query searchUserByID($searchId: Int!) {
    searchUserByID(userId: $searchId) {
      id
      username
      email
      user_password
      channel_name
      user_image
    }
  }
`;

export const getComments = gql`
  query getComments {
    comments {
      id
      video_id
      comment_parent_id
      comment_value
      user_id
      likes
      dislikes
    }
  }
`;

export const createComment = gql`
  mutation createComment(
    $video_id: Int!
    $comment_parent_id: Int!
    $comment_value: String!
    $user_id: Int!
    $date: String!
    $like: Int!
    $dislike: Int!
  ) {
    createComment(
      input: {
        video_id: $video_id
        comment_parent_id: $comment_parent_id
        comment_value: $comment_value
        user_id: $user_id
        comment_date: $date
        likes: $like
        dislikes: $dislike
      }
    ) {
      id
      video_id
      comment_parent_id
      comment_value
      user_id
      comment_date
      likes
      dislikes
    }
  }
`;

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
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  constructor(
    public videoDetailService: VideoDetailService,
    private route: ActivatedRoute,
    public userSession: UserSessionService,
    private apollo: Apollo,
    public commentService: CommentDetailService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });
  }

  // infinite scroll
  lastKey = 100;
  observer: any;
  useInfScroll: boolean = true;

  lastKeyRelated: number;
  observerRelated: any;
  playlistParamId: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (this.userSession.getCurrentUser() == null) {
        window.scrollTo(0, 0);
        this.lastKey = 4;
        this.observer = new IntersectionObserver((entry) => {
          if (entry[0].isIntersecting) {
            let main = document.querySelector('.parent');
            if (this.lastKey < this.allComments.length) {
              let div = document.createElement('div');
              let video = document.createElement('app-comment');
              video.setAttribute(
                'comment',
                'this.currentComments[this.lastKey]'
              );
              div.appendChild(video);
              main.appendChild(div);
              this.lastKey++;
            }
          }
        });
        this.observer.observe(document.querySelector('.end-point'));
      }

      window.scrollTo(0, 0);
      this.lastKeyRelated = 4;
      this.observerRelated = new IntersectionObserver((entry) => {
        if (entry[0].isIntersecting) {
          let main = document.querySelector('.related-video');
          if (this.lastKeyRelated < this.relatedVideos.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-video-renderer');
            video.setAttribute(
              'video',
              'this.relatedVideos[this.lastKeyRelated]'
            );
            div.appendChild(video);
            main.appendChild(div);
            this.lastKeyRelated++;
          }
        }
      });
      this.observerRelated.observe(document.querySelector('.end-point2'));

      this.urlId = this.route.snapshot.params.id - 1;
      this.selectedVideo = this.videoDetailService.getVideos()[this.urlId];
      this.videoId = this.route.snapshot.params.id;
      this.playlistParamId = this.route.snapshot.params.pid;

      this.apollo
        .watchQuery<any>({
          query: searchUserById,
          variables: {
            searchId: this.selectedVideo.user_id,
          },
        })
        .valueChanges.subscribe((result) => {
          this.userFromPickedVideo = result.data.searchUserByID;
        });

      this.apollo
        .watchQuery<any>({
          query: getComments,
        })
        .valueChanges.subscribe((result) => {
          // this.allComments = result.data.comments;
          this.commentService.setAllComments(result.data.comments);
          this.allComments = this.commentService.getAllComments();
          if (this.commentService.getSortNewState()) {
            this.sortCommentsByNewest();
          } else {
            this.sortCommentsByLike();
          }
          this.getCurrentComments();
        });

      if (this.playlistParamId == 0) {
        this.getRelatedVideos();
      } else {
        this.getQueuePlaylist();
      }
      this.getSubscriber();
      this.autoplayNextVideo();
    });

    (document.getElementById('video') as HTMLVideoElement).addEventListener(
      'onloadedmetadata',
      () => {
        (document.getElementById(
          'inputIdTime'
        ) as HTMLInputElement).value = (document.getElementById(
          'video'
        ) as HTMLVideoElement).duration.toString();
      }
    );
  }

  @Input() selectedVideo: {
    id: number;
    image_path: string;
    title: string;
    description: string;
    view_count: string;
    upload_date: string;
    video_path: string;
    user_id: number;
    location: string;
    category_id: number;
  };
  @Input() urlId: number;

  userFromPickedVideo: any = null;

  allComments: any = this.commentService.getAllComments();
  currentComments: any = [];
  videoId: string;
  commentState: boolean = false;
  counter: number;
  childState: boolean = false;

  getCurrentComments() {
    this.counter = 0;
    this.commentCount = 0;
    for (let i = 0; i < this.allComments.length; i++) {
      const element = this.allComments[i];
      this.childState = false;
      this.commentCount++;
      if (element.video_id == this.videoId && element.comment_parent_id == -1) {
        this.currentComments.push(element);
        this.counter++;
      }
    }
    if (this.counter == 0) {
      this.commentState = false;
    } else {
      this.commentState = true;
    }
    this.validateChildComments();
  }

  // childComment: any[][];
  // parentElement: any;

  validateChildComments() {
    for (let j = 0; j < this.currentComments.length; j++) {
      const parentElement = this.currentComments[j];
      this.childCommentCount[parentElement.id] = 0;
      for (let i = 0; i < this.allComments.length; i++) {
        const element = this.allComments[i];
        if (element.comment_parent_id == parentElement.id) {
          this.childCommentCount[parentElement.id]++;
        }
      }
      if (this.childCommentCount[parentElement.id] != 0) {
        this.childCommentCountState[parentElement.id] = true;
      }
    }
  }

  // create comment

  onClickSubmitComment() {
    this.createNewComment();
  }

  createNewComment() {
    var today = new Date();
    var currentDate =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    this.apollo
      .mutate({
        mutation: createComment,
        variables: {
          video_id: this.videoId,
          comment_parent_id: -1,
          comment_value: this.commentValue,
          user_id: this.userSession.getCurrentUserDB().id,
          date: currentDate,
          like: -1,
          dislike: -1,
        },
      })
      .subscribe((result) => {
        this.newComment = result.data;
        this.commentService
          .getAllComments()
          .push(this.newComment.createComment);
        // console.log(this.newComment);
        // console.log(currentDate);
      });
  }

  newComment: any;

  // inputnya
  booleanSearch: boolean = false;
  commentValue: string = '';
  onTypeSearchBox(value: string) {
    this.commentValue = value;
    if (this.commentValue != '') {
      this.booleanSearch = true;
    } else {
      this.booleanSearch = false;
    }
  }

  commentCount: number = 0;

  childCommentState: boolean[] = [];

  changeChildCommentState(currentReply: any) {
    this.childCommentState[currentReply.id] = !this.childCommentState[
      currentReply.id
    ];
  }

  childCommentCount: number[] = [];
  childCommentCountState: boolean[] = [];

  //sorting

  changeHomeState() {
    this.commentService.changeLikeState();
    this.commentService.changeNewState();
  }

  changeVideosState() {
    this.commentService.changeLikeState();
    this.commentService.changeNewState();
  }

  sortCommentsByNewest() {
    this.allComments = [] = this.allComments.sort((n1, n2) => {
      var first = new Date(n1.upload_date);
      var second = new Date(n2.upload_date);
      if (first.getTime() > second.getTime()) {
        return 1;
      } else return -1;
    });
  }

  sortCommentsByLike() {
    this.allComments = [] = this.allComments.sort((n1, n2) => {
      if (n1.likes < n2.likes) {
        return 1;
      } else return -1;
    });
  }

  relatedVideos: any = [];
  notRelatedVideos: any = [];
  firstVideos: any = [];

  getRelatedVideos() {
    this.firstVideos = this.videoDetailService.getVideos();

    for (let i = 0; i < this.firstVideos.length; i++) {
      const element = this.firstVideos[i];
      if (
        this.selectedVideo.location == element.location &&
        this.selectedVideo.category_id == element.category_id &&
        this.selectedVideo.id != element.id
      ) {
        this.relatedVideos.push(element);
      } else if (this.selectedVideo.id != element.id) {
        this.notRelatedVideos.push(element);
      }
    }

    for (let i = 0; i < this.notRelatedVideos.length; i++) {
      const element = this.notRelatedVideos[i];
      this.relatedVideos.push(element);
    }

    if (this.videoDetailService.currentNextVideo != null) {
      // for (let i = 0; i < this.relatedVideos.length; i++) {
      //   if (
      //     this.relatedVideos[i].id ==
      //     this.videoDetailService.currentNextVideo.id
      //   ) {
      //     console.log(this.videoDetailService.currentNextVideo);
      //   }
      // }
      this.relatedVideos.push(this.videoDetailService.currentNextVideo);
      this.relatedVideos.splice(0, 1);
    }
  }

  // get playlist
  currentAllVideos: any = [];
  currentVideo: any;
  getQueuePlaylist() {
    this.currentAllVideos = [];
    this.currentAllVideos = this.videoDetailService.parsedVideoQueue;
    this.relatedVideos = this.currentAllVideos;
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
        Number(this.userFromPickedVideo.id),
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
          this.userFromPickedVideo.id == element.channel_id
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
      if (this.userFromPickedVideo.id == element.channel_id) {
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

  video: any;
  hotkeys() {
    this.video = document.getElementById('video') as HTMLVideoElement;
    var audio_element = this.video;
    document.onkeydown = function (event) {
      switch (event.keyCode) {
        case 38:
          event.preventDefault();
          var audio_vol = audio_element.volume;
          if (audio_vol != 1) {
            try {
              var x = audio_vol + 0.02;
              audio_element.volume = x;
            } catch (err) {
              audio_element.volume = 1;
            }
          }

          break;
        case 40:
          event.preventDefault();
          var audio_vol = audio_element.volume;
          if (audio_vol != 0) {
            try {
              var y = 0;
              y = audio_vol - 0.02;
              audio_element.volume = y;
            } catch (err) {
              audio_element.volume = 0;
            }
          }
          break;
        case 74:
          event.preventDefault();
          audio_element.currentTime -= 10;
          break;
        case 75:
          event.preventDefault();
          audio_element.paused == false
            ? audio_element.pause()
            : audio_element.play();
          break;
        case 76:
          event.preventDefault();
          audio_element.currentTime += 10;
          break;

        case 70:
          event.preventDefault();
          audio_element.requestFullscreen();
          break;
      }
    };
  }

  ngOnDestroy() {
    this.deletekeys();
  }

  deletekeys() {
    document.onkeydown = function (event) {};
  }

  autoplayNextVideo() {
    if (this.videoDetailService.autoPlayState) {
      document
        .getElementById('video')
        .addEventListener('ended', this.logicNext);
    }
  }

  logicNext = () => {
    this.videoDetailService.currentNextVideo = this.selectedVideo;
    if (this.playlistParamId == 0) {
      this.router.navigateByUrl(
        '/watch/' + this.relatedVideos[0].id + '/' + this.playlistParamId
      );
    } else {
      let index = 0;
      for (let i = 0; i < this.relatedVideos.length; i++) {
        if (this.relatedVideos[i].id == this.videoId) {
          index = i;
          break;
        }
      }
      if (index != this.relatedVideos.length - 1) {
        this.router.navigateByUrl(
          '/watch/' +
            this.relatedVideos[index + 1].id +
            '/' +
            this.playlistParamId
        );
      }
    }
  };

  changeAutoPlayState() {
    this.videoDetailService.autoPlayState = !this.videoDetailService
      .autoPlayState;
    if (this.videoDetailService.autoPlayState) {
      this.autoplayNextVideo();
    } else {
      document
        .getElementById('video')
        .removeEventListener('ended', this.logicNext);
    }
  }

  nextPlayVideo() {
    this.videoDetailService.currentNextVideo = this.selectedVideo;
    if (this.playlistParamId == 0) {
      this.router.navigateByUrl(
        '/watch/' + this.relatedVideos[0].id + '/' + this.playlistParamId
      );
    } else {
      let index = 0;
      for (let i = 0; i < this.relatedVideos.length; i++) {
        if (this.relatedVideos[i].id == this.videoId) {
          index = i;
          break;
        }
      }
      if (index != this.relatedVideos.length - 1) {
        this.router.navigateByUrl(
          '/watch/' +
            this.relatedVideos[index + 1].id +
            '/' +
            this.playlistParamId
        );
      }
    }
  }

  changeSharingState() {
    this.videoDetailService.sharingState = !this.videoDetailService
      .sharingState;
    (document.getElementById('inputId') as HTMLInputElement).value =
      location.href;
    window.scrollTo(0, 0);
    this.videoDetailService.checkBooleanTime = true;

    var seconds = Math.floor(
      (document.getElementById('video') as HTMLVideoElement).currentTime
    ).toString();

    var secondsInt = Number(seconds);
    var temp = Math.floor(secondsInt);
    var text = '';
    if (temp / 3600 > 9) {
      var x = temp % 3600;
      var y = (temp - x) / 3600;
      text = text + y + ':';
      temp = x;
    } else if (temp / 3600 > 0) {
      var x = temp % 3600;
      var y = (temp - x) / 3600;
      text = text + '0' + y + ':';
      temp = x;
    }

    if (temp / 60 > 9) {
      var x = temp % 60;
      var y = (temp - x) / 60;
      text = text + y + ':';
      temp = x;
    } else if (temp / 60 > 0) {
      var x = temp % 60;
      var y = (temp - x) / 60;
      text = text + '0' + y + ':';
      temp = x;
    } else {
      text += '00:';
    }

    if (secondsInt % 60 > 9) {
      text += Math.ceil(secondsInt % 60);
    } else {
      text += '0' + Math.ceil(secondsInt % 60);
    }

    (document.getElementById('inputIdTime') as HTMLInputElement).value = text;
  }

  changeAddPlaylistState() {
    this.videoDetailService.addPlaylistState = !this.videoDetailService
      .addPlaylistState;
    window.scrollTo(0, 0);
  }
}
