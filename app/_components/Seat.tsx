import React from 'react';

interface SeatProps {
  label: string;
  status: string;
  onClick?: () => void; 
  isSelected?: boolean; 
}

const Seat = ({ label, status, onClick, isSelected }: SeatProps) => {

  const backgroundColor = isSelected
    ? 'bg-blue-200' 
    : status === 'Dolu'
    ? 'bg-green-200' 
    : 'bg-gray-200'; 

  return (
    <div 
      className={`seat cursor-pointer rounded-t-lg rounded-b-full h-16 w-12 shadow-md flex justify-center items-center ${backgroundColor}`}
      onClick={status === 'Dolu' ? undefined : onClick}
      style={{ cursor: status === 'Dolu' ? 'auto' : 'pointer' }}
    >
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
};

export default Seat;
