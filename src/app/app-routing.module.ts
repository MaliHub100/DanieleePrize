import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { RecommendationsComponent } from './Components/recommendations/recommendations.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { NewDoctorsComponent } from './Components/new-doctors/new-doctors.component';
import { LinksComponent } from './Components/links/links.component';
import { MyIndexComponent } from './Components/my-index/my-index.component';


const routes: Routes = [
  {
    path:"",component: MyIndexComponent,
  }
  ,
  {path:"recommendations", component: RecommendationsComponent},
      {path:"settings", component: SettingsComponent},
      {path:"newDoctors", component: NewDoctorsComponent},
      {path:"links", component: LinksComponent},
      {path:"header", component: HeaderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
