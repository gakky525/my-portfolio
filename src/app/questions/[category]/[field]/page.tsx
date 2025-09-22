import { getRandomQuestion } from '@/lib/quiz/getRandomQuestion';
import QuestionDisplay from '@/components/quiz/QuestionDisplay';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';

// キャッシュを無効化し、毎回サーバーで処理を実行（毎回ランダムに問題を出す）
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ category: string; field: string }>;
};

// 表示用ラベル変換
function getCategoryAndFieldLabels(category: string, field: string) {
  const categoryLabel = category === 'anatomy' ? '解剖学' : '生理学';
  const decodedField = decodeURIComponent(field); // URLエンコードされた文字列を元に戻す
  const fieldLabel = decodedField === 'all' ? '全分野' : decodedField; // fieldが'all'の時は「全分野」として表示
  return { categoryLabel, fieldLabel, decodedField };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, field } = await params;
  const { categoryLabel, fieldLabel } = getCategoryAndFieldLabels(
    category,
    field
  );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const pageUrl = `${siteUrl}/questions/${category}/${field}`;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `【${categoryLabel} - ${fieldLabel}】 - スキマ時間で国試対策`,
    description: `${categoryLabel}/${fieldLabel}の重要ポイントをランダムで出題します。スマホで手軽に弱点克服！国家試験対策にぴったりの解剖学・生理学の完全無料アプリです。`,
    openGraph: {
      title: `【${categoryLabel} - ${fieldLabel}】 - スキマ時間で国試対策`,
      description: `${categoryLabel}/${fieldLabel}の重要ポイントをランダムで出題します。繰り返し解いて得点力アップ！無料で学べる解剖学・生理学の国家試験対策アプリです。`,
      url: pageUrl,
      siteName: 'スキマ時間にできる国試対策',
      images: [`${siteUrl}/opengraph-image.png`, ...previousImages],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `【${categoryLabel} - ${fieldLabel}】 - スキマ時間で国試対策`,
      description: `${categoryLabel}/${fieldLabel}の問題をランダムで出題します。国家試験対策を効率的に進められる、解剖学・生理学の完全無料アプリです。`,
      images: [`${siteUrl}/opengraph-image.png`],
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { category, field } = await params;
  const { categoryLabel, fieldLabel, decodedField } = getCategoryAndFieldLabels(
    category,
    field
  );
  const question = await getRandomQuestion(category, decodedField);

  // 分野に問題が存在しない場合の処理
  if (!question) {
    return (
      <main className='flex flex-col items-center justify-center min-h-screen space-y-6 text-center'>
        <p className='text-2xl'>この分野の問題は現在作成中です。</p>
        <Link
          href={`/subjects/${category}`}
          className='bg-gray-300 hover:bg-gray-400 border border-gray-500 px-6 py-4 rounded-lg shadow transition'
        >
          分野選択へ戻る
        </Link>
      </main>
    );
  }

  return (
    <main className='p-4 space-y-6 max-w-3xl mx-auto'>
      <div
        className={`flex justify-center items-center text-2xl font-semibold border-2 rounded-2xl px-5 py-3 w-fit mx-auto shadow ${
          category === 'anatomy' ? 'border-red-500' : 'border-green-500'
        }`}
      >
        <span
          className={`${
            category === 'anatomy' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {categoryLabel}
        </span>
        <span className='mx-2 text-gray-400'> - </span>
        <span className='text-gray-800'>{fieldLabel}</span>
      </div>

      <QuestionDisplay question={question} category={category} field={field} />
    </main>
  );
}
