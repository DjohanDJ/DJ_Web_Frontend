import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './content/home/home.component';
import { TrendingComponent } from './content/trending/trending.component';
import { WatchComponent } from './content/watch/watch.component';
import { ResultsComponent } from './content/results/results.component';
import { RestrictioningComponent } from './header/restrictioning/restrictioning.component';
import { ChannelComponent } from './content/channel/channel.component';
import { UploadVideoComponent } from './content/upload-video/upload-video.component';
import { SubscriptionComponent } from './content/subscription/subscription.component';
import { PremiumMembershipComponent } from './content/premium-membership/premium-membership.component';
import { CategoryComponent } from './content/category/category.component';
import { SendingComponent } from './content/watch/sending/sending.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'watch/:id', component: WatchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'restrictioning', component: RestrictioningComponent },
  { path: 'channel/:id', component: ChannelComponent },
  { path: 'upload-video/:user_id', component: UploadVideoComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'premium-membership', component: PremiumMembershipComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'sending/:id', component: SendingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
