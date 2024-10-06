'use client';

import React, { useState, useCallback } from 'react';
import Q1 from '@/app/client/components/q1';
import Q2 from '@/app/client/components/q2';
import Q3 from '@/app/client/components/q3';
import Q4 from '@/app/client/components/q4';
import Q5 from '@/app/client/components/q5';
import Confirm from '@/app/client/components/confirm';
import Slide from '@/app/client/components/slide';
import Result from '@/app/client/components/result';
import Loading from '@/app/client/components/loading';

type Answer = '' | string;

interface Answers {
  q1: Answer;
  q2: Answer;
  q3: Answer;
  q4: Answer;
  q5: Answer;
}

const Search: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    q5: '',
    q1: '',
    q2: '',
    q3: '',
    q4: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const steps = [
    { component: Q5, key: 'q5' },
    { component: Q1, key: 'q1' },
    { component: Q2, key: 'q2' },
    { component: Q3, key: 'q3' },
    { component: Q4, key: 'q4' },
    { component: Confirm, key: 'confirm' },
  ];

  const handleNext = useCallback(() => {
    const currentQuestionKey = steps[currentStep].key as keyof Answers;
    if (currentStep < steps.length - 1) {
      if (answers[currentQuestionKey]) {
        setError(null);
        setCurrentStep((prev) => prev + 1);
      } else {
        setError('選択してください');
      }
    }
  }, [currentStep, answers, steps.length]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setError(null);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      const currentQuestionKey = steps[currentStep].key as keyof Answers;
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionKey]: option,
      }));
      setError(null);
    },
    [currentStep, steps]
  );

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          place: answers.q5,
          recipient: answers.q1,
          category: answers.q2,
          price: answers.q3,
          quantity: answers.q4,
          location: '35.681236,139.767125', // ダミーの位置情報
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
      setShowResult(true);
    } catch (error) {
      setError('検索中にエラーが発生しました。');
      console.error('APIリクエストエラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, [answers]);

  const handleResetSearch = useCallback(() => {
    setShowResult(false);
    setCurrentStep(0);
    setAnswers({
      q5: '',
      q1: '',
      q2: '',
      q3: '',
      q4: '',
    });
    setError(null);
  }, []);

  const handleEditSearch = useCallback(() => {
    setShowResult(false);
    setCurrentStep(0);
    setError(null);
  }, []);

  return (
    <div className='bg-gray-100'>
      <div className='w-full max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden'>
        {isLoading ? (
          <Loading />
        ) : showResult ? (
          <Result
            answers={answers}
            searchResults={searchResults}
            onResetSearch={handleResetSearch}
            onEditSearch={handleEditSearch}
          />
        ) : (
          <Slide
            onPrev={handlePrev}
            onNext={handleNext}
            currentQuestionIndex={currentStep}
            totalQuestions={steps.length - 1}
            error={error}
            isConfirmPage={currentStep === steps.length - 1}
          >
            {steps.map(({ component: StepComponent, key }, index) => (
              <div
                key={key}
                style={{ display: currentStep === index ? 'block' : 'none' }}
              >
                {key === 'confirm' ? (
                  <Confirm answers={answers} onSearch={handleSearch} />
                ) : (
                  <StepComponent
                    onNext={handleOptionSelect}
                    selectedOption={answers[key as keyof Answers]}
                    setSelectedOption={(option: string) =>
                      handleOptionSelect(option)
                    }
                  />
                )}
              </div>
            ))}
            {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
          </Slide>
        )}
      </div>
    </div>
  );
};

export default Search;
