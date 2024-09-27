"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import screen from '@/app/images/perde.svg';
import agent from '../api/agent';
import { EventHall } from '../models/eventHall';
import { SeatModel } from '../models/seatModel';
import Seat from './Seat';

interface EventHallProps {
  eventHallId: string;
}

const Salon = ({ eventHallId }: EventHallProps) => {
  const [eh, setEh] = useState<EventHall | null>(null);
  const [seats, setSeats] = useState<SeatModel[]>([]);

  useEffect(() => {
    const fetchEventHallDetails = async () => {
      try {
        const ehDetails = await agent.EventHalls.details(eventHallId);
        setEh(ehDetails);
    
        const seatList = await agent.Seats.list(eventHallId);
        setSeats(seatList);
      } catch (error) {
        console.error('Error fetching event hall details or seats:', error);
      }
    };

    fetchEventHallDetails();
  }, [eventHallId]);

  const createSeatingChart = (): (SeatModel | null)[][] => {
    if (!eh) return []; 
    const seatingChart: (SeatModel | null)[][] = Array.from({ length: eh.rows }, () => 
      Array.from({ length: eh.columns }, () => null)
    );

    seats.forEach(seat => {
      const { row, column, status } = seat;
      if (status === 'Koltuk' && row < eh.rows && column < eh.columns) {
        seatingChart[row][column] = seat; 
      }
    });

    return seatingChart;
  };

  const seatingChart = createSeatingChart();

  return (
    <div className="py-12">
      {eh && (
        <div className="event-hall-details items-center justify-center">
          <h2 className="text-xl font-bold text-center">{eh.title}</h2>
        </div>
      )}
      <Image 
        src={screen} 
        alt="Perde"
        className="items-center justify-center w-full"
      />
      <div className="seat-container grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-2 my-10 items-center justify-center w-full">
        {seatingChart.map((row, rowIndex) => (
          row.map((seat, colIndex) => (
            seat ? (
              <Seat key={`${rowIndex}-${colIndex}`} label={seat.label} />
            ) : (
              <div key={`${rowIndex}-${colIndex}`} className="w-12 h-16 bg-transparent" /> // Boş yer
            )
          ))
        ))}
      </div>
      
    </div>
  );
}

export default Salon;
