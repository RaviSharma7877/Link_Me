import React from 'react'
import { useRouter } from 'next/router'

const slug = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    const {slug} = router.query
  return (
    
    <div>{slug}</div>
  )
}

export default slug