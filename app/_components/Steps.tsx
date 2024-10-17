import React from 'react'
import { Activity } from '../models/activity';
import { TicketSeat } from '../models/ticketseat';

interface StepsProps {
    activity: Activity;
    selectedSeat: TicketSeat;
  }

const Steps = ({ activity, selectedSeat }: StepsProps) => {
  return (
    <div className='flex flex-row justify-between w-full items-center px-6'>
        <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-[#16a89d]/50 text-white flex items-center justify-center text-3xl font-bold'>1</div>
          <div className='flex flex-col items-start justify-start text-white'>
            <p className='font-semibold text-2xl'>Etkinlik Detayları</p>
            <p>{activity.name}</p>
            <p>Etkinlik Süresi: {activity.duration!} dk</p>
          </div>
        </div>
        <div className='flex flex-row items-center justify-center pb-8 gap-4'>
          <div className='w-16 h-16 rounded-full border-4 border-[#16a89d]/50 text-white flex items-center justify-center text-3xl font-bold'>2</div>
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
  )
}

export default Steps