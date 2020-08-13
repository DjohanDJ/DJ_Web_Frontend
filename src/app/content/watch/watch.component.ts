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
  ) {}

  // infinite scroll
  lastKey = 100;
  observer: any;
  useInfScroll: boolean = true;

  ngOnInit(): void {
    if (this.userSession.getCurrentUser() == null) {
      window.scrollTo(0, 0);
      this.lastKey = 4;
      this.observer = new IntersectionObserver((entry) => {
        if (entry[0].isIntersecting) {
          let main = document.querySelector('.parent');
          if (this.lastKey < this.allComments.length) {
            let div = document.createElement('div');
            let video = document.createElement('app-comment');
            video.setAttribute('comment', 'this.currentComments[this.lastKey]');
            div.appendChild(video);
            main.appendChild(div);
            this.lastKey++;
          }
        }
      });
      this.observer.observe(document.querySelector('.end-point'));
    }

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
}
