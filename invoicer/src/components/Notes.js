import React from 'react'

export default function Notes({notes}) {
  return (
    <>
    <section className="mt-20 mb-5 w-full flex text-justify">
  <p className="lg:w-1/2 break-words">
    {notes}
  </p>
</section>

    </>
  )
}
