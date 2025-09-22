import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const Seo = ({
  title = 'Signal Snapshot - Visualize Your Signal Message History',
  description = 'Create personalized visualizations of your Signal conversations, all within in your browser.',
  image = "%PUBLIC_URL%/favicon.ico",
  url = 'https://signalsnapshot.com',
  type = 'website',
}: SeoProps) => {
  const fullImageUrl = `${url}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default Seo;
