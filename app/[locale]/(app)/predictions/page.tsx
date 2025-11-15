import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function PredictionsPage() {
  const t = useTranslations('predictions');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl mx-auto space-y-8 px-4">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-dark">
          {t('title')}
        </h1>

        <div className="bg-baby-mint/10 border-2 border-baby-mint rounded-3xl p-8">
          <p className="text-lg text-neutral-dark">
            🚧 <strong>Coming Soon!</strong> 🚧
          </p>
          <p className="text-neutral-medium mt-4">
            This page will show all family predictions once they're submitted. You'll be able to see:
          </p>
          <ul className="text-left text-sm text-neutral-medium mt-4 space-y-1 max-w-md mx-auto">
            <li>👥 Everyone's predictions (after you submit yours)</li>
            <li>📊 Statistics and averages</li>
            <li>🎨 Beautiful prediction cards</li>
            <li>📈 Popular choices charts</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-white border-2 border-baby-mint text-neutral-dark font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            ← Back to Home
          </Link>
          <Link
            href="/predict"
            className="px-8 py-4 bg-baby-mint text-neutral-dark font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Make Prediction →
          </Link>
        </div>
      </div>
    </div>
  );
}
