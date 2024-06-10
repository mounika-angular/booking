import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MeetingRoomsComponent } from './components/meeting-rooms/meeting-rooms.component';
import { PageNotFoundComponent } from './components/page-not-found/pageNotFound.component';

const routes: Routes = [
  {path:'',redirectTo:"/login",pathMatch:"full"},
  {path: 'login', component: LoginComponent },
  {path:'meeting-rooms', component: MeetingRoomsComponent},
  {path:'**',component:PageNotFoundComponent}
 // {path:'meeting-rooms', loadChildren : () => import('./components/meeting-rooms/meeting-rooms.module').then(m=>m.MeetingRoomModule)} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
