import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/services-only/user-session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { getPlaylistQuery } from '../home/home.component';

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

export const updatePlaylists = gql`
  mutation updatePlaylists(
    $playlistId: ID!
    $title: String!
    $desc: String!
    $privacy: String!
  ) {
    updatePlaylist(
      playlist_id: $playlistId
      input: {
        playlist_id: 10000
        video_id: 0
        channel_id: 0
        title: $title
        description: $desc
        thumbnail: ""
        update_date: ""
        view_count: 22
        privacy: $privacy
      }
    ) {
      playlist_id
      video_id
      channel_id
      title
      description
      thumbnail
      update_date
      view_count
      privacy
    }
  }
`;

export const deletePlaylist = gql`
  mutation deletePlaylist($playlistId: ID!, $videoId: Int!) {
    deletePlaylist(playlist_id: $playlistId, video_id: $videoId)
  }
`;

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  constructor(
    public userSession: UserSessionService,
    private apollo: Apollo,
    public videoService: VideoDetailService,
    private route: ActivatedRoute,
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

  lastKey: any;
  observer: any;
  ngOnInit(): void {
    this.lastKey = 8;
    this.observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        let main = document.querySelector('.right-container');
        for (let i = 0; i < 2; i++) {
          if (this.lastKey < this.videoService.currentAllVideos.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-video-renderer');
            video.setAttribute(
              'video',
              'this.videoService.currentAllVideos[this.lastKey]'
            );
            div.appendChild(video);
            main.appendChild(div);
            this.lastKey++;
          }
        }
      }
    });
    this.observer.observe(document.querySelector('.end-point'));

    this.paramId = this.route.snapshot.params.id;
    this.getCurrentPlaylist();
    this.searchUser();
    this.getCurrentVideo();
    this.changeDateFormat();
    this.initializeDropdownState();
    this.sortVideosByUpdateDate();
    this.checkInitialPrivacy();
    this.setCurrentQueue();
    this.changeViewFormat();
  }

  playlist: {
    playlist_id: number;
    video_id: number;
    channel_id: number;
    title: string;
    description: string;
    thumbnail: string;
    update_date: string;
    view_count: string;
    privacy: string;
  };

  paramId: any;
  currentPlaylist: any = [];
  videoCount: any;
  currentVideosId: any = [];
  getCurrentPlaylist() {
    this.videoCount = 0;
    this.currentVideosId = [];
    var allPlaylist = this.videoService.playlists;
    for (let i = 0; i < allPlaylist.length; i++) {
      if (allPlaylist[i].playlist_id == this.paramId) {
        this.playlist = allPlaylist[i];
        this.videoService.singlePlaylistDetail = allPlaylist[i];
        break;
      }
    }
    for (let i = 0; i < allPlaylist.length; i++) {
      if (allPlaylist[i].playlist_id == this.paramId) {
        this.videoCount++;
        this.currentVideosId.push(allPlaylist[i].video_id);
      }
    }
  }

  currentVideo: any;
  getCurrentVideo() {
    this.videoService.currentAllVideos = [];
    var allVideo = this.videoService.getVideos();
    for (let i = 0; i < allVideo.length; i++) {
      if (allVideo[i].id == this.playlist.video_id) {
        this.currentVideo = allVideo[i];
        break;
      }
    }
    for (let j = 0; j < this.currentVideosId.length; j++) {
      for (let i = 0; i < allVideo.length; i++) {
        if (allVideo[i].id == this.currentVideosId[j]) {
          this.videoService.currentAllVideos.push(allVideo[i]);
        }
      }
    }
  }

  selectedUser: {
    id: number;
    username: string;
    channel_name: string;
    user_image: string;
    channel_banner: string;
    channel_desc: string;
  };

  searchUser() {
    this.apollo
      .watchQuery<any>({
        query: searchUserById,
        variables: {
          searchId: this.playlist.channel_id,
        },
      })
      .valueChanges.subscribe((result) => {
        this.selectedUser = result.data.searchUserByID;
        this.getSubscriber();
      });
  }

  editDate: any;

  changeDateFormat() {
    var now = new Date();
    var videoDate = new Date(this.playlist.update_date);
    var differentDate = Math.abs(
      Math.floor((videoDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
    );
    if (differentDate < 1) {
      this.editDate = 'Today';
    } else if (differentDate <= 6) {
      this.editDate = differentDate + ' days ago';
    } else if (differentDate <= 30) {
      this.editDate = Math.abs(Math.floor(differentDate / 7)) + ' weeks ago';
    } else if (differentDate <= 365) {
      this.editDate = Math.abs(Math.floor(differentDate / 30)) + ' months ago';
    } else {
      this.editDate = Math.abs(Math.floor(differentDate / 365)) + ' years ago';
    }
  }

  dateAddedState: boolean = true;
  datePublishedState: boolean = false;
  popularityState: boolean = false;

  changeAddedState() {
    this.dateAddedState = true;
    this.datePublishedState = false;
    this.popularityState = false;
    this.sortVideosByUpdateDate();
  }

  changePublishState() {
    this.dateAddedState = false;
    this.datePublishedState = true;
    this.popularityState = false;
    this.sortVideosByNewest();
  }

  changePopularityState() {
    this.dateAddedState = false;
    this.datePublishedState = false;
    this.popularityState = true;
    this.sortVideosByView();
  }

  checkInitialPrivacy() {
    if (this.playlist.privacy == 'Private') {
      this.videoService.privacyState = true;
    } else {
      this.videoService.privacyState = false;
    }
  }

  changePrivacy() {
    this.checkInitialPrivacy();
    this.videoService.privacyState = true;
    this.updatePrivacy('Private');
    this.managePlaylistPrivate();
  }

  changePublic() {
    this.checkInitialPrivacy();
    this.videoService.privacyState = false;
    this.updatePrivacy('Public');
    this.managePlaylistPublic();
  }

  sortVideosByView() {
    this.videoService.currentAllVideos = [] = this.videoService.currentAllVideos.sort(
      (n1, n2) => {
        if (n1.view_count < n2.view_count) {
          return 1;
        } else return -1;
      }
    );
  }

  sortVideosByNewest() {
    this.videoService.currentAllVideos = [] = this.videoService.currentAllVideos.sort(
      (n1, n2) => {
        var first = new Date(n1.upload_date);
        var second = new Date(n2.upload_date);
        if (first.getTime() > second.getTime()) {
          return 1;
        } else return -1;
      }
    );
  }

  sortVideosByUpdateDate() {
    let allPlaylist = this.videoService.playlists;
    this.currentPlaylist = [];
    for (let i = 0; i < allPlaylist.length; i++) {
      if (allPlaylist[i].playlist_id == this.playlist.playlist_id) {
        this.currentPlaylist.push(allPlaylist[i]);
      }
    }
    this.currentPlaylist = [] = this.currentPlaylist.sort((n1, n2) => {
      var first = new Date(n1.upload_date);
      var second = new Date(n2.upload_date);
      if (first.getTime() > second.getTime()) {
        return 1;
      } else return -1;
    });
    let sortedVideo = [];
    for (let i = 0; i < this.currentPlaylist.length; i++) {
      for (let j = 0; j < this.videoService.currentAllVideos.length; j++) {
        if (
          this.currentPlaylist[i].video_id ==
          this.videoService.currentAllVideos[j].id
        ) {
          sortedVideo.push(this.videoService.currentAllVideos[j]);
        }
      }
    }
    this.videoService.currentAllVideos = [];
    this.videoService.currentAllVideos = sortedVideo;
  }

  dropdownDisplay: boolean[] = [false];

  openDropdown(index: any) {
    this.dropdownDisplay[index] = !this.dropdownDisplay[index];
  }

  initializeDropdownState() {
    for (let i = 0; i < this.videoService.currentAllVideos.length; i++) {
      this.dropdownDisplay[i] = false;
    }
  }

  moveToTop(index: any) {
    var currentVideo = index;
    for (let i = 0; i < this.videoService.currentAllVideos.length; i++) {
      if (this.videoService.currentAllVideos[i] === currentVideo) {
        this.videoService.currentAllVideos.splice(i, 1);
        break;
      }
    }
    this.videoService.currentAllVideos.unshift(currentVideo);
    this.initializeDropdownState();
  }

  moveToBottom(index: any) {
    var currentVideo = index;
    for (let i = 0; i < this.videoService.currentAllVideos.length; i++) {
      if (this.videoService.currentAllVideos[i] === currentVideo) {
        this.videoService.currentAllVideos.splice(i, 1);
        break;
      }
    }
    this.videoService.currentAllVideos.push(currentVideo);
    this.initializeDropdownState();
  }

  moveUp(index: any) {
    var currentVideo = index;
    let id = 0;
    for (let i = 0; i < this.videoService.currentAllVideos.length; i++) {
      if (this.videoService.currentAllVideos[i] === currentVideo) {
        id = i;
        break;
      }
    }
    if (id > 0) {
      var temp = this.videoService.currentAllVideos[id];
      this.videoService.currentAllVideos[
        id
      ] = this.videoService.currentAllVideos[id - 1];
      this.videoService.currentAllVideos[id - 1] = temp;
    }
    this.initializeDropdownState();
  }

  moveDown(index: any) {
    var currentVideo = index;
    let id = 0;
    for (let i = 0; i < this.videoService.currentAllVideos.length; i++) {
      if (this.videoService.currentAllVideos[i] === currentVideo) {
        id = i;
        break;
      }
    }
    if (id < this.videoService.currentAllVideos.length - 1) {
      var temp = this.videoService.currentAllVideos[id];
      this.videoService.currentAllVideos[
        id
      ] = this.videoService.currentAllVideos[id + 1];
      this.videoService.currentAllVideos[id + 1] = temp;
    }
    this.initializeDropdownState();
  }

  updatePrivacy(currPrivacy: any) {
    this.apollo
      .mutate({
        mutation: updatePlaylists,
        variables: {
          playlistId: this.playlist.playlist_id,
          title: this.playlist.title,
          desc: this.playlist.description,
          privacy: currPrivacy,
        },
        refetchQueries: [
          {
            query: getPlaylistQuery,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe((result) => {});
  }

  setCurrentQueue() {
    this.videoService.parsedVideoQueue = [];
    for (let i = 0; i < this.videoService.currentAllVideos.length; i++) {
      this.videoService.parsedVideoQueue.push(
        this.videoService.currentAllVideos[i]
      );
    }
  }

  randomVideoForService() {
    this.videoService.parsedVideoQueue = this.shuffle(
      this.videoService.parsedVideoQueue
    );
  }

  shuffle(a: any) {
    for (var i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  removeVideoFromPlaylist(indexProp: any) {
    if (this.currentPlaylist.length > 1) {
      let searchPlaylist: any;
      for (let i = 0; i < this.currentPlaylist.length; i++) {
        if (
          this.currentPlaylist[i].playlist_id == this.playlist.playlist_id &&
          this.currentPlaylist[i].video_id == indexProp.id
        ) {
          searchPlaylist = this.currentPlaylist[i];
          break;
        }
      }

      for (let i = 0; i < this.videoService.playlists.length; i++) {
        if (
          this.videoService.playlists[i].playlist_id ==
          searchPlaylist.playlist_id
        ) {
          this.videoService.playlists.splice(i, 1);
          break;
        }
      }

      for (let i = 0; i < this.videoService.currentAllVideos.length; i++) {
        if (this.videoService.currentAllVideos[i].id == indexProp.id) {
          this.videoService.currentAllVideos.splice(i, 1);
          break;
        }
      }
      this.setCurrentQueue();
      this.apollo
        .mutate({
          mutation: deletePlaylist,
          variables: {
            playlistId: this.playlist.playlist_id,
            videoId: indexProp.id,
          },
          refetchQueries: [
            {
              query: getPlaylistQuery,
              variables: { repoFullName: 'apollographql/apollo-client' },
            },
          ],
        })
        .subscribe((result) => {});
    }
    this.initializeDropdownState();
  }

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
  // desc input
  booleanSearchDesc: boolean = false;
  commentValueDesc: string = '';
  onTypeSearchBoxDesc(value: string) {
    this.commentValueDesc = value;
    if (this.commentValueDesc != '') {
      this.booleanSearchDesc = true;
    } else {
      this.booleanSearchDesc = false;
    }
  }

  onClickUpdateTitle() {
    this.changeInputState();
    this.apollo
      .mutate({
        mutation: updatePlaylists,
        variables: {
          playlistId: this.playlist.playlist_id,
          title: this.commentValue,
          desc: this.playlist.description,
          privacy: this.playlist.privacy,
        },
        refetchQueries: [
          {
            query: getPlaylistQuery,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe((result) => {});
    this.getCurrentPlaylist();
    this.videoService.singlePlaylistDetail.title = this.commentValue;
  }

  inputState: boolean = false;

  changeInputState() {
    this.inputState = !this.inputState;
  }

  inputStateDesc: boolean = false;

  changeInputStateDesc() {
    this.inputStateDesc = !this.inputStateDesc;
  }

  onClickUpdateDesc() {
    this.changeInputStateDesc();
    this.apollo
      .mutate({
        mutation: updatePlaylists,
        variables: {
          playlistId: this.playlist.playlist_id,
          title: this.playlist.title,
          desc: this.commentValueDesc,
          privacy: this.playlist.privacy,
        },
        refetchQueries: [
          {
            query: getPlaylistQuery,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe((result) => {});
    this.getCurrentPlaylist();
    this.videoService.singlePlaylistDetail.description = this.commentValueDesc;
  }

  onClickDeleteVideos() {
    for (let i = 0; i < this.videoService.playlists.length; i++) {
      if (
        this.videoService.playlists[i].playlist_id == this.playlist.playlist_id
      ) {
        this.videoService.playlists.splice(i, 1);
      }
    }

    for (let i = 0; i < this.videoService.distinctPlaylists.length; i++) {
      if (
        this.videoService.distinctPlaylists[i].playlist_id ==
        this.playlist.playlist_id
      ) {
        this.videoService.distinctPlaylists.splice(i, 1);
        break;
      }
    }

    for (let i = 0; i < this.videoService.nextDistinctPlaylists.length; i++) {
      if (
        this.videoService.nextDistinctPlaylists[i].playlist_id ==
        this.playlist.playlist_id
      ) {
        this.videoService.distinctPlaylists.splice(i, 1);
        break;
      }
    }

    var totalDistinctPlaylist = [
      ...this.videoService.distinctPlaylists,
      ...this.videoService.nextDistinctPlaylists,
    ];

    this.videoService.distinctPlaylists = [];
    this.videoService.nextDistinctPlaylists = [];
    for (let i = 0; i < totalDistinctPlaylist.length; i++) {
      if (i < 5) {
        this.videoService.distinctPlaylists.push(totalDistinctPlaylist[i]);
      } else {
        this.videoService.nextDistinctPlaylists.push(totalDistinctPlaylist[i]);
      }
    }

    this.setCurrentQueue();

    for (let i = 0; i < this.currentPlaylist.length; i++) {
      if (this.currentPlaylist[i].playlist_id == this.playlist.playlist_id) {
        console.log(this.currentPlaylist[i]);
        this.apollo
          .mutate({
            mutation: deletePlaylist,
            variables: {
              playlistId: this.currentPlaylist[i].playlist_id,
              videoId: this.currentPlaylist[i].video_id,
            },
            refetchQueries: [
              {
                query: getPlaylistQuery,
                variables: { repoFullName: 'apollographql/apollo-client' },
              },
            ],
          })
          .subscribe((result) => {});
      }
    }
  }

  editViewers: any;
  temp: number;

  changeViewFormat() {
    this.temp = Number(this.playlist.view_count);
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

  checkNextDist: boolean = false;

  managePlaylistPrivate() {
    var element = null;
    var element2 = null;
    if (this.videoService.nextDistinctPlaylists.length == 0) {
      for (let i = 0; i < this.videoService.distinctPlaylists.length; i++) {
        if (
          this.videoService.distinctPlaylists[i].playlist_id ==
          this.playlist.playlist_id
        ) {
          element = this.videoService.distinctPlaylists[i];
          this.videoService.distinctPlaylists.splice(i, 1);
          break;
        }
      }
      this.videoService.distinctPlaylists.unshift(element);
    } else {
      for (let i = 0; i < this.videoService.distinctPlaylists.length; i++) {
        if (
          this.videoService.distinctPlaylists[i].playlist_id ==
          this.playlist.playlist_id
        ) {
          element2 = this.videoService.distinctPlaylists[i];
          this.videoService.distinctPlaylists.splice(i, 1);
          this.checkNextDist = true;
          break;
        }
      }
      if (this.checkNextDist) {
        this.videoService.distinctPlaylists.unshift(element2);
      }
      if (!this.checkNextDist) {
        for (
          let i = 0;
          i < this.videoService.nextDistinctPlaylists.length;
          i++
        ) {
          if (
            this.videoService.nextDistinctPlaylists[i].playlist_id ==
            this.playlist.playlist_id
          ) {
            element2 = this.videoService.distinctPlaylists[i];
            this.videoService.distinctPlaylists.splice(i, 1);
            break;
          }
        }
        this.videoService.distinctPlaylists.unshift(element2);
      }
    }
  }

  managePlaylistPublic() {
    var element = null;
    var element2 = null;
    if (this.videoService.nextDistinctPlaylists.length == 0) {
      for (let i = 0; i < this.videoService.distinctPlaylists.length; i++) {
        if (
          this.videoService.distinctPlaylists[i].playlist_id ==
          this.playlist.playlist_id
        ) {
          element = this.videoService.distinctPlaylists[i];
          this.videoService.distinctPlaylists.splice(i, 1);
          break;
        }
      }
      this.videoService.distinctPlaylists.push(element);
    } else {
      for (let i = 0; i < this.videoService.distinctPlaylists.length; i++) {
        if (
          this.videoService.distinctPlaylists[i].playlist_id ==
          this.playlist.playlist_id
        ) {
          element2 = this.videoService.distinctPlaylists[i];
          this.videoService.distinctPlaylists.splice(i, 1);
          this.checkNextDist = true;
          break;
        }
      }
      if (this.checkNextDist) {
        this.videoService.nextDistinctPlaylists.push(element2);
        this.videoService.distinctPlaylists.push(
          this.videoService.nextDistinctPlaylists[0]
        );
        this.videoService.nextDistinctPlaylists.splice(0, 1);
      }
      if (!this.checkNextDist) {
        for (
          let i = 0;
          i < this.videoService.nextDistinctPlaylists.length;
          i++
        ) {
          if (
            this.videoService.nextDistinctPlaylists[i].playlist_id ==
            this.playlist.playlist_id
          ) {
            element2 = this.videoService.distinctPlaylists[i];
            this.videoService.distinctPlaylists.splice(i, 1);
            break;
          }
        }
        this.videoService.nextDistinctPlaylists.push(element2);
      }
    }
  }

  changeSharingState() {
    this.videoService.sharingState = !this.videoService.sharingState;
    (document.getElementById('inputId') as HTMLInputElement).value =
      location.href;
    window.scrollTo(0, 0);
    this.videoService.checkBooleanTime = false;
  }

  //subscribing

  subscribeState: boolean = false;
  deleteId: number;

  changeSubscribeState() {
    this.checkSubsRelation();
    if (this.subscribeState == true) {
      this.deleteSubscriber(this.deleteId);
    } else {
      this.insertSubscriber(
        Number(this.selectedUser.id),
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
          this.selectedUser.id == element.channel_id
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
        this.checkSubsRelation();
      });
  }

  countSubscriber: number;
  currentSubscriber: any = [];
  allSubscribers: any = [];
}

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
