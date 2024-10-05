'use client'

import React, { useEffect, useState } from 'react'
import { getData } from '../actions/auctionActions';
import AuctionCard from './AuctionCard';
import { Auction, PagedResult } from '@/types';
import AppPagination from '../components/AppPagination';


async function getAuctionData():Promise<PagedResult<Auction>> {
    const res = await fetch('http://localhost:6001/search?pageSize=4');
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}
 function Listings() {
  const [loading, setLoading] = useState(true);
  const [auctions,setAuctions] = useState<Auction[]>([]);
  const [pageCount,setPageCount] = useState(0);
  const [pageNumber,setPageNumber] = useState(1);

  useEffect(() => {
      getAuctionData().then((data) => {
          setAuctions(data.results);
          setPageCount(data.pageCount);
          setLoading(false); 
      })
  }, [pageNumber]);
  
  if (auctions.length === 0) return <h3>Loading...</h3>

  return (
    <>
    <div className='grid grid-cols-4 gap-6'>
      {auctions.map((auction) => (
          <AuctionCard auction={auction} key={auction.id} />
      ))}
    </div>
    <div className='flex justify-center mt-4'>
      <AppPagination  pageChanged={setPageNumber}
          currentPage={1} pageCount={pageCount} />
    </div>
    </>
  )
}

export default Listings