// C:\Users\ki3ic\BC10\private\jikken\my-app\src\app\pages\requiredfield\page.tsx
'use client';
import React, { useState } from 'react';
import Q1 from '@/app/client/components/q1';
import Q2 from '@/app/client/components/q2';
import Q3 from '@/app/client/components/q3';
import Q4 from '@/app/client/components/q4';
import Confirm from '@/app/client/components/confirm';
import Slide from '@/app/client/components/slide';
import Result from '@/app/client/components/result';

const RequiredFieldPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const questions = [Q1, Q2, Q3, Q4];

  const handleNext = () => {
    const currentAnswer =
      answers[`q${currentQuestionIndex + 1}` as keyof typeof answers];
    if (currentAnswer || currentQuestionIndex >= questions.length) {
      setError(null);
      if (currentQuestionIndex < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } else {
      setError('選択肢を選んでください。');
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setError(null);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [`q${currentQuestionIndex + 1}`]: option });
    if (currentQuestionIndex < questions.length - 1) {
      handleNext();
    }
  };

  const handleSearch = () => {
    setShowResult(true);
  };

  const handleResetSearch = () => {
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setAnswers({
      q1: '',
      q2: '',
      q3: '',
      q4: '',
    });
  };

  const handleEditSearch = () => {
    setShowResult(false);
    setCurrentQuestionIndex(0);
    // answers はリセットしない
  };

  const isConfirmPage = currentQuestionIndex === questions.length;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-lg p-4 mb-8 border-4 border-blue-500 rounded-md text-center bg-white shadow-md'>
        <p className='text-lg text-gray-700'>
          あなたにピッタリのOMIYAGEを見つけましょう！
        </p>
      </div>
      <div className='w-full max-w-lg'>
        {showResult ? (
          <Result
            answers={answers}
            onResetSearch={handleResetSearch}
            onEditSearch={handleEditSearch} // 新しい関数を渡す
          />
        ) : (
          <Slide
            onPrev={handlePrev}
            onNext={handleNext}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            error={error}
            isConfirmPage={isConfirmPage}
          >
            {questions.map((QuestionComponent, index) => (
              <QuestionComponent
                key={index}
                onNext={handleOptionSelect}
                selectedOption={
                  answers[`q${index + 1}` as keyof typeof answers]
                }
                setSelectedOption={(option) =>
                  setAnswers({ ...answers, [`q${index + 1}`]: option })
                }
              />
            ))}
            <Confirm answers={answers} onSearch={handleSearch} />
          </Slide>
        )}
      </div>
    </div>
  );
};

export default RequiredFieldPage;
