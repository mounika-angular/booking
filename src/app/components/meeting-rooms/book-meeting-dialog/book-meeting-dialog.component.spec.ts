import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { MeetingRoomService } from 'src/app/service/meeting-room.service';

import { BookMeetingDialogComponent } from './book-meeting-dialog.component';

class MockMeetingRoomService{
  getMeetingRooms(){
return of([]);
  }
  currentMeetings(){
    return of([]);
  }
  bookMeetingRoom(meeting:any){
    return of({success:true});
  }
  getAvailableRooms(date:string,startTime:string,endTime:string,meetingRoom:any,currentMeetingList:any){
    return [];
  }
}

class MockToastrService {
  success(message: string) {}
  error(message: string) {}
}

describe('BookMeetingDialogComponent', () => {
  let component: BookMeetingDialogComponent;
  let fixture: ComponentFixture<BookMeetingDialogComponent>;
  let meetingService: MeetingRoomService;
  let toastr: ToastrService;
  let dialogRef: MatDialogRef<BookMeetingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookMeetingDialogComponent],
      imports:[MatIconModule,ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { userName: 'Test User' } },
        { provide: MeetingRoomService, useClass: MockMeetingRoomService },
        { provide: ToastrService, useClass: MockToastrService }
      ]
    });
    fixture = TestBed.createComponent(BookMeetingDialogComponent);
    component = fixture.componentInstance;
    meetingService = TestBed.inject(MeetingRoomService);
    toastr = TestBed.inject(ToastrService);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the form with userName disabled', () => {
    expect(component.bookingForm.get('userName')?.value).toBe('Test User');
    expect(component.bookingForm.get('userName')?.disabled).toBeTrue();
  });

  it('should call getMeetings and getRooms on init', () => {
    spyOn(component, 'getMeetings').and.callThrough();
    spyOn(component, 'getRooms').and.callThrough();
    component.ngOnInit();
    expect(component.getMeetings).toHaveBeenCalled();
    expect(component.getRooms).toHaveBeenCalled();
  });

 

  it('should enable search button when date, startTime, and endTime are invalid', () => {
    component.bookingForm.patchValue({
      meetingDate: '',
      startTime: '',
      endTime: ''
    });
    fixture.detectChanges();
    expect(component.searchClicked).toBeFalse();
  });
  
  it('should call checkRoomAvailability and update roomDetails', () => {
    spyOn(meetingService, 'getAvailableRooms').and.callThrough();
    component.bookingForm.patchValue({
      meetingDate: '2023-06-10',
      startTime: '10:00',
      endTime: '11:00'
    });
    component.checkRoomAvailability();
    expect(meetingService.getAvailableRooms).toHaveBeenCalled();
  });
  
  it('should unsubscribe from subscriptions on destroy', () => {
    spyOn(component.roomsSub, 'unsubscribe').and.callThrough();
    spyOn(component.meetingSub, 'unsubscribe').and.callThrough();
    spyOn(component.bookMeetingSub, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.roomsSub.unsubscribe).toHaveBeenCalled();
    expect(component.meetingSub.unsubscribe).toHaveBeenCalled();
    expect(component.bookMeetingSub.unsubscribe).toHaveBeenCalled();
  });
});
