'use client';

import React from 'react';
import CustomerForm from '../_components/CustomerForm';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const searchParams = useSearchParams();
    const activityId = searchParams.get('activityId') || '';
    const selectedSeatId = searchParams.get('selectedSeatId') || '';

    return (
        <>
            <CustomerForm activityId={activityId} selectedSeatId={selectedSeatId} />
        </>
    );
}

export default Page;
