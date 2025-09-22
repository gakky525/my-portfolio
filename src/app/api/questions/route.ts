import { NextResponse } from 'next/server';
import { getRandomQuestion } from '@/lib/quiz/getRandomQuestion';

export async function POST(req: Request) {
  try {
    // リクエストのデータを受け取る
    const { category, field, excludeIds } = await req.json();

    // バリデーション（categoryがnull or stringでなければエラー）
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // バリデーション（fieldがstringでなければエラー）
    if (field && typeof field !== 'string') {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
    }

    // excludeIds は number型の配列に整形
    const exclude: number[] = Array.isArray(excludeIds)
      ? excludeIds.filter((id) => typeof id === 'number')
      : [];

    // バリデーションで問題なければ、ランダムで問題を取得
    const question = await getRandomQuestion(category, field || 'all', exclude);

    // getRandomQuestionで問題が見つからなかった場合の処理
    if (!question) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(question);
  } catch (err) {
    console.error('Error in POST /api/questions:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
