import React from 'react'
import '../../assets/styles/banner.scss'
const Banner = ({children}) => {
  return (
    <div className='banner'>
        {children}
    </div>
  )
}
export default Banner
