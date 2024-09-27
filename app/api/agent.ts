import axios, { AxiosResponse } from "axios";
import { SeatModel } from "../models/seatModel";
import { EventHall } from "../models/eventHall";

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Seats = {
    list: (eventHallId: string) => requests.get<SeatModel[]>(`/seats/${eventHallId}`),
  }

  const EventHalls = {
    details: (id: string) => requests.get<EventHall>(`/eventhalls/${id}`),
  }


const agent = {
    Seats,
    EventHalls
}

export default agent;