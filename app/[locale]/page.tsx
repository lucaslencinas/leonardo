import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Countdown } from '@/components/home/Countdown';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        {/* Header with baby theme */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-neutral-dark tracking-tight">
            <span className="baby-gradient bg-clip-text text-transparent">
              Leonardo
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-heading text-baby-blue">
            {t('welcome')}
          </p>
          <p className="text-lg md:text-xl text-neutral-medium max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Countdown */}
        <Countdown />

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/predict"
            className="px-8 py-4 bg-baby-blue text-neutral-dark font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
          >
            {t('getStarted')}
          </Link>
          <Link
            href="/predictions"
            className="px-8 py-4 bg-white border-2 border-baby-mint text-neutral-dark font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
          >
            {t('viewPredictions')}
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-8 text-6xl opacity-50 pt-12">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>👶</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>🍼</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🎉</span>
        </div>
      </div>
    </div>
  );
}
