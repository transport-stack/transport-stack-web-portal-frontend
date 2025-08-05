import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import "../../assets/styles/product.scss";
import Tags from "./Tags";
import BusImage from '../../assets/images/products/bus.jpg';
import MetroImage from '../../assets/images/products/metro.png';
import PassengerCountImage from '../../assets/images/products/passengercount.png';
import ParkingImage from '../../assets/images/products/parking.png';
import RapidImage from '../../assets/images/products/rapidrail.png';
import ETAImage from '../../assets/images/products/eta.png';
import JourneyImage from '../../assets/images/products/journey.png';
import TicketingImage from '../../assets/images/products/ticket.png';
import { downloadFileAPI } from "../../services/apiservices";

const Product = ({ data, onClick }) => {
  const [productImage, setProductImage] = useState('');
  useEffect(() => {
    const determineFallbackImage = (name) => {
      if (name.includes('Parking')) return ParkingImage;
      if (name.includes('count')) return PassengerCountImage;
      if (name.includes('Metro')) return MetroImage;
      if (name.includes('Bus')) return BusImage;
      if (name.includes('ETA Calculator')) return ETAImage;
      if (name.includes('Journey')) return JourneyImage;
      if (name.includes('Ticketing')) return TicketingImage;
      return RapidImage;
    };
  
    const fetchImage = async () => {
      if (data.image) {
        try {
          const response = await downloadFileAPI(
            `/api/dataset/download?key=${encodeURIComponent(data.image)}`,
            'admin',
            false
          );
          const blob = new Blob([response.data], { type: 'image/png' });
          const blobUrl = URL.createObjectURL(blob);
          setProductImage(blobUrl);
          return;
        } catch (error) {
          console.error('Error loading product image:', error);
        }
      }
  
      const fallbackImage = determineFallbackImage(data.name || '');
      setProductImage(fallbackImage);
    };
  
    fetchImage();
  }, []);

  return (
    <div className="product-card pt-4" onClick={onClick}>
      <Card className=" cursor-pointer">
        <Card.Img variant="top" alt={data.titleName} src={productImage} />
        <Card.Body>
          <Card.Title className="fw-bold" title={data.titleName}>
            {data.name}  {data.sub_name ? ' - ' + data.sub_name
              : ''}
          </Card.Title>
          <Card.Text>{data.description}</Card.Text>
          <Tags name={data.ovalCardData}></Tags>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Product;
