import React from 'react'

interface SeatProps {
    label: string;
    onClick?: () => void; 
  }

const Seat = ({ label, onClick }: SeatProps) => {
  return (
    <div 
        className="seat cursor-pointer bg-gray-200 rounded-t-lg rounded-b-full h-16 w-12 shadow-md flex justify-center items-center"
        onClick={onClick}
        >
            <span className="text-xs font-bold">{label}</span>
    </div>
  )
}

export default Seat