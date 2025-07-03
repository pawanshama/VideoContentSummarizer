// app/auth/summary/[id]/MetaHead.tsx
import Head from 'next/head';

type Props = {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
};

export default function MetaHead({ title, description, imageUrl, url }: Props) {
  return (
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}
