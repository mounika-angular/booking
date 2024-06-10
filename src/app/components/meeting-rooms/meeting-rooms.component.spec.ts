import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { BookMeetingRoomModel, MeetingRoomModel } from 'src/app/models/meeting-room.model';
import { MeetingRoomService } from 'src/app/service/meeting-room.service';
import { BookMeetingDialogComponent } from './book-meeting-dialog/book-meeting-dialog.component';

import { MeetingRoomsComponent } from './meeting-rooms.component';

class MockMeetingRoomService{
  getMeetingRooms() {
    return of([]);
  }

  currentMeetings() {
    return of([]);
}
deleteMeeting(event:any){
  return of({success:true})
}
}

class MockToastrService {
  success(message: string) {}
  error(message: string) {}
}

describe('MeetingRoomsComponent', () => {
  let component: MeetingRoomsComponent;
  let fixture: ComponentFixture<MeetingRoomsComponent>;
  let meetingService: MeetingRoomService;
  let toastr: ToastrService;
  let router:Router;
  let dialog:MatDialog
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingRoomsComponent],
      imports:[MatDialogModule],
      providers:[
        { provide: MeetingRoomService, useClass: MockMeetingRoomService },
        { provide: ToastrService, useClass: MockToastrService },
        {provide:Router,useValue:{navigate:jasmine.createSpy('navigate')}},
        { provide: MatDialog, useValue: { open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of({}) }) } }
      ]
    });
    fixture = TestBed.createComponent(MeetingRoomsComponent);
    component = fixture.componentInstance;
    meetingService = TestBed.inject(MeetingRoomService);
    toastr = TestBed.inject(ToastrService);
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize username from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('Test User');
    component.ngOnInit();
    expect(component.username).toBe('Test User');
  });

  it('should call getMeetings and getRooms on init', () => {
    spyOn(component, 'getMeetings').and.callThrough();
    spyOn(component, 'getRooms').and.callThrough();
    component.ngOnInit();
    expect(component.getMeetings).toHaveBeenCalled();
    expect(component.getRooms).toHaveBeenCalled();
  });

  it('should call meetingService.getMeetingRooms and update meetingRooms', () => {
    const mockRooms: MeetingRoomModel[] = [{ id: 1, name: 'Room 1' }];
    spyOn(meetingService, 'getMeetingRooms').and.returnValue(of(mockRooms));
    component.getRooms();
    expect(meetingService.getMeetingRooms).toHaveBeenCalled();
    expect(component.meetingRooms).toEqual(mockRooms);
  });


  it('should open dialog and call getMeetings after dialog is closed', () => {
    spyOn(component, 'getMeetings').and.callThrough();
    component.bookMeeting();
    expect(dialog.open).toHaveBeenCalledWith(BookMeetingDialogComponent, jasmine.any(Object));
    expect(component.getMeetings).toHaveBeenCalled();
  });

  it('should navigate to login on logout', () => {
    component.logout();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });


  it('should unsubscribe from subscriptions on destroy', () => {
    spyOn(component.delMeetingSub, 'unsubscribe').and.callThrough();
    spyOn(component.meetingSub, 'unsubscribe').and.callThrough();
    spyOn(component.roomsSub, 'unsubscribe').and.callThrough();
    component.ngOnDestroy();
    expect(component.delMeetingSub.unsubscribe).toHaveBeenCalled();
    expect(component.meetingSub.unsubscribe).toHaveBeenCalled();
    expect(component.roomsSub.unsubscribe).toHaveBeenCalled();
  });

});
