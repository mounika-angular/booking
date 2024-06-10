import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BookMeetingRoomModel } from 'src/app/models/meeting-room.model';
import { MeetingRoomService } from 'src/app/service/meeting-room.service';
@Component({
  selector: 'app-book-meeting-dialog',
  templateUrl: './book-meeting-dialog.component.html',
  styleUrls: ['./book-meeting-dialog.component.css'],
})
export class BookMeetingDialogComponent implements OnInit, OnDestroy {
  searchClicked: boolean = false;
  bookingForm!: FormGroup;
  meetingRooms: any;
  currentMeetingList: any;
  availableRooms: any = [];
  minDate: any;
  errorMessage: string = '';
  roomDetails: any = [];
  meetingSub: Subscription = Subscription.EMPTY;
  roomsSub: Subscription = Subscription.EMPTY;
  bookMeetingSub: Subscription = Subscription.EMPTY;
  constructor(
    public dialogRef: MatDialogRef<BookMeetingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookMeetingRoomModel,
    private meetingService: MeetingRoomService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      userName: [{ value: this.data.userName, disabled: true }],
      meetingDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      meetingRoom: ['', Validators.required],
      agenda: ['', Validators.required],
    });
    this.minDate = this.getTodayDate();
    this.getMeetings();
    this.getRooms();
  }
  getRooms() {
    this.roomsSub = this.meetingService.getMeetingRooms().subscribe((data) => {
      this.meetingRooms = data;
    });
  }
  getMeetings() {
    this.meetingSub = this.meetingService
      .currentMeetings()
      .subscribe((meetings) => {
        this.currentMeetingList = meetings;
      });
  }

  close() {
    this.dialogRef.close();
  }
  getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  searchRooms() {
    this.searchClicked = true;
  }
  bookMeeting() {
    if (this.bookingForm?.valid && this.isValidMeetingTime()) {
      this.bookingForm.enable();
      this.bookMeetingSub = this.meetingService
        .bookMeetingRoom(this.bookingForm.value)
        .subscribe((res) => {
          console.log(res);
          this.toastr.success('Meeting Scheduled');
        });
      this.dialogRef.close(this.bookingForm.value);
    }
    //this.searchClicked=false;
  }

  isValidMeetingTime() {
    const startTime = this.bookingForm.get('startTime')?.value;
    const endTime = this.bookingForm.get('endTime')?.value;
    const meetingDate = new Date(this.bookingForm.get('meetingDate')?.value);
    const dayOfWeek = meetingDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      this.errorMessage =
        'Meetings can only be scheduled from Monday to Friday.';
      return false;
    }
    if (startTime < '09:00' || endTime > '18:00') {
      this.errorMessage =
        'Meetings can only be scheduled between 9:00 AM and 6:00 PM.';
      return false;
    }
    const start = new Date(`2024-01-01T${startTime}:00`);
    const end = new Date(`2024-01-01T${endTime}:00`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60);
    if (duration < 30) {
      this.errorMessage = 'Meetings should be at least 30 minutes long.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  checkRoomAvailability() {
    if (
      this.bookingForm.get('meetingDate')?.valid &&
      this.bookingForm.get('startTime')?.valid &&
      this.bookingForm.get('endTime')?.valid
    ) {
      const date = this.bookingForm.get('meetingDate')?.value;
      const startTime = this.bookingForm.get('startTime')?.value;
      const endTime = this.bookingForm.get('endTime')?.value;
      this.roomDetails = this.meetingService.getAvailableRooms(
        date,
        startTime,
        endTime,
        this.meetingRooms,
        this.currentMeetingList
      );
      // this.availableRooms=this.roomDetails.filter((room:any)=>room.status==="Available")
    }
  }
  ngOnDestroy(): void {
    if (this.roomsSub) this.roomsSub.unsubscribe();
    if (this.meetingSub) this.meetingSub.unsubscribe();
    if (this.bookMeetingSub) this.bookMeetingSub.unsubscribe();
  }
}
