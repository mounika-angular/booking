import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MeetingRoomService } from './meeting-room.service';
import { BookMeetingRoomModel, MeetingRoomModel } from '../models/meeting-room.model';

describe('MeetingRoomService', () => {
  let service: MeetingRoomService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MeetingRoomService]
    });
    service = TestBed.inject(MeetingRoomService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch meeting rooms', () => {
    const mockMeetingRooms: MeetingRoomModel[] = [
      { id: 1, name: 'Room 1' },
      { id: 2, name: 'Room 2' }
    ];

    service.getMeetingRooms().subscribe((rooms) => {
      expect(rooms.length).toBe(2);
      expect(rooms).toEqual(mockMeetingRooms);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/meeting-rooms`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMeetingRooms);
  });

  it('should book a meeting room', () => {
    const mockBooking: BookMeetingRoomModel = {

      userName: 'John Doe',
      meetingRoom: 'Room 1',
      agenda: 'Project Discussion',
      date: '2023-06-10',
      startTime: '10:00',
      endTime: '11:00'
    };

    service.bookMeetingRoom(mockBooking).subscribe((response) => {
      expect(response).toEqual(mockBooking);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/bookings`);
    expect(req.request.method).toBe('POST');
    req.flush(mockBooking);
  });

  it('should fetch current meetings', () => {
    const mockMeetings: BookMeetingRoomModel[] = [
      {
  
        userName: 'John Doe',
        meetingRoom: 'Room 1',
        agenda: 'Project Discussion',
        date: '2023-06-10',
        startTime: '10:00',
        endTime: '11:00'
      }
    ];

    service.currentMeetings().subscribe((meetings) => {
      expect(meetings.length).toBe(1);
      expect(meetings).toEqual(mockMeetings);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/bookings`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMeetings);
  });

  it('should delete a meeting', () => {
    const meetingId = 1;

    service.deleteMeeting(meetingId).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/bookings/${meetingId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
