'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import screen from '@/app/public/images/perde.svg';
import agent from '../api/agent';
import { Activity } from '../models/activity';
import { TicketSeat } from '../models/ticketseat';
import Seat from './Seat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import Link from 'next/link';


dayjs.extend(utc);
dayjs.extend(timezone);

interface SeatSelectionProps {
  activityId: string;
}

const SeatSelection = ({ activityId }: SeatSelectionProps) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [seats, setSeats] = useState<TicketSeat[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState<TicketSeat | null>(null); 
  // const { selectedSeat, setSelectedSeat } = useSeat(); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const activityDetails = await agent.Activities.details(activityId);
        setActivity(activityDetails);
        const seatList = await agent.TicketSeats.list(activityId);
        setSeats(seatList);
      } catch (error) {
        console.error('Error fetching event hall details or seats:', error);
      }
    };

    fetchSeats();
  }, [activityId]);

  const createSeatingChart = (): (TicketSeat | null)[][] => {
    if (!activityId) return [];
    const seatingChart: (TicketSeat | null)[][] = Array.from({ length: activity?.eventHall.rows! }, () =>
      Array.from({ length: activity?.eventHall.columns! }, () => null)
    );

    seats.forEach(seat => {
      const { row, column } = seat;
      if (row < activity?.eventHall.rows! && column < activity?.eventHall.columns!) {
        seatingChart[row][column] = seat;
      }
    });

    return seatingChart;
  };

  const seatingChart = createSeatingChart();

  const handleSeatSelect = (seat: TicketSeat) => {
    setSelectedSeat(seat); 
  };

  const handleContinue = () => {
    if (isClient && selectedSeat) { 
      router.push(`/form-page?activityId=${activityId}&selectedSeatId=${selectedSeat.id}`);
    }
  };

  return (
    <div className='flex flex-col w-full items-start'>
      <div className='flex flex-row justify-between w-full items-center px-6'>
        <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-[#16a89d]/50 text-white flex items-center justify-center text-3xl font-bold'>1</div>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Etkinlik Detayları</p>
            <p>{activity?.name}</p>
            <p>{dayjs.utc((activity?.date)).tz('Europe/Istanbul').format('DD.MM.YYYY HH:mm')}</p>
            <p>Etkinlik Yeri: {activity?.place.title!}</p>
            <p>Etkinlik Süresi: {activity?.duration!} dk</p>
          </div>
        </div>
        <div className='flex flex-row items-center justify-center pb-8 gap-4' >
          <Link className='w-16 h-16 rounded-full border-4 border-transparent bg-[#16a89d]/50  text-white flex items-center justify-center text-3xl font-bold' href='/'>2</Link>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Koltuk Seçimi</p>
            {selectedSeat && <p>Seçilen Koltuk: {selectedSeat.label}</p>} 
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
              <div className='flex flex-col font-semibold items-center justify-center gap-2 text-black'>
              <p>Seçilen Koltuk: {selectedSeat.label}</p>
              <button 
                className="px-4 py-2 bg-[#16a89d] text-white rounded-full text-xl hover:bg-opacity-75" 
                onClick={handleContinue}
              >
                Devam Et
              </button>
              </div>
            </div>
          )}
        </div>
        <Image 
          src={screen} 
          alt="Perde"
          className="items-center justify-center w-full"
        />
        <div 
          className="seat-container grid  my-10 justify-center items-center justify-between" 
          style={{
            gridTemplateColumns: `repeat(${activity?.eventHall.columns! || 0}, minmax(3rem, 1fr))`,
            justifyContent: 'center',
            justifyItems: 'center',
            alignItems: 'center',
            gap: '0.1rem'
          }}
        >
          {seatingChart.map((row, rowIndex) => (
            row.map((seat, colIndex) => (
              seat && (
                <Seat 
                  status={seat.status}
                  key={`${rowIndex}-${colIndex}`} 
                  label={seat.label} 
                  onClick={() => handleSeatSelect(seat)} 
                  isSelected={seat.id === selectedSeat?.id}
                />
              ) 
            ))
          ))}
        </div>
        <div className='seat-info flex flex-row items-center justify-center gap-12 w-full mt-20'>
            <div className='flex flex-row items-center justify-center gap-2'>
                <div className='rounded-t-lg rounded-b-full h-12 w-8 shadow-md flex justify-center items-center bg-red-200'></div>
                <p>Dolu Koltuklar</p>
            </div>
            <div className='flex flex-row items-center justify-center gap-2'>
                <div className='rounded-t-lg rounded-b-full h-12 w-8 shadow-md flex justify-center items-center bg-gray-200'></div>
                <p>Boş Koltuklar</p>
            </div>
            <div className='flex flex-row items-center justify-center gap-2'>
                <div className='rounded-t-lg rounded-b-full h-12 w-8 shadow-md flex justify-center items-center bg-green-200'></div>
                <p>Seçiminiz</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
