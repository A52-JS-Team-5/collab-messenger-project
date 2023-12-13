import { useState } from "react";
import PropTypes from 'prop-types';

const Carousel = ({ slides }) => {
    let [current, setCurrent] = useState(0);

    return (
        <div className="overflow-hidden max-xl:max-w-xl xl:basis-1/2">
            <div className={`flex transition-transform duration-[600ms] ease-in-out motion-reduce:transition-none`} style={{ transform: `translateX(-${current * 100}%)` }}>
                {slides.map((s) => {
                    return <img src={s} key={s} className="object-contain"/>;
                })}
            </div>
            <div className="py-4 flex justify-center gap-2 w-full">
                {slides.map((s, i) => {
                    return (
                        <div onClick={() => { setCurrent(i); }} key={"circle" + i} className={`rounded-full w-4 h-4 cursor-pointer ${i == current ? "bg-pink" : "border-pink border-2"}`}></div>
                    );
                })}
            </div>
        </div>
    );
}

Carousel.propTypes = {
    slides: PropTypes.array,
};

export default Carousel;