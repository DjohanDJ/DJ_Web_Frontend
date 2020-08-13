import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { VideoDetailService } from 'src/app/services-only/video-detail.service';
import { UserSessionService } from 'src/app/services-only/user-session.service';
import { CommentDetailService } from 'src/app/services-only/comment-detail.service';

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

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private videoDetailService: VideoDetailService,
    public userSession: UserSessionService,
    private commentService: CommentDetailService
  ) {}

  parentId: number;

  ngOnInit(): void {
    if (this.comment.comment_parent_id == -1) {
      this.parentId = this.comment.id;
    } else {
      this.parentId = this.comment.comment_parent_id;
    }
    this.videoId = this.route.snapshot.params.id;
    this.apollo
      .watchQuery<any>({
        query: searchUserById,
        variables: {
          searchId: this.comment.user_id,
        },
      })
      .valueChanges.subscribe((result) => {
        this.userFromPickedComment = result.data.searchUserByID;
      });
  }

  videoId: string;

  allComments: any = [];
  @Input() currentComments: any = [];
  @Input() comment: {
    id: number;
    video_id: number;
    comment_parent_id: number;
    comment_value: string;
    user_id: number;
  };

  userFromPickedComment: any;

  @Input() parentComment: {
    id: number;
    video_id: number;
    comment_parent_id: number;
    comment_value: string;
    user_id: number;
  };

  // action comment
  actionReplyState: boolean = false;

  changeReplyState() {
    this.actionReplyState = !this.actionReplyState;
  }

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
          comment_parent_id: this.parentId,
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
}
