import { Component, OnInit, Input } from '@angular/core';
import { VideoDetailService } from '../../services-only/video-detail.service';
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
    }
  }
`;

export const createComment = gql`
  mutation createComment(
    $video_id: Int!
    $comment_parent_id: Int!
    $comment_value: String!
    $user_id: Int!
  ) {
    createComment(
      input: {
        video_id: $video_id
        comment_parent_id: $comment_parent_id
        comment_value: $comment_value
        user_id: $user_id
      }
    ) {
      id
      video_id
      comment_parent_id
      comment_value
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
    private videoDetailService: VideoDetailService,
    private route: ActivatedRoute,
    public userSession: UserSessionService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.urlId = this.route.snapshot.params.id - 1;
    this.selectedVideo = this.videoDetailService.getVideos()[this.urlId];
    this.videoId = this.route.snapshot.params.id;

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
        this.allComments = result.data.comments;
        this.getCurrentComments();
      });
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
  };
  @Input() urlId: number;

  userFromPickedVideo: any = null;

  allComments: any = [];
  currentComments: any = [];
  videoId: string;
  commentState: boolean = false;

  getCurrentComments() {
    let counter = 0;
    for (let i = 0; i < this.allComments.length; i++) {
      const element = this.allComments[i];
      if (element.video_id == this.videoId) {
        this.currentComments.push(element);
        counter++;
      }
    }
    if (counter == 0) {
      this.commentState = false;
    } else {
      this.commentState = true;
    }
  }

  // create comment

  onClickSubmitComment() {
    this.createNewComment();
  }

  createNewComment() {
    this.apollo
      .mutate({
        mutation: createComment,
        variables: {
          video_id: this.videoId,
          comment_parent_id: -1,
          comment_value: this.commentValue,
          user_id: this.userSession.getCurrentUserDB().id,
        },
      })
      .subscribe((result) => {
        this.newComment = result.data;
        this.allComments.push(this.newComment.createComment);
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
}
