import React from 'react'
import Header from '../../../components/user/Header'
import Footer from '../../../components/user/Footer'
import ButtonComponent from '../../../components/common/ui/button/ButtonComponent'
import '../../../assets/styles/pagenotfound.scss';
import approvedIcon from "../../../assets/images/approved.png";
import { useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/account/mysubscriptions')
  }
  return (
    <div>
      <Header />
      <main className="Main">
        <section className="pagenotfound">
          <img src={approvedIcon} alt="success"/>
          <h2 className='success-message mb-2'>Payment Successful!</h2>
          <h5 className='mb-2'>Thank you! Your payment has beend received.</h5>
          <ButtonComponent type='primaryWhite' onClick={() => handleClick()}>Subscription Dashboard</ButtonComponent>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default PaymentStatus
