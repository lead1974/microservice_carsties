'use client'

import { Button } from 'flowbite-react';
import React, { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Input from '../components/Input';
import DateInput from '../components/DateInput';
import { createAuction, updateAuction } from '../actions/auctionActions';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Auction } from '@/types';
import { BsStopwatchFill } from 'react-icons/bs';
import { AiOutlineClockCircle } from 'react-icons/ai';

type Props = {
    auction?: Auction
}

export default function AuctionForm({ auction }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const { control, handleSubmit, setFocus, reset,
        formState: { isSubmitting, isValid } } = useForm({
            mode: 'onTouched'
        });

    useEffect(() => {
        if (auction) {
            const { make, model, color, mileage, year, imageUrl } = auction;
            reset({ make, model, color, mileage, year, imageUrl });
        }
        setFocus('make');
    }, [setFocus, reset, auction])

    async function onSubmit(data: FieldValues) {
        // toast.success('data...' + data.imageUrl);
        try {
            let id = '';
            let res;
            if (pathname === '/auctions/create') {
                res = await createAuction(data);
                id = res.id;
                toast.success('auction listing created succesfully');
            } else {
                if (auction) {
                    console.log('update ' + data );
                    res = await updateAuction(data, auction.id);
                    id = auction.id;
                    toast.success('auction listing updated succesfully');
                }
            }
            if (res.error) {
                // toast.error('crud actions error: ' + ' ' + res.error)
                 throw res.error;
            }
            router.push(`/auctions/details/${id}`)
        } catch (error: any) {
            toast.error(error.status + ' ' + error.message)
        }
    }

    return (
        <form className='flex flex-col mt-3' onSubmit={handleSubmit(onSubmit)}>
            <Input label='Make' name='make' control={control}
                rules={{ required: 'Make is required' }} />
            <Input label='Model' name='model' control={control}
                rules={{ required: 'Model is required' }} />
            <Input label='Color' name='color' control={control}
                rules={{ required: 'Color is required' }} />

            <div className='grid grid-cols-2 gap-3'>
                <Input label='Year' name='year' control={control} type='number'
                    rules={{ required: 'Year is required' }} />
                <Input label='Mileage' name='mileage' control={control} type='number'
                    rules={{ required: 'Model is required' }} />
            </div>

            {pathname === '/auctions/create' &&
            <>
                <Input label='Image URL' name='imageUrl' control={control}
                    rules={{ required: 'Image URL is required' }} />
                <div className='grid grid-cols-2 gap-3'>
                    <Input label='Reserve Price (enter 0 if no reserve)'
                        name='reservePrice' control={control} type='number'
                        rules={{ required: 'Reserve price is required' }} />
                    <DateInput
                        label='Auction end date/time'
                        name='auctionEnd'
                        control={control}
                        dateFormat='dd MMMM yyyy h:mm a'
                        showTimeSelect
                        icon={< AiOutlineClockCircle  />}
                        rules={{ required: 'Auction end date is required' }} />
                </div>
            </>}


            <div className='flex justify-between'>
                <Button outline color='gray'>Cancel</Button>
                <Button
                    isProcessing={isSubmitting}
                    disabled={!isValid}
                    type='submit'
                    outline color='success'>Submit</Button>
            </div>
        </form>
    )
}
