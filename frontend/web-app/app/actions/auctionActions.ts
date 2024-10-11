'use server'

import { Auction, Bid, PagedResult } from "@/types";
import { revalidatePath } from "next/cache";
import { fetchWrapper } from "@/app/lib/fetchWrapper";
// import { getTokenWorkaround } from "./authActions";

import { FieldValues } from "react-hook-form";

export async function getData(query: string): Promise<PagedResult<Auction>> {
    return await fetchWrapper.get(`search/${query}`)
}
export async function createAuction(data: FieldValues) {
    return await fetchWrapper.post('auctions', data);
}
export async function updateAuction(data: FieldValues, id: string) {
    const res = await fetchWrapper.put(`auctions/${id}`, data);
    revalidatePath(`/auctions/${id}`);
    return res;
}
export async function getDetailedViewData(id: string): Promise<Auction> {
    return await fetchWrapper.get(`auctions/${id}`);
}

export async function deleteAuction(id: string) {
    return await fetchWrapper.del(`auctions/${id}`);
}

export async function getBidsForAuction(id: string): Promise<Bid[]> {
    return await fetchWrapper.get(`bids/${id}`);
}
export async function placeBidForAuction(auctionId: string, amount: number) {
    return await fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`, {})
}

export async function updateAuctionTest() {
    const data = {
        mileage: Math.floor(Math.random() * 100000) + 1
    }
    console.log(data);
    return await fetchWrapper.put('auctions/3659ac24-29dd-407a-81f5-ecfe6f924b9b', data);
    // const res = await fetch('http://localhost:6001/auctions',{
    //     method: 'PUT',
    //     headers:{},
    //     body: JSON.stringify(data)
    // });
    // if (!res.ok) return {status: res.status, error: res.statusText};
    // return await res.json();
}

// export async function getAuctionData(pageNumber: number = 1): Promise<PagedResult<Auction>> {
//     try {
//         const res = await fetch(`http://localhost:6001/search?pageSize=4&pageNumber=${pageNumber}`);
//         if (!res.ok) throw new Error('Failed to fetch data');
//         return res.json();
//     } catch (error) {
//         // You can either return a default value or rethrow the error
//         throw error;
//     }
// }

