import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';



import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { LinksComponent } from './Components/links/links.component';
import { LoginComponent } from './Components/login/login.component';
import { MyIndexComponent } from './Components/my-index/my-index.component';
import { NewDoctorsComponent } from './Components/new-doctors/new-doctors.component';
import { RecommendationsComponent } from './Components/recommendations/recommendations.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { DatePipe } from '@angular/common';
import { GlobalDialogComponent } from './Components/global-dialog/global-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LinksComponent,
    LoginComponent,
    MyIndexComponent,
    NewDoctorsComponent,
    RecommendationsComponent,
    SettingsComponent,
    GlobalDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    AgGridModule.withComponents([])
    ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
