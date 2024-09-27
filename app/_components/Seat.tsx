import Link from 'next/link'
import React from 'react'

interface SeatProps {
    label: string;
  }

const Seat = ({ label }: SeatProps) => {
  return (
    <Link 
        className="seat bg-gray-200 rounded-t-lg rounded-b-full h-16 w-12 shadow-md flex justify-center items-center"
        href="/"
        >
            <span className="text-xs font-bold">{label}</span>
    </Link>
  )
}

export default Seat