'use client';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Inputs = {
  email: string;
  password: string;
  name?: string; // 名前フィールドが必要であれば追加
};

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      // Firebaseでユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // FirebaseからIDトークンを取得
      const idToken = await user.getIdToken();
      const uid = user.uid; // UIDを明示的に取得

      console.log('ID Token:', idToken);
      // Firebaseで取得したデータをログで確認
      console.log('uid:', uid);
      console.log('email:', data.email);

      // バックエンドにデータを送信
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`, // IDトークンをAuthorizationヘッダーに追加
        },
        body: JSON.stringify({
          idToken, // IDトークンをボディにも送信
          uid, // Firebaseから取得したUID
          email: data.email, // 入力されたメールアドレス
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Backend response:', responseData); // バックエンドからの応答をコンソールに表示

      // 成功したら特定のページにリダイレクト
      router.push('/client/pages/requiredfield');
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        alert(`バックエンドとの通信エラー: ${error.message}`);
      }
    }
  };

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white p-8 rounded-lg shadow-md w-96'
      >
        <h1 className='mb-4 text-2xl text-gray-700 font-medium'>新規登録</h1>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-600'>
            Email
          </label>
          <input
            {...register('email', {
              required: 'メールアドレスは必須です。',
              pattern: {
                value:
                  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                message: '不適切なメールアドレスです。',
              },
            })}
            type='text'
            className='mt-1 border-2 rounded-md w-full p-2'
          />
          {errors.email && (
            <span className='text-red-600 text-sm'>{errors.email.message}</span>
          )}
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-600'>
            Password
          </label>
          <input
            type='password'
            {...register('password', {
              required: 'パスワードは必須です。',
              minLength: {
                value: 6,
                message: '6文字以上入力してください。',
              },
            })}
            className='mt-1 border-2 rounded-md w-full p-2'
          />
          {errors.password && (
            <span className='text-red-600 text-sm'>
              {errors.password.message}
            </span>
          )}
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700'
          >
            新規登録
          </button>
        </div>
        <div className='mt-4'>
          <span className='text-gray-600 text-sm'>
            既にアカウントをお持ちですか？
          </span>
          <Link
            href={'/auth/login'}
            className='text-blue-500 text-sm font-bold ml-1 hover:text-blue-700'
          >
            ログインページへ
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
