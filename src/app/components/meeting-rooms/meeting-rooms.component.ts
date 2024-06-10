import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookMeetingRoomModel, MeetingRoomModel } from 'src/app/models/meeting-room.model';
import { MeetingRoomService } from 'src/app/service/meeting-room.service';
import { MatDialog} from '@angular/material/dialog';
import { BookMeetingDialogComponent } from './book-meeting-dialog/book-meeting-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meeting-rooms',
  templateUrl: './meeting-rooms.component.html',
  styleUrls: ['./meeting-rooms.component.css']
})
export class MeetingRoomsComponent implements OnInit,OnDestroy {
meetings: BookMeetingRoomModel[]=[];
username:string | null | undefined;
  upcomingMeetings: any;
  meetingRoomsDetails: any;
  selectedMeetingRoom: any;
  dialogeState:boolean=false;
  isDialogOpen!: boolean;
  meetingRooms:MeetingRoomModel[]=[]
  delMeetingSub: Subscription= Subscription.EMPTY;
  meetingSub: Subscription =Subscription.EMPTY;
  roomsSub: Subscription =Subscription.EMPTY;
constructor(
  private meetingService: MeetingRoomService,
  private dialog: MatDialog,
  private router:Router,
  private toastr: ToastrService
  ){}

ngOnInit(): void {
  this.username= localStorage.getItem("username")
  this.getMeetings();
  this.getRooms(); 
}
getRooms(){
 this.roomsSub= this.meetingService.getMeetingRooms().subscribe((data)=>{
    this.meetingRooms=data
  })
}
getMeetings(){
  this.meetingSub=this.meetingService.currentMeetings().subscribe((data)=>{
    this.meetings=data;
    this.yourUpcomingMeeting();
    })
}

bookMeeting(){
const dialogRef= this.dialog.open(BookMeetingDialogComponent,{
  autoFocus: false,
  width: '40em',
  hasBackdrop: false,
  height: 'auto',
  maxHeight: 'auto',
  data: {date:'',startTime:"",endTime:"",userName:this.username,meetingRoom:"",agenda:""},
  position: {
    left: '18em',
  },
  }
  )

dialogRef.afterClosed().subscribe((res:any)=>{
  this.getMeetings();
})
}
logout(){
  this.router.navigate(['/login']);

}
yourUpcomingMeeting(){
  this.upcomingMeetings=this.meetings.filter((data: any)=>data.userName===this.username);
}
onRoomChange(event:any){
  const selectedRoom = event.target.value;
  this.selectedMeetingRoom=this.meetings.filter((data: any)=>data.meetingRoom===selectedRoom);
  }
deleteMeeting(event:any){
    if(confirm("Are you sure want to delete?")){
     this.delMeetingSub= this.meetingService.deleteMeeting(event).subscribe((res)=>{
        this.getMeetings()
        this.toastr.success("Meeting deleted successfully");
      },
      error => console.error('Error', error))
    }
  }


  ngOnDestroy(): void {
  if(this.delMeetingSub)
   this.delMeetingSub.unsubscribe();
   if(this.meetingSub)
   this.meetingSub.unsubscribe();
   if(this.roomsSub)
   this.roomsSub.unsubscribe();
  }
}