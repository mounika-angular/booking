import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookMeetingRoomModel, MeetingRoomModel } from '../models/meeting-room.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MeetingRoomService {
private apiUrl = 'http://localhost:3000'
  constructor( private http: HttpClient) { }

  getMeetingRooms(): Observable<MeetingRoomModel[]>{
    return this.http.get<MeetingRoomModel[]>(`${this.apiUrl}/meeting-rooms`)
  }
  bookMeetingRoom(data:BookMeetingRoomModel){
    return this.http.post(`${this.apiUrl}/bookings`,data)
  }
currentMeetings(): Observable<BookMeetingRoomModel[]>{
  return this.http.get<BookMeetingRoomModel[]>(`${this.apiUrl}/bookings`)
}
deleteMeeting(id:any){
  return this.http.delete(`${this.apiUrl}/bookings/${id}`)
}
getAvailableRooms(date:string,startTime:string,endTime:string,allRooms:any, currentMeetingsList:any ){
const start = new Date(`2024-01-01T${startTime}:00`);
const end = new Date(`2024-01-01T${endTime}:00`);
  return allRooms.map((room:any) => {
    const meeting = currentMeetingsList.find((meeting:any) => {
    if (meeting.meetingRoom !== room.name || meeting.meetingDate!== date) {
      return false;
    }
    const meetingStart = new Date(`2024-01-01T${meeting.startTime}:00`);
    const meetingEnd = new Date(`2024-01-01T${meeting.endTime}:00`);
    return (
      (start >= meetingStart && start < meetingEnd) ||
      (end > meetingStart && end <= meetingEnd) ||
      (start <= meetingStart && end >= meetingEnd)
    );
  });
  if (meeting) {
    return {
      room,
      status: 'Booked',
      user: meeting.userName,
      agenda: meeting.agenda
    };
  } else {
    return {
      room,
      status: 'Available'
    };
  }
})
}
}
