import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./CarouselComponent.scss";

const CarouselComponent = ({
    children,
    desktopItems = '3',
    mobileItems = '1',
    tabletItems = '2',
    partialVisible = false,
    partialVisibilityGutter = '40',
    scrollingStatus = () => { },
    autoplay = false,
    infinite = true
}) => {
    const [isInView, setIsInView] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        if (autoplay) {
            const observer = new IntersectionObserver(([entry]) => {
                setIsInView(entry.isIntersecting);
            }, { threshold: 0 });
            if (carouselRef.current) {
                observer.observe(carouselRef.current)
            }
            return () => {
                if (carouselRef.current) {
                    observer.unobserve(carouselRef.current);
                }
            }
        }
    }, [])
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: parseInt(desktopItems),
            partialVisibilityGutter: parseInt(partialVisibilityGutter),
        },
        mobile: { breakpoint: { max: 767, min: 0 }, items: parseInt(mobileItems) },
        tablet: { breakpoint: { max: 1024, min: 768 }, items: parseInt(tabletItems) },
    };
    const CustomDot = ({ onMove, index, onClick, active }) => {
        return (
            <li
                className={active ? "active" : "inactive"}
                onClick={() => onClick()}
            ></li>
        );
    };

    const afterChange = () => {
        scrollingStatus(false)
    };

    const beforeChange = () => {
        scrollingStatus(true)
    };

    return (
        // <!-- Main Carousel Section Start -->
        <div id="main-slide" className="carousel slide" data-ride="carousel" ref={carouselRef}>
            <div className="carousel-inner">
                <Carousel
                    responsive={responsive}
                    additionalTransfrom={0}
                    arrows={false}
                    centerMode={false}
                    className=""
                    dotListClass="custom-carousel-dot"
                    draggable
                    focusOnSelect={false}
                    infinite={infinite}
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    partialVisible={partialVisible}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    showDots
                    sliderClass=""
                    slidesToSlide={1}
                    swipeable
                    customDot={<CustomDot />}
                    afterChange={afterChange}
                    beforeChange={beforeChange}
                    autoPlay={isInView}
                    autoPlaySpeed={2000}
                >
                    {children}
                </Carousel>
            </div>
        </div>
        /* <!-- Main Carousel Section End --> */
    );
};

export default CarouselComponent;
