import React from 'react'

export default function Dates({InvoiceDate,InvoiceNumber}) {
  return (
    <>
    <article className="mt-10 mb-14 flex items-center justify-end">
          <ul>
            <li className='p-1'><span className="font-bold">Invoice number:</span>{InvoiceNumber} </li>
            <li className='bg-gray-100'><span className="font-bold">Invoice date:</span>{InvoiceDate} </li>
            
            
          </ul>
    </article>
    </>
  )
}
