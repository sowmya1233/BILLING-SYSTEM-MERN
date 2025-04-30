import React from 'react'

export default function Table({ list, total }) {
  return (
    <>
      <table width="100%" className='mb-10'>
        <thead>
          <tr className='bg-gray-100 p-1'>
            <td className='font-bold'>Code</td>
            <td className='font-bold'>Product Name</td>
            <td className='font-bold'>Quantity</td>
            <td className='font-bold'>Price</td>
            <td className='font-bold'>GST</td>
            <td className='font-bold'>Amount</td>
          </tr>
        </thead>
        {list.map(({ id, code, productname, quantity, price, gst, amount }) => (
          <React.Fragment key={id}>
            <tbody>
              <tr className="border-b border-gray-200">
                <td>{code}</td>
                <td>{productname}</td>
                <td>{quantity}</td>
                <td>{price}</td>
                <td>{gst}</td>
                <td>{amount}</td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
      <div>
        <h2 className='flex items-end justify-end text-gray-800 text-4xl font-bold'>
          Rs.{total.toLocaleString()}
        </h2>
      </div>
    </>
  )
}
