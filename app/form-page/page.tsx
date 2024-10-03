import React from 'react';
import CustomerForm from '../_components/CustomerForm';
import { useRouter } from 'next/router';

const Page = () => {
    const { query } = useRouter();
    const activityId = typeof query.activityId === 'string' ? query.activityId : '';
    const seatId = typeof query.seatId === 'string' ? query.seatId : '';

    return (
        <>
            <CustomerForm selectedSeatId={seatId} activityId={activityId} />
        </>
    );
}

export default Page;
