import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import { subjects } from '@/lib/subjects';

type Props = {
  params: Promise<{ category: string }>;
};

// 科目名を日本語に変換する関数
const getCategoryLabel = (category: string) =>
  category === 'anatomy' ? '解剖学' : '生理学';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/subjects/${category}`;
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `【${categoryLabel}】 - スキマ時間で国試対策`,
    description: `無料で使える${categoryLabel}の国家試験対策アプリです。分野別に演習できて全問に解説付き！通学中やちょっとした空き時間に最適です。スキマ時間を活用して苦手な分野を克服しましょう！`,
    openGraph: {
      title: `【${categoryLabel}】 - スキマ時間で国試対策`,
      description: `医療学生向け！国家試験対策に役立つ無料Webアプリです。${categoryLabel}の重要分野をピンポイントで演習できます。`,
      url: pageUrl,
      siteName: '解剖学・生理学 - スキマ時間にできる国試対策',
      images: [
        `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`,
        ...previousImages,
      ],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `【${categoryLabel}】 - スキマ時間で国試対策`,
      description: `医療学生向け！国家試験対策に役立つ無料Webアプリです。${categoryLabel}の重要分野をピンポイントで演習できます。`,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`],
    },
  };
}

// ビルド時に解剖学、生理学のページを静的生成
export function generateStaticParams() {
  return [{ category: 'anatomy' }, { category: 'physiology' }];
}

// ページを静的生成
export const dynamic = 'error';

export default async function SubjectPage({ params }: Props) {
  const { category } = await params;
  const fields = subjects[category as keyof typeof subjects];
  const categoryLabel = getCategoryLabel(category);

  if (!fields) return notFound(); // 存在しなければ404エラー

  return (
    <main className='p-6 flex flex-col items-center min-h-screen'>
      <h1
        className={`text-4xl font-bold ${
          category === 'anatomy' ? 'text-red-600' : 'text-green-600'
        }`}
      >
        {categoryLabel}
      </h1>
      <p className='m-4 text-xl text-gray-700'>
        学習する分野を選択してください
      </p>

      <div className='w-full max-w-md text-xl'>
        <Link
          href={`/questions/${category}/all`}
          className='block bg-purple-500 hover:bg-purple-600 border border-purple-500 text-white font-semibold rounded-xl px-6 py-4 mb-8 text-center shadow transition-transform hover:scale-105'
        >
          全分野から出題
        </Link>
        <div className='grid grid-cols-2 sm:grid-cols-3  gap-6'>
          {fields.map((field) => (
            <Link
              key={field}
              href={`/questions/${category}/${field}`}
              className='bg-gray-50 hover:bg-gray-300 border border-gray-500 rounded-xl px-4 py-4 m-1 text-center shadow transition-transform hover:scale-105'
            >
              {field}
            </Link>
          ))}
        </div>
      </div>

      <Link
        href='/'
        className='m-8 bg-gray-300 hover:bg-gray-400 border border-gray-500 px-5 py-3 rounded-xl shadow transition-transform hover:scale-105'
      >
        トップに戻る
      </Link>
    </main>
  );
}
