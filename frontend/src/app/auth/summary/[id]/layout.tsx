import type { Metadata } from "next";
interface Summary {
  id: string;
  title: string;
  text: string;
  thumbnail: string; // Assuming this is the Cloudinary public ID
  createdAt: string;
}

// ✅ generateMetadata for SEO and Open Graph
// This function runs on the server at build time or request time.
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;

  let summary: Summary | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/summary/${id}`, {
      cache: 'no-store', // or 'force-cache' if summaries are static
    });
    if (!res.ok) {
      console.error(`Failed to fetch summary ${id}:`);
      throw new Error('Summary not found');
    }
    summary = await res.json();
    // console.log(summary)
  } catch (error) {
    console.error('Error fetching summary for metadata:', error);
    // If fetching fails, provide default metadata or redirect to a 404
    return {
      title: 'Summary Not Found',
      description: 'The requested summary could not be found.',
    };
  }

  if (!summary) {
    // This case should ideally be caught by notFound() in the component,
    // but good to handle defensively for metadata too.
    return {
      title: 'Summary Not Found',
      description: 'The requested summary could not be found.',
    };
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/summary/${summary.id}`; // Unique URL for this specific summary

  return {
    title: summary.title,
    description: summary.text + '...', // Shorten for meta description
    openGraph: {
      title: summary.title,
      description: summary.text + '...',
      url: shareUrl, // The canonical URL for sharing
      type: 'article', // Or 'website' if it's not a blog post
      images: [
        {
          // Ensure this image URL is absolute and publicly accessible
          url: summary.thumbnail
            ? summary.thumbnail
            : `/Gemini_Generated_Image.jpg`, // Default image for summaries without specific thumbnail
          width: 1200, // Recommended width for OG images
          height: 630, // Recommended height for OG images
          alt: summary.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: summary.title,
      description: summary.text + '...',
      images: [
        summary.thumbnail
          ? summary.thumbnail
          : `/Gemini_Generated_Image.jpg`,
      ],
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        {children}
      </>
  );
}
{/* <html lang="en">
      <body></body>
      </body>
    </html> */}