"use client";

import React, { act, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import screen from '@/app/public/images/perde.svg';
import agent from '../api/agent';
import { EventHall } from '../models/eventHall';
import { SeatModel } from '../models/seatModel';
import Seat from './Seat';
import { Activity } from '../models/activity';

interface SeatSelectionProps {
  activityId: string;
}

const SeatSelection = ({ activityId }: SeatSelectionProps) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [eh, setEh] = useState<EventHall | null>(null);
  const [seats, setSeats] = useState<SeatModel[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<SeatModel | null>(null); 
  const [isClient, setIsClient] = useState(false); 
  const router = useRouter(); 

  useEffect(() => {
    setIsClient(true); 
  }, []);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const activityDetails = await agent.Activities.details(activityId);
        setActivity(activityDetails);
  
        if (activityDetails?.eventHallId) { 
          const ehDetails = await agent.EventHalls.details(activityDetails.eventHallId);
          setEh(ehDetails);
  
          const seatList = await agent.Seats.list(activityDetails.eventHallId);
          setSeats(seatList);
        }
      } catch (error) {
        console.error('Error fetching event hall details or seats:', error);
      }
    };
  
    fetchSeats();
  }, [activityId]);

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

  const handleSeatSelect = (seat: SeatModel) => {
    setSelectedSeat(seat); 
  };

  const handleContinue = () => {
    if (isClient && selectedSeat) {
      router.push(`/form-page?selectedSeatId=${selectedSeat.id}`); 
    }
  }

  return (
    <div className="py-12">
      {eh && (
        <div className="event-hall-details items-center justify-center">
          <h2 className="text-xl font-bold text-center">{eh.title}</h2>
        </div>
      )}
      {selectedSeat && (
        <div className="flex flex-col gap-2 text-base justify-center items-center mt-4">
          <p>Seçilen Koltuk: {selectedSeat.label}</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded" 
            onClick={handleContinue}
          >
            Devam Et
          </button>
        </div>
      )}
      <Image 
        src={screen} 
        alt="Perde"
        className="items-center justify-center w-full"
      />
      <div 
        className="seat-container grid gap-2 my-10 justify-center items-center justify-items-center" 
        style={{
          gridTemplateColumns: `repeat(${eh?.columns || 0}, minmax(3rem, 1fr))`,
          justifyContent: 'center', 
          justifyItems: 'center',   
          alignItems: 'center',     
        }}
      >
        {seatingChart.map((row, rowIndex) => (
          row.map((seat, colIndex) => (
            seat ? (
              <Seat 
                key={`${rowIndex}-${colIndex}`} 
                label={seat.label} 
                onClick={() => handleSeatSelect(seat)} 
              />
            ) : (
              <div key={`${rowIndex}-${colIndex}`} className="w-12 h-16 bg-transparent" /> 
            )
          ))
        ))}
      </div>
    </div>
  );
}

export default SeatSelection;