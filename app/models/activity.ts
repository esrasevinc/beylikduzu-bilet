import { EventHall } from "./eventHall";
import { Place } from "./place";

export interface Activity {
    id: string;
    name: string;
    placeId: string;
    place: Place;
    eventHall: EventHall;
    eventHallId: string;
    date: Date | null;
    description: string;
    duration: string;
    isActive?: boolean;
    isDeleted?: boolean;
    isCancelled?: boolean;
    isPAid?: boolean;
}