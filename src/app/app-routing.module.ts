import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './content/home/home.component';
import { TrendingComponent } from './content/trending/trending.component';
import { WatchComponent } from './content/watch/watch.component';
import { ResultsComponent } from './content/results/results.component';
import { RestrictioningComponent } from './header/restrictioning/restrictioning.component';
import { ChannelComponent } from './content/channel/channel.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'watch/:id', component: WatchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'restrictioning', component: RestrictioningComponent },
  { path: 'channel/:id', component: ChannelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
