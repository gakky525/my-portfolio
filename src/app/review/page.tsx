import type { Metadata } from 'next';
import ReviewPage from './ReviewClient';

// ページを静的生成
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '【復習】解剖学・生理学 - スキマ時間で国試対策',
  description:
    '間違えた問題をまとめて復習できます。スキマ時間に見返して弱点を克服しましょう！完全無料の解剖学・生理学国試対策アプリで効率的に学習を！',
  openGraph: {
    title: '【復習】解剖学・生理学 - スキマ時間で国試対策',
    description:
      '間違えた問題を復習して弱点を克服しましょう。スキマ時間で繰り返し学べる、解剖学・生理学の無料アプリ。',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/review`,
    siteName: '解剖学・生理学 スキマ時間にできる国試対策',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '【復習】解剖学・生理学 - スキマ時間で国試対策',
    description:
      '間違えた問題を復習して弱点を克服しましょう。分野別・解説付きでしっかり復習。スマホでいつでも学べる完全無料アプリ。',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.png`],
  },
};

export default function Page() {
  return <ReviewPage />;
}
