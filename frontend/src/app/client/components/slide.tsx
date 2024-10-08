import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSpring, animated } from 'react-spring';

interface SlideProps {
  children: React.ReactNode[];
  onPrev: () => void;
  onNext: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  error: string | null;
  isConfirmPage: boolean;
}

const Slide: React.FC<SlideProps> = ({
  children,
  onPrev,
  onNext,
  currentQuestionIndex,
  totalQuestions,
  error,
  isConfirmPage,
}) => {
  const props = useSpring({
    transform: `translateX(-${currentQuestionIndex * 100}%)`,
    config: { tension: 280, friction: 60 },
  });

  return (
    <div className='relative bg-white shadow-md rounded-lg p-6 overflow-hidden'>
      <animated.div style={props} className='flex'>
        {React.Children.map(children, (child, index) => (
          <div key={index} className='w-full flex-shrink-0'>
            {child}
          </div>
        ))}
      </animated.div>
      <div className='flex justify-between items-center mt-4'>
        <button
          onClick={onPrev}
          disabled={currentQuestionIndex === 0}
          className='bg-[#2F41B0] hover:bg-[#5A73D7] text-white font-bold py-2 px-4 rounded disabled:opacity-50'
        >
          <ChevronLeft />
        </button>
        {!isConfirmPage && (
          <>
            <div className='flex space-x-2'>
              {Array.from({ length: totalQuestions }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentQuestionIndex ? 'bg-[#2F41B0]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onNext}
              className='bg-[#2F41B0] hover:bg-[#5A73D7] text-white font-bold py-2 px-4 rounded'
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
      {error && <p className='text-red-500 text-center mt-2'>{error}</p>}
    </div>
  );
};

export default Slide;
