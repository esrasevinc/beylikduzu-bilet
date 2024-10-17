'use client'

import { createContext, useContext, useState } from 'react';
import { TicketSeat } from '../models/ticketseat';

const SeatContext = createContext<any>(null);

export const SeatProvider = ({ children }: any) => {
  const [selectedSeat, setSelectedSeat] = useState<TicketSeat | null>(null);

  return (
    <SeatContext.Provider value={{ selectedSeat, setSelectedSeat }}>
      {children}
    </SeatContext.Provider>
  );
};

export const useSeat = () => useContext(SeatContext);
