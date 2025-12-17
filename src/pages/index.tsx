import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Shield, Smartphone, Trophy, Sparkles, Cpu, Server, ArrowRight, Star, MessageCircle, Timer, Gauge, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Link } from "react-router-dom";
import DemoQuiz from "@/components/DemoQuiz";
import SupportBanner from "@/components/SupportBanner";
import LanguageSwitch from "@/components/LanguageSwitch";
import { useTranslation } from "react-i18next";
import { useLanguageNavigation } from "../utils/navigation";

// ------------------------------------------------------
// Enhanced Landing Page — Aligned with design system
// Technologies: React + Tailwind + shadcn/ui + lucide-react + framer-motion
// ------------------------------------------------------

// Updated color system to use orange-500 theme
const primaryGradient = "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700";

const glass = "backdrop-blur-xl bg-orange-500/10 border border-orange-500/20";
const glow = "shadow-lg shadow-orange-500/25";

// 👉 Set this to your live timed-quiz URL (can be an app route or a hosted quiz page)
// Example: const QUIZ_URL = "https://network-mastery.netlify.app/quiz?mode=timed";



// Features and steps will be defined inside the component to use translations

const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${glass} text-foreground/90 ${className}`}>{children}</span>
);

const Section = ({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`relative px-6 md:px-10 lg:px-16 py-16 ${className}`}>
    {children}
  </section>
);

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

export default function EnhancedLandingPage() {
  console.log('EnhancedLandingPage rendering');
  const { t } = useTranslation(['landing', 'common']);
  const { getLanguagePath } = useLanguageNavigation();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Define features and steps with translations
  const features = [
    { icon: <CheckCircle2 className="w-6 h-6 text-white" />, title: t('features.examStyleQuestions.title'), desc: t('features.examStyleQuestions.desc') },
    { icon: <Gauge className="w-6 h-6 text-white" />, title: t('features.instantFeedback.title'), desc: t('features.instantFeedback.desc') },
    { icon: <Smartphone className="w-6 h-6 text-white" />, title: t('features.mobileFriendly.title'), desc: t('features.mobileFriendly.desc') },
    { icon: <Shield className="w-6 h-6 text-white" />, title: t('features.instructorBuilt.title'), desc: t('features.instructorBuilt.desc') },
  ];

  const steps = [
    { icon: <Zap className="w-6 h-6 text-white" />, title: t('howItWorks.joinBeta.title'), desc: t('howItWorks.joinBeta.desc') },
    { icon: <MessageCircle className="w-6 h-6 text-white" />, title: t('howItWorks.startPracticing.title'), desc: t('howItWorks.startPracticing.desc') },
    { icon: <Timer className="w-6 h-6 text-white" />, title: t('howItWorks.trackProgress.title'), desc: t('howItWorks.trackProgress.desc') },
    { icon: <Trophy className="w-6 h-6 text-white" />, title: t('howItWorks.passWithConfidence.title'), desc: t('howItWorks.passWithConfidence.desc') },
  ];

  const testimonials = [
    {
      name: t('testimonials.quotes.0.author'),
      title: t('testimonials.quotes.0.title'),
      quote: t('testimonials.quotes.0.text'),
    },
    {
      name: t('testimonials.quotes.1.author'),
      title: t('testimonials.quotes.1.title'),
      quote: t('testimonials.quotes.1.text'),
    },
    {
      name: t('testimonials.quotes.2.author'),
      title: t('testimonials.quotes.2.title'),
      quote: t('testimonials.quotes.2.text'),
    },
  ];

  // Handle smooth scrolling for navigation links
  useEffect(() => {
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        if (id) {
          smoothScrollTo(id);
        }
      }
    };

    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Carousel navigation functions
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <div className="min-h-screen w-full text-white bg-gray-800 selection:bg-orange-500/40 selection:text-white">
      {/* Enhanced background with orange theme */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[60vh] w-[80vw] rounded-full blur-3xl opacity-20 bg-gradient-to-b from-orange-500/40 via-orange-400/30 to-orange-600/20" />
      </div>

      {/* Enhanced Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b bg-gray-900 border-orange-400">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 md:px-10 lg:px-16 h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 ">
            <a
              href="https://hub.digitaledgeprep.com"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Back to Hub
            </a>
            
            <a
              href="#features"
              className={`hover:text-white transition-colors duration-200 ${activeSection === 'features' ? 'text-orange-400 font-medium' : ''}`}
            >
              {t('common:navigation.features')}
            </a>
            <a
              href="#how"
              className={`hover:text-white transition-colors duration-200 ${activeSection === 'how' ? 'text-orange-400 font-medium' : ''}`}
            >
              {t('common:navigation.howItWorks')}
            </a>
            <a
              href="#pricing"
              className={`hover:text-white transition-colors duration-200 ${activeSection === 'pricing' ? 'text-orange-400 font-medium' : ''}`}
            >
              {t('common:navigation.pricing')}
            </a>
            <a
              href="#testimonials"
              className={`hover:text-white transition-colors duration-200 ${activeSection === 'testimonials' ? 'text-orange-400 font-medium' : ''}`}
            >
              {t('common:navigation.results')}
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitch />
            <a
              href="#cta"
              className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold ${primaryGradient} ${glow} text-white hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200`}
            >
              {t('common:buttons.getEarlyAccess')} <ArrowRight className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <Section>
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="text-white"><Sparkles className="w-3.5 h-3.5 text-white" /> {t('hero.badge')}</Badge>
            <h1 className={`mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-white`}>
              {t('hero.title')}
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                id="cta"
                href="#pricing"
                className={`px-6 py-3 rounded-2xl font-bold ${primaryGradient} ${glow} text-white hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200`}
              >
                {t('common:buttons.getEarlyAccess')}
              </a>
              <a
                href="#features"
                className="px-6 py-3 rounded-2xl font-semibold border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-200 text-white"
              >
                {t('common:buttons.seeFeatures')}
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-white" /> {t('hero.examDomainsCovered')}</div>
              <div className="flex items-center gap-2"><Server className="w-4 h-4 text-white" /> {t('hero.cloudOnPremScenarios')}</div>
            </div>
          </motion.div>

          {/* Enhanced Hero Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="relative rounded-3xl p-6 bg-gray-900 border border-gray-700 overflow-hidden shadow-xl">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <Badge className="text-white bg-orange-500/20 border-orange-500/30">{t('livePractice')}</Badge>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <Star className="w-4 h-4 fill-yellow-400" />
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-gray-600 bg-gray-800 p-4">
                  <div className="text-xs uppercase tracking-wider text-gray-400">{t('sampleQuiz.title')}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{t('sampleQuiz.question')}</div>
                  <ul className="mt-4 space-y-2 text-gray-300">
                    <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full border border-gray-600 inline-flex items-center justify-center text-white">A</span> {t('sampleQuiz.options.0')}</li>
                    <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full border border-gray-600 inline-flex items-center justify-center text-white">B</span> {t('sampleQuiz.options.1')}</li>
                    <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full border border-gray-600 inline-flex items-center justify-center text-white">C</span> {t('sampleQuiz.options.2')}</li>
                    <li className="flex items-center gap-2"><span className="h-5 w-5 rounded-full border border-gray-600 inline-flex items-center justify-center text-white">D</span> {t('sampleQuiz.options.3')}</li>
                  </ul>
                  <div className="mt-4 text-sm text-green-400">{t('sampleQuiz.correctAnswer')}</div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setShowQuizModal(true)}
                    className="flex-1 px-4 py-2 rounded-xl font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200"
                  >
                    {t('common:buttons.takeTimedQuiz')}
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-xl font-semibold border border-gray-600 hover:border-orange-400 hover:bg-gray-800 transition-all duration-200 text-white">
                    {t('common:buttons.viewExplanations')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Enhanced Features Section */}
      <Section id="features" className="pt-0">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 text-white">{t('features.title')} <span className="inline-block h-2 w-2 rounded-full bg-orange-500"></span></h2>
          <p className="mt-2 text-gray-300 max-w-3xl">{t('features.subtitle')}</p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl p-5 bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-all duration-200 group shadow-lg hover:shadow-xl"
              >
                <div className="mb-3 p-2 rounded-xl bg-orange-500 inline-flex group-hover:scale-110 transition-transform duration-200">{f.icon}</div>
                <h3 className="font-bold text-lg text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-300">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Enhanced How It Works Section */}
      <Section id="how" className="pt-0">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl p-5 bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="mb-3 inline-flex p-2 rounded-xl bg-orange-500">{s.icon}</div>
                <h3 className="font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Enhanced Pricing Section */}
      <Section id="pricing" className="pt-0">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Beta Offer */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl p-6 bg-gray-900 border border-gray-700 lg:col-span-2 shadow-xl"
            >
              <Badge className="bg-orange-500/20 border-orange-500/30 !text-blue-400">{t('pricing.betaOffer.badge')}</Badge>
              <h3 className="mt-3 text-3xl font-extrabold text-white">{t('pricing.betaOffer.title')}</h3>
              <p className="text-gray-300 mt-2 max-w-2xl">{t('pricing.betaOffer.desc')}</p>

              <div className="mt-6 flex flex-wrap items-end gap-6">
                <div>
                  <div className="text-4xl font-black tracking-tight text-white">
                    {t('pricing.betaOffer.price')}
                  </div>
                  <div className="text-gray-400 text-sm">{t('pricing.betaOffer.priceSubtext')}</div>
                </div>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t('pricing.betaOffer.features.0')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t('pricing.betaOffer.features.1')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t('pricing.betaOffer.features.2')}</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> {t('pricing.betaOffer.features.3')}</li>
                </ul>
                <p className="text-gray-400 text-xs">{t('pricing.betaOffer.guarantee')}</p>
                <Link
                  to={getLanguagePath('home')}
                  className="ml-auto px-6 py-3 rounded-2xl font-bold bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200"
                >
                  {t('common:buttons.joinNow')}
                </Link>
              </div>
            </motion.div>

            {/* Classroom License */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl p-6 bg-gray-900 border border-gray-700 shadow-xl"
            >
              <Badge className="bg-orange-500/20 border-orange-500/30 !text-blue-400">{t('pricing.classroomLicense.badge')}</Badge>
              <h3 className="mt-3 text-2xl font-extrabold text-white">{t('pricing.classroomLicense.title')}</h3>
              <p className="text-gray-300 mt-2">{t('pricing.classroomLicense.desc')}</p>
              <div className="mt-4 text-4xl font-black text-white">{t('pricing.classroomLicense.price')}</div>
              <a
                href="#contact"
                className="mt-6 inline-flex px-5 py-2 rounded-2xl font-semibold border border-gray-600 hover:border-orange-400 hover:bg-gray-800 transition-all duration-200 text-white"
              >
                {t('common:buttons.talkToUs')}
              </a>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Enhanced Testimonials Section */}
      <Section id="testimonials" className="pt-0">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">{t('testimonials.title')}</h2>

          {/* Responsive Carousel Container */}
          <div className="mt-8 relative">
            <div
              ref={carouselRef}
              className="relative overflow-hidden"
            >
              {/* Mobile: Single Card with Slide Animation */}
              {isMobile ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                    className="w-full rounded-2xl p-6 bg-gray-900 border border-gray-700 shadow-lg"
                  >
                    {/* Star Rating */}
                    <div className="flex justify-center mb-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-300 text-base leading-relaxed mb-4 text-center">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>

                    {/* Author Info */}
                    <footer className="text-sm text-gray-400 text-center">
                      <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                      <div>{testimonials[currentTestimonial].title}</div>
                    </footer>
                  </motion.div>
                </AnimatePresence>
              ) : (
                /* Desktop: Three Cards with Horizontal Slide */
                <motion.div
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  animate={{
                    transform: `translateX(-${currentTestimonial * (100 / 3)}%)`
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className="flex-1 min-w-0 rounded-2xl p-6 bg-gray-900 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.06 }}
                    >
                      {/* Star Rating */}
                      <div className="flex justify-center mb-4">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-gray-300 text-base leading-relaxed mb-4 text-center">
                        "{testimonial.quote}"
                      </blockquote>

                      {/* Author Info */}
                      <footer className="text-sm text-gray-400 text-center">
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div>{testimonial.title}</div>
                      </footer>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 hover:border-orange-400 transition-all duration-200 text-white hover:text-orange-400 backdrop-blur-sm z-10"
                aria-label={t('ariaLabels.previousTestimonials')}
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              <button
                onClick={nextTestimonial}
                className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600 hover:border-orange-400 transition-all duration-200 text-white hover:text-orange-400 backdrop-blur-sm z-10"
                aria-label={t('ariaLabels.nextTestimonials')}
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 md:mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                    ? 'bg-orange-400 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  aria-label={t('ariaLabels.goToTestimonial', { index: index + 1 })}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-3 md:mt-4 w-full bg-gray-700 rounded-full h-1">
              <motion.div
                className="bg-orange-400 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentTestimonial + 1) / testimonials.length) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Enhanced Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden border border-gray-700 bg-gray-800 shadow-2xl">
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <div className="text-sm text-gray-300">{t('timedQuiz')}</div>
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-3 py-1 rounded-lg border border-gray-600 hover:border-orange-400 hover:bg-gray-700 transition-all duration-200 text-white"
              >
                {t('close')}
              </button>
            </div>
            <DemoQuiz redirectTo={getLanguagePath('home')} />
          </div>
        </div>
      )}

      {/* Enhanced Footer */}
      <footer className="mt-10 border-t border-gray-700">
        <div className="max-w-7xl mx-auto p-5 w-full flex items-center justify-center">
          <SupportBanner compact />
        </div>
        <Section className="py-10">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm flex items-center gap-2">© {new Date().getFullYear()} <Logo size="sm" /> — {t('common:footer.allRightsReserved')}</div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <a href="#privacy" className="hover:text-white transition-colors duration-200">{t('common:footer.privacy')}</a>
              <a href="#terms" className="hover:text-white transition-colors duration-200">{t('common:footer.terms')}</a>
              <a href="#contact" className="hover:text-white transition-colors duration-200">{t('common:footer.contact')}</a>
            </div>
          </div>
        </Section>
      </footer>
    </div>
  );
}

