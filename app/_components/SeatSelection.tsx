'use client';

import React, { useEffect, useState } from 'react';
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
  const [ticketSeatId, setTicketSeatId] = useState<string | null>(null); 
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

  const handleSeatSelect = async (seat: SeatModel) => {
    setSelectedSeat(seat);

    try {
      const ticketSeatResponse = await agent.TicketSeats.create({
        id: seat.id,
        seatId: seat.id,
        row: seat.row,
        column: seat.column,
        label: seat.label,
        status: "Boş",
        activityId: activityId,
      });

      console.log('Ticket seat created:', ticketSeatResponse);
      const createdTicketSeatId = ticketSeatResponse.id;
      setTicketSeatId(createdTicketSeatId); 

    } catch (error) {
      console.error('Error creating ticket seat:', error);
    }
  };

  const handleContinue = () => {
    if (isClient && selectedSeat && ticketSeatId) {  
      router.push(`/form-page?activityId=${activityId}&seatId=${ticketSeatId}`);
    }
  }

  return (
    <div className='flex flex-col w-full items-start'>
      <div className='flex flex-row justify-between w-full items-center px-6'>
    <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-[#16a89d]/50 text-white flex items-center justify-center text-3xl font-bold'>1</div>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Etkinlik Detayları</p>
            <p>{activity?.name}</p>
            <p>Etkinlik Süresi: {activity?.duration} dk</p>

          </div>
      </div>
      <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-[#16a89d]/50 text-white flex items-center justify-center text-3xl font-bold'>2</div>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Koltuk Seçimi</p>
            {selectedSeat &&
            <p>Seçilen koltuk: {selectedSeat?.label}</p>}
          </div>
      </div>
      <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-[#16a89d]/50 text-white flex items-center justify-center text-3xl font-bold'>3</div>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Kişisel Bilgiler</p>
          </div>
      </div>
      </div>
     <div className="p-10 rounded-3xl drop-shadow-xl bg-slate-50 text-black ">
      <div className='flex flex-row w-full justify-between items-center'>
      <h1 className='text-3xl items-start font-bold'>Koltuk Seçimi</h1>
      
      {selectedSeat && (
        <div className="flex text-base justify-center items-end">
          <button 
            className="px-4 py-2 bg-[#16a89d] text-white rounded-full text-xl hover:bg-opacity-75" 
            onClick={handleContinue}
          >
            Devam Et
          </button>
        </div>
      )}
      </div>
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
    </div>
  );
}

export default SeatSelection;
