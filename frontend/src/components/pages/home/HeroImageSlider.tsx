// src/components/pages/home/HeroImageSlider.tsx

import watarOne from "../../../assets/hero/watarThree.jpg";
import gasOne from "../../../assets/hero/gasOne.jpg";
import watarTwo from "../../../assets/hero/watarTwo.jpg";
import roadOne from "../../../assets/hero/roadOne.jpg";
import gasTwo from "../../../assets/hero/gasTwo.jpg";
import metro from "../../../assets/hero/metro.jpg";

interface HeroImage {
  id: number;
  image: string; 
}

const heroImage: HeroImage[] = [
  { id: 0, image: metro },
  { id: 1, image: watarOne },
  { id: 2, image: gasOne },
  { id: 3, image: watarTwo },
  { id: 4, image: roadOne },
  { id: 5, image: gasTwo },
];

const HeroImageSlider = () => {
  return (
    <div className="absolute top-20 left-0 w-full h-150 overflow-hidden">
      <div className="flex animate-slide">
        {[...heroImage, ...heroImage].map((img, index) => (
          <div
            key={`{index}-${index}`}
            className="shrink-0 w-480 h-150"
          >
            <img
              src={img.image}
              alt={`slider-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-slide {
          display: flex;
          width: calc(1920px * 10);
          animation: slide 100s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroImageSlider;