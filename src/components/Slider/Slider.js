import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { sliderData } from './slide-data'
import styles from './Slider.module.scss'

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const slideLength = sliderData.length;

    const autoScroll = true;
    let slideInterval;
    let intervalTime = 5000;

    const nextSlide = () => {
        setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1)
    };
    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1)
    };

    useEffect(() => {
        setCurrentSlide(0)
    }, [])

    useEffect(() => {
        if (autoScroll) {
            const auto = () => {
                slideInterval = setInterval(nextSlide, intervalTime);
            };
            auto();
        }
        return () => clearInterval(slideInterval);
    }, [currentSlide, slideInterval, autoScroll]);

    
    return (
        <div className={styles.slider}>
            <MdOutlineKeyboardArrowLeft className={`${styles.arrow} ${styles.prev}`} onClick={prevSlide} />
            <MdOutlineKeyboardArrowRight className={`${styles.arrow} ${styles.next}`} onClick={nextSlide} />
            {sliderData.map((slide, index) => {
                const { image, heading, desc } = slide
                return (
                    <div key={index} className={index === currentSlide ? `${styles.slide} ${styles.current}` : `${styles.slide}`}>
                        {index === currentSlide && (
                            <>
                                <img src={image} alt="slide" />
                                <div className={styles.content}>
                                    <h2>{heading}</h2>
                                    <p>{desc}</p>
                                    <hr />
                                    <a href='#product' className='--btn --btn-primary'>
                                        Shop Now
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default Slider