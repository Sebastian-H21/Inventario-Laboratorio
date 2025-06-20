import { useState } from "react";

const images = [
    { src: "it1.jpg", alt: "Logo1" },
    { src: "it2.jpg", alt: "Logo2" },
    { src: "it3.jpg", alt: "Logo3" },
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className="relative w-full bg-white dark:bg-gray-800">
        <div className="relative h-56 overflow-hidden rounded-lg md:h-90 ">
            {images.map((img, index) => (
            <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-100 z-20" : "opacity-0 z-10"
                }`}
            >
                <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover" 
                />
            </div>
            ))}
        </div>

        {/* Indicadores */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
            {images.map((_, index) => (
            <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                }`}
                aria-label={`Ir al slide ${index + 1}`}
            ></button>
            ))}
        </div>

        {/* Botón Anterior */}
        <button
            onClick={prevSlide}
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 group"
        >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/50 group-hover:bg-white/80">
            <svg
                className="w-4 h-4 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
            >
                <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
                />
            </svg>
            </span>
        </button>

        {/* Botón Siguiente */}
            <button
                onClick={nextSlide}
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 group"
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/50 group-hover:bg-white/80">
                <svg
                    className="w-4 h-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                >
                    <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                    />
                </svg>
                </span>
            </button>
        </div>
    );
};

export default Home;
