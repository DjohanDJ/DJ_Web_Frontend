import { Component, OnInit } from '@angular/core';
import { UserSessionService } from 'src/app/services-only/user-session.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

export const getAllMembership = gql`
  query getMembership {
    memberships {
      id
      user_id
      join_premium_date
      member_type
    }
  }
`;

export const insertMembership = gql`
  mutation insertMembership(
    $userId: Int!
    $date: String!
    $memberType: String!
  ) {
    createMembership(
      input: {
        user_id: $userId
        join_premium_date: $date
        member_type: $memberType
      }
    ) {
      id
      user_id
      join_premium_date
      member_type
    }
  }
`;

export const deleteMembership = gql`
  mutation deleteMembership($delId: ID!) {
    deleteMembership(id: $delId)
  }
`;

export const updateUser = gql`
  mutation updateUserAttrib(
    $userID: ID!
    $username: String!
    $email: String!
    $user_password: String!
    $channel_name: String!
    $user_image: String!
    $channel_banner: String!
    $channel_desc: String!
    $restriction: String!
    $location: String!
    $membership: String!
    $expired_date: String!
    $join_date: String!
  ) {
    updateUser(
      id: $userID
      input: {
        username: $username
        email: $email
        user_password: $user_password
        channel_name: $channel_name
        user_image: $user_image
        channel_banner: $channel_banner
        channel_desc: $channel_desc
        restriction: $restriction
        location: $location
        membership: $membership
        expired_member: $expired_date
        join_date: $join_date
      }
    ) {
      id
      username
      email
      user_password
      channel_name
      user_image
      location
      membership
      expired_member
      join_date
    }
  }
`;

@Component({
  selector: 'app-premium-membership',
  templateUrl: './premium-membership.component.html',
  styleUrls: ['./premium-membership.component.scss'],
})
export class PremiumMembershipComponent implements OnInit {
  constructor(public userSession: UserSessionService, private apollo: Apollo) {}

  ngOnInit(): void {
    this.getAllMembership();
    this.changeDateFormat();
  }

  getMembershipMonth() {
    this.updateUser(30);
    this.insertMembership('monthly');
  }

  getMembershipYear() {
    this.updateUser(365);
    this.insertMembership('anually');
  }

  updateUser(moreDate: any) {
    var today = new Date();

    var future = new Date(new Date().setDate(today.getDate() + moreDate));
    var futureDate =
      future.getFullYear() +
      '-' +
      (future.getMonth() + 1) +
      '-' +
      future.getDate();

    this.apollo
      .mutate({
        mutation: updateUser,
        variables: {
          userID: this.userSession.getCurrentUserDB().id,
          username: this.userSession.getCurrentUserDB().username,
          email: this.userSession.getCurrentUserDB().email,
          user_password: 'None',
          channel_name: this.userSession.getCurrentUserDB().channel_name,
          user_image: this.userSession.getCurrentUserDB().user_image,
          channel_banner: this.userSession.getCurrentUserDB().channel_banner,
          channel_desc: this.userSession.getCurrentUserDB().channel_desc,
          restriction: this.userSession.getCurrentUserDB().restriction,
          location: this.userSession.getCurrentUserDB().location,
          membership: 'premium',
          expired_date: futureDate.toString(),
          join_date: this.userSession.getCurrentUserDB().join_date,
        },
      })
      .subscribe((result) => {});
  }

  insertMembership(memberType: any) {
    var today = new Date();
    var currentDate =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();

    this.apollo
      .mutate({
        mutation: insertMembership,
        variables: {
          userId: this.userSession.getCurrentUserDB().id,
          date: currentDate,
          memberType: memberType,
        },
        refetchQueries: [
          {
            query: getAllMembership,
            variables: { repoFullName: 'apollographql/apollo-client' },
          },
        ],
      })
      .subscribe((result) => {
        this.getAllMembership();
      });
  }

  currentMembership: any = [];
  allMembership: any = [];
  lastMembership: any = [];
  otherMembership: any = [];

  getAllMembership() {
    this.apollo
      .watchQuery<any>({
        query: getAllMembership,
      })
      .valueChanges.subscribe((result) => {
        this.allMembership = [];
        this.currentMembership = [];
        this.otherMembership = [];
        this.lastMembership = [];
        this.allMembership = result.data.memberships;
        for (let i = 0; i < this.allMembership.length; i++) {
          const element = this.allMembership[i];
          if (element.user_id == this.userSession.getCurrentUserDB().id) {
            this.currentMembership.push(element);
          }
        }
        for (let i = 0; i < this.currentMembership.length; i++) {
          const element = this.currentMembership[i];
          if (
            this.currentMembership[i] ==
            this.currentMembership[this.currentMembership.length - 1]
          ) {
            this.lastMembership = element;
          } else {
            this.otherMembership.push(element);
          }
        }
      });
  }

  editDate: any;
  changeDateFormat() {
    var now = new Date();
    var videoDate = new Date(
      this.userSession.getCurrentUserDB().expired_member
    );
    var differentDate = Math.abs(
      Math.floor((now.getTime() - videoDate.getTime()) / (1000 * 3600 * 24))
    );
    if (differentDate < 1) {
      this.editDate = 'Today';
    } else if (differentDate <= 6) {
      this.editDate = differentDate + ' days later';
    } else if (differentDate <= 30) {
      this.editDate = Math.abs(Math.floor(differentDate / 7)) + ' weeks later';
    } else if (differentDate <= 365) {
      this.editDate =
        Math.abs(Math.floor(differentDate / 30)) + ' months later';
    } else {
      this.editDate =
        Math.abs(Math.floor(differentDate / 365)) + ' years later';
    }
  }
}
