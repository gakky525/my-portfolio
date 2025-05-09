import { getRandomQuestion } from '@/lib/quiz/getRandomQuestion';
import QuestionDisplay from '@/components/quiz/QuestionDisplay';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ category: string; field: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, field } = await params;
  const categoryLabel = category === 'anatomy' ? '解剖学' : '生理学';
  const decodedField = decodeURIComponent(field);
  const fieldLabel = decodedField === 'all' ? '全分野' : decodedField;
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/questions/${category}/${field}`;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${categoryLabel} - ${fieldLabel} | 国試対策アプリ`,
    description: `${categoryLabel}/${fieldLabel}の問題をランダムに出題。国家試験対策に役立つクイズ形式で学習できます。`,
    openGraph: {
      title: `${categoryLabel} - ${fieldLabel} | 国試対策アプリ`,
      description: `${categoryLabel}/${fieldLabel}の問題をランダムに出題。国家試験対策に役立つクイズ形式で学習できます。`,
      url: pageUrl,
      siteName: 'スキマ時間にできる国試対策',
      images: [
        `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`,
        ...previousImages,
      ],
      locale: 'ja_JP',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryLabel} - ${fieldLabel} | 国試対策アプリ`,
      description: `${categoryLabel}/${fieldLabel}の問題をランダムに出題。国家試験対策に役立つクイズ形式で学習できます。`,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`],
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { category, field } = await params;
  const decodedField = decodeURIComponent(field);
  const categoryLabel = category === 'anatomy' ? '解剖学' : '生理学';
  const fieldLabel = decodedField === 'all' ? '全分野' : decodedField;
  const question = await getRandomQuestion(category, decodedField);

  if (!question) {
    return (
      <main className='flex flex-col items-center justify-center min-h-screen space-y-6 text-center'>
        <p className='text-2xl'>この分野の問題は現在作成中です。</p>
        <Link
          href={`/subjects/${category}`}
          className='mt-4 bg-gray-300 hover:bg-gray-400 px-6 py-4 rounded-lg shadow transition'
        >
          分野選択へ戻る
        </Link>
      </main>
    );
  }

  return (
    <main className='p-4 space-y-6 max-w-3xl mx-auto'>
      <h1 className='text-3xl font-bold text-center'>
        <span className='inline-flex items-center gap-4'>
          <span
            className={`px-2.5 py-1 border rounded-lg text-3xl font-semibold ${
              category === 'anatomy'
                ? 'border-red-500 text-red-500'
                : 'border-green-500 text-green-500'
            }`}
          >
            {categoryLabel}
          </span>
          {fieldLabel}
        </span>
      </h1>
      <QuestionDisplay question={question} category={category} field={field} />
    </main>
  );
}
