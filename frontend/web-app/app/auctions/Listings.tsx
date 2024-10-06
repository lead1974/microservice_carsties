'use client'

import React, { useEffect, useState } from 'react'
import { getData } from '../actions/auctionActions';
import AuctionCard from './AuctionCard';
import { Auction,PagedResult } from '@/types';
import AppPagination from '../components/AppPagination';
import Filters from './Filters';
import { useShallow } from 'zustand/shallow';
import { useParamsStore } from '@/hooks/useParamsStore';
import qs from 'query-string';
import EmptyFilter from '../components/EmptyFilter';


 function Listings() {
  const [loading, setLoading] = useState(true);
  // const [auctions,setAuctions] = useState<Auction[]>([]);
  // const [pageCount,setPageCount] = useState(0);
  // const [pageNumber,setPageNumber] = useState(1);

  const [data, setData] = useState<PagedResult<Auction>>();
  const params = useParamsStore(useShallow(state => ({
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    searchTerm: state.searchTerm,
    orderBy: state.orderBy,
    filterBy: state.filterBy,
    seller: state.seller,
    winner: state.winner
    })));

  const setParams = useParamsStore(state => state.setParams);
  const url = qs.stringifyUrl({ url: '', query: params })
  function setPageNumber(pageNumber: number) {
    setParams({ pageNumber })
  }

  useEffect(() => {
    getData(url).then(data => {
        setData(data);
        setLoading(false);
    })
}, [url, setData])

if (loading) return <h3>Loading...</h3>

  return (
    <>
    <Filters/>
    {data?.totalCount===0? <EmptyFilter showReset={true} /> : 
    (<>
      <div className='grid grid-cols-4 gap-6'>
        {data?.results.map((auction) => (
            <AuctionCard auction={auction} key={auction.id} />
        ))}
      </div>
      <div className='flex justify-center mt-4'>
        <AppPagination pageChanged={setPageNumber} currentPage={params.pageNumber} pageCount={data!.pageCount} />
      </div>
    </>) }


    </>
  )
}

export default Listings