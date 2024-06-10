import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MeetingRoomsComponent } from './components/meeting-rooms/meeting-rooms.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BookMeetingDialogComponent } from './components/meeting-rooms/book-meeting-dialog/book-meeting-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PageNotFoundComponent } from './components/page-not-found/pageNotFound.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MeetingRoomsComponent,
    BookMeetingDialogComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //NoopAnimationsModule,  
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FlexLayoutModule,
    MatSelectModule,
    MatToolbarModule,
    ToastrModule.forRoot(
      {timeOut: 1000,
      positionClass: 'toast-bottom-right'})
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
