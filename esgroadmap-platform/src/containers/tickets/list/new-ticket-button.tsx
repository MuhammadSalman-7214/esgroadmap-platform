'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const NewTicketButton = () => {
  const router = useRouter()
  return (
    <button
      className="w-fit md:py-2 px-5 rounded-sm text-[12px] md:text-[15px] py-1 text-white"
      style={{ background: 'rgb(25, 56, 57)' }}
      onClick={() => {
        router.push('/dashboard/tickets/new')
      }}
    >
      New Ticket
    </button>
  )
}

export default NewTicketButton
