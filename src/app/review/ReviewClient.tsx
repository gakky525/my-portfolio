'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Question } from '@/types/questions';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ReviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [open, setOpen] = useState(false);
  const [openAllDelete, setOpenAllDelete] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);

  const MAX_QUESTIONS = 100;
  const isOverLimit = questions.length >= MAX_QUESTIONS;

  // 初回レンダリング時に localStorage から保存済みの問題を取得
  useEffect(() => {
    try {
      const stored = localStorage.getItem('incorrectQuestions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to parse incorrect questions:', error);
    }
  }, []);

  // ゴミ箱アイコンを押したときに削除ダイアログを開く
  const confirmDelete = (id: number) => {
    setTargetId(id);
    setOpen(true);
  };

  // 特定の問題を削除して状態更新＋localStorage更新
  const handleDelete = () => {
    if (targetId === null) return;
    const updated = questions.filter((q) => q.id !== targetId);
    setQuestions(updated);
    localStorage.setItem('incorrectQuestions', JSON.stringify(updated));
    setOpen(false);
    setTargetId(null);
  };

  // 全削除（localStorageも更新）
  const handleDeleteAll = () => {
    setQuestions([]);
    localStorage.removeItem('incorrectQuestions');
    setOpenAllDelete(false);
  };

  return (
    <main className='p-8 relative max-w-screen-md mx-auto'>
      <div className='flex justify-between items-center mb-4'>
        <Link
          href='/'
          className='inline-flex items-center bg-gray-300 hover:bg-gray-400 border border-gray-500 px-4 py-2 rounded-xl shadow transition-transform hover:scale-105'
        >
          トップへ
        </Link>
        {questions.length > 0 && (
          <Button
            className='bg-red-500 hover:bg-red-600 text-white px-6 py-5 rounded-xl shadow transition-transform hover:scale-105'
            onClick={() => setOpenAllDelete(true)}
          >
            全削除
          </Button>
        )}
      </div>

      <h1 className='text-3xl text-gray-800 font-bold text-center mb-3'>
        復習
      </h1>
      <div
        className={`text-center font-medium mb-2 ${
          isOverLimit ? 'text-red-500' : 'text-gray-800'
        }`}
      >
        <p>最近間違えた問題が最大{MAX_QUESTIONS}問まで保存されます。</p>
        <p>
          現在：{questions.length} / {MAX_QUESTIONS}問
        </p>
      </div>

      <div className='relative w-full mx-auto max-w-md h-3 bg-gray-200 rounded-full overflow-hidden shadow mb-4'>
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out ${
            isOverLimit ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{
            width: `${(questions.length / MAX_QUESTIONS) * MAX_QUESTIONS}%`,
          }}
        />
      </div>

      {isOverLimit && (
        <p className='text-sm text-red-500 text-center mb-4'>
          保存上限に達しています。古いものから順に削除されます。
        </p>
      )}

      {questions.length === 0 ? (
        <p className='text-center text-xl p-8'>
          最近間違えた問題はありません。
        </p>
      ) : (
        <ul className='space-y-6'>
          {questions.map((q) => (
            <li
              key={q.id}
              className='relative border rounded-xl p-5 shadow-md bg-gray-50'
            >
              <Button
                variant='ghost'
                title='この問題を削除'
                aria-label='削除'
                className='absolute top-1/2 right-2 -translate-y-1/2 text-red-500 hover:text-red-600 p-1 cursor-pointer transition-transform hover:scale-110'
                size='icon'
                onClick={() => confirmDelete(q.id)}
              >
                <Trash2 className='w-5 h-5' />
              </Button>

              <p className='font-semibold text-lg mb-2'>{q.question}</p>
              <ul className='space-y-2'>
                {q.choices.map((c, i) => (
                  <li
                    key={c.id}
                    className={cn(
                      'text-gray-700',
                      c.isCorrect && 'text-green-600 font-bold'
                    )}
                  >
                    {i + 1}. {c.text}
                  </li>
                ))}
              </ul>
              <p className='mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded-md'>
                {q.explanation}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title='本当に削除しますか？'
        description='この問題を復習リストから削除します。'
        onConfirm={handleDelete}
        confirmText='削除する'
        cancelText='キャンセル'
      />

      <ConfirmDialog
        open={openAllDelete}
        onOpenChange={setOpenAllDelete}
        title='本当にすべて削除しますか？'
        description='復習リストのすべての問題を削除します。この操作は元に戻せません。'
        onConfirm={handleDeleteAll}
        confirmText='すべて削除'
        cancelText='キャンセル'
      />
    </main>
  );
}
