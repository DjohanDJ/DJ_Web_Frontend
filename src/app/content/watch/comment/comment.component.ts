import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  constructor(private route: ActivatedRoute, private apollo: Apollo) {}

  ngOnInit(): void {
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
}
