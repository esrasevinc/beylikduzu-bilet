'use client';

import React from 'react';
import CustomerForm from '../_components/CustomerForm';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const searchParams = useSearchParams();
    const activityId = searchParams.get('activityId') || '';
    const seatId = searchParams.get('seatId') || '';

    return (
        <>
            <CustomerForm selectedSeatId={seatId} activityId={activityId} />
        </>
    );
}

export default Page;
