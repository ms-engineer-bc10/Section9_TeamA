'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Q1 from '@/app/client/components/q1';
import Q2 from '@/app/client/components/q2';
import Q3 from '@/app/client/components/q3';
import Q4 from '@/app/client/components/q4';
import Q5 from '@/app/client/components/q5';
import Confirm from '@/app/client/components/confirm';
import Slide from '@/app/client/components/slide';
import Result from '@/app/client/components/result';
import Loading from '@/app/client/components/loading';
import MenuBar from '@/app/client/components/menubar';

type Answer = '' | string;

interface Answers {
  q1: Answer;
  q2: Answer;
  q3: Answer;
  q4: Answer;
  q5: Answer;
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
  const questions = [Q5, Q1, Q2, Q3, Q4];

  const handleNext = useCallback(() => {
    const currentAnswer =
      answers[`q${currentQuestionIndex + 1}` as keyof Answers];
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
      setAnswers((prev) => ({
        ...prev,
        [`q${currentQuestionIndex + 1}`]: option,
      }));
      if (currentQuestionIndex < questions.length - 1) {
        handleNext();
      }
    },
    [currentQuestionIndex, questions.length, handleNext]
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
          location: '35.681236,139.767125', // ダミーの位置情報。今後位置情報取得機能を追加
        }),
      });

      // ステータスコードが200番台でない場合はエラーを投げる
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data); // 結果を保存
      setShowResult(true); // 結果を表示
    } catch (error) {
      setError('検索中にエラーが発生しました。');
      console.error('APIリクエストエラー:', error);
    } finally {
      setIsLoading(false); // ローディング終了
    }
  }, [answers]);

  const handleResetSearch = useCallback(() => {
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setAnswers({
      q5: '',
      q1: '',
      q2: '',
      q3: '',
      q4: '',
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
                selectedOption={answers[`q${index + 1}` as keyof Answers]}
                setSelectedOption={(option: string) =>
                  setAnswers((prev) => ({ ...prev, [`q${index + 1}`]: option }))
                }
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
