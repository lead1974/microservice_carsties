import EmptyFilter from '@/app/components/EmptyFilter'
import React from 'react'

export default function Page({searchParams}: {searchParams: {callbackUrl: string}}) {
  return (
    <EmptyFilter 
        title='Unauthorized'
        subtitle='Please login to continue'
        showLogin
        callbackUrl={searchParams.callbackUrl}
    />
  )
}
