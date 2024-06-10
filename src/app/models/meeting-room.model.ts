import { Time } from "@angular/common"

export class MeetingRoomModel{
id!:number 
name!: string
}

export class BookMeetingRoomModel{
    
    date!:Date | string
    startTime!:Time |string
    endTime!:Time | string
    userName!:string 
    meetingRoom!:string 
    agenda!:string 
}