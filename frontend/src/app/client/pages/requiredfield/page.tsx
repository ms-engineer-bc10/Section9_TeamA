'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import target from '@/app/client/components/target';
import genre from '@/app/client/components/genre';
import budget from '@/app/client/components/budget';
import quantity from '@/app/client/components/quantity';
import Location from '@/app/client/components/location';
import Confirm from '@/app/client/components/confirm';
import Slide from '@/app/client/components/slide';
import Result from '@/app/client/components/result';
import Loading from '@/app/client/components/loading';
import MenuBar from '@/app/client/components/menubar';

type Answer = '' | string;

interface Answers {
  target: Answer;
  genre: Answer;
  budget: Answer;
  quantity: Answer;
  location: Answer;
  location_type: Answer;
}

const MenuItem: React.FC<{
  icon: React.ElementType;
  label: string;
  href?: string;
}> = ({ icon: Icon, label, href }) => {
  const content = (
    <>
      <Icon size={20} />
      <span className='text-xs mt-0.5'>{label}</span>
    </>
  );

  return href ? (
    <Link
      href={href}
      className='flex flex-col items-center justify-center w-full py-1 text-gray-600 hover:text-blue-500 transition-colors'
    >
      {content}
    </Link>
  ) : (
    <button className='flex flex-col items-center justify-center w-full py-1 text-gray-600 hover:text-blue-500 transition-colors'>
      {content}
    </button>
  );
};

const RequiredFieldPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    location_type: '',
    location: '',
    target: '',
    genre: '',
    budget: '',
    quantity: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // 質問とanswersのキーの対応関係
  const questionKeys = ['location', 'target', 'genre', 'budget', 'quantity'];
  const questions = [Location, target, genre, budget, quantity];

  const handleNext = useCallback(() => {
    const currentAnswer =
      answers[questionKeys[currentQuestionIndex] as keyof Answers];
    if (currentAnswer || currentQuestionIndex >= questions.length) {
      setError(null);
      if (currentQuestionIndex < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } else {
      setError('選択肢を選んでください。');
    }
  }, [currentQuestionIndex, answers, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setError(null);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      const currentQuestionKey = questionKeys[currentQuestionIndex];
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionKey]: option,
      }));

      if (currentQuestionIndex < questions.length - 1) {
        handleNext();
      }
    },
    [currentQuestionIndex, questions.length, handleNext, questionKeys]
  );

  const handleLocationChange = (location: string, location_type: string) => {
    setAnswers((prev) => ({
      ...prev,
      location,
      location_type,
    }));
  };

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {

      const response = await fetch('http://localhost:5000/api/user/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: answers.target,
          genre: answers.genre,
          budget: answers.budget,
          quantity: answers.quantity,
          location: answers.location,
          location_type: answers.location_type,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    setSearchResults(data); // 結果を保存
    setShowResult(true); // 結果を表示
  } catch (error: any) {
    if (error instanceof Error) {
      setError(`検索中にエラーが発生しました: ${error.message}`);
      console.error('APIリクエストエラー:', error.message, error.stack);
    } else {
      setError('検索中にエラーが発生しました。');
      console.error('APIリクエストエラー:', error);
    }
  } finally {
    setIsLoading(false); // ローディング終了
  }
}, [answers]);

  const handleResetSearch = useCallback(() => {
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setAnswers({
      location_type: '',
      location: '',
      target: '',
      genre: '',
      budget: '',
      quantity: '',
    });
  }, []);

  const handleEditSearch = useCallback(() => {
    setShowResult(false);
    setCurrentQuestionIndex(0);
    // answers はリセットしない
  }, []);

  const isConfirmPage = currentQuestionIndex === questions.length;

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-16'>
      <div className='w-full max-w-lg p-4 mb-8 border-4 border-[#2F41B0] rounded-md text-center bg-white shadow-md'>
        <p className='text-lg text-gray-700'>
          あなたにピッタリのOMIYAGEを見つけましょう！
        </p>
      </div>
      <div className='w-full max-w-lg'>
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
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            error={error}
            isConfirmPage={isConfirmPage}
          >
            {questions.map((QuestionComponent, index) => (
              <QuestionComponent
                key={index}
                onNext={handleOptionSelect}
                selectedOption={answers[questionKeys[index] as keyof Answers]}
                setSelectedOption={(option: string) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [questionKeys[index]]: option,
                  }))
                }
                onLocationChange={handleLocationChange}
              />
            ))}
            <Confirm answers={answers} onSearch={handleSearch} />
          </Slide>
        )}
      </div>
      <MenuBar />
    </div>
  );
};

export default RequiredFieldPage;
