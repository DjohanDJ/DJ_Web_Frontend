import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './content/home/home.component';
import { TrendingComponent } from './content/trending/trending.component';
import { VideoRendererComponent } from './content/video-renderer/video-renderer.component';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { GraphQLModule } from './graphql.module';
import { WatchComponent } from './content/watch/watch.component';
import { ResultsComponent } from './content/results/results.component';
import { VideoRendererLandscapeComponent } from './content/results/video-renderer-landscape/video-renderer-landscape.component';
import { RestrictioningComponent } from './header/restrictioning/restrictioning.component';
import { ChannelComponent } from './content/channel/channel.component';
import { UploadVideoComponent } from './content/upload-video/upload-video.component';
import { SubscriptionComponent } from './content/subscription/subscription.component';
import { PremiumMembershipComponent } from './content/premium-membership/premium-membership.component';
import { CategoryComponent } from './content/category/category.component';
import { CommentComponent } from './content/watch/comment/comment.component';
import { SendingComponent } from './content/watch/sending/sending.component';
import { UserRendererComponent } from './content/results/user-renderer/user-renderer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavbarComponent,
    ContentComponent,
    HomeComponent,
    TrendingComponent,
    VideoRendererComponent,
    WatchComponent,
    ResultsComponent,
    VideoRendererLandscapeComponent,
    RestrictioningComponent,
    ChannelComponent,
    UploadVideoComponent,
    SubscriptionComponent,
    PremiumMembershipComponent,
    CategoryComponent,
    CommentComponent,
    SendingComponent,
    UserRendererComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InlineSVGModule.forRoot(),
    SocialLoginModule,
    GraphQLModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '102243405701-53638i9df6j94v5dqmp2l62i1rmr0hd3.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
