import React from 'react'
import CustomerForm from '../_components/CustomerForm'
import { useRouter } from 'next/router';

const page = () => {

    const { query } = useRouter();
    const selectedSeatId = query.selectedSeatId as string;
    
  return (
    <>
        <CustomerForm selectedSeatId={selectedSeatId} />
    </>
  )
}

export default page