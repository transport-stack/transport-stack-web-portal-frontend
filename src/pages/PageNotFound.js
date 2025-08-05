import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import ButtonComponent from '../components/common/ui/button/ButtonComponent';
import '../assets/styles/pagenotfound.scss';

const NotFound = ({header=true}) => {
    const navigate = useNavigate();

    const handleBackClick = ()=>{
        navigate('/');
    }

    return (
        <div>
            {header?<Header />:null}
            <main className="Main">
                <section className="pagenotfound">
                    <h1>Page Not Found</h1>
                    <p>Oops!, the page you are looking for does not exist.</p>
                    <ButtonComponent type='primaryWhite' onClick={()=>handleBackClick()}>Back to Homepage</ButtonComponent>
                </section>
            </main>
            <Footer />
        </div>
    )
}
NotFound.propTypes = {
    header: PropTypes.bool,
  };

export default NotFound
