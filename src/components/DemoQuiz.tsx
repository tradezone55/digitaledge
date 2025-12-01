import { useState, useEffect } from "react";
import { Clock, Play, SkipForward, BookOpen, Award } from "lucide-react";
import Button from "./ui/Button";
import { useNavigate } from "react-router-dom";
import Logo from "./ui/Logo";
import { useTranslation } from "react-i18next";

interface DemoQuestion {
  id: number;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  topic: string;
}

interface DemoAnswer {
  questionIndex: number;
  selected: number;
  correct: boolean;
}

const DemoQuiz = ({
  redirectTo = "/home/checkout"
}: {
  redirectTo?: string
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Debug: Log translation values
  useEffect(() => {
    console.log('Translation test:', {
      next: t('quiz:demo.next'),
      finish: t('quiz:demo.finish'),
      timeLabel: t('quiz:demo.timeLabel'),
      scoreLabel: t('quiz:demo.scoreLabel')
    });
  }, [t]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<DemoAnswer[]>([]);

  // Get translated demo questions
  const getTranslatedDemoQuestions = (): DemoQuestion[] => {
    const questions = t('questions:domains.1', { returnObjects: true }) as any[];
    if (questions && questions.length > 0) {
      // Take first 5 questions from domain 1 for demo
      return questions.slice(0, 5).map((q: any) => ({
        id: q.id,
        question: q.question,
        choices: q.choices,
        correct: q.correct,
        explanation: q.explanation,
        topic: q.topic,
      }));
    }

    // Fallback to hardcoded questions
    return [
      {
        id: 1,
        question: "Which device operates at OSI Layer 3?",
        choices: ["Router", "WAP", "Switch", "Hub"],
        correct: 0,
        explanation:
          "Routers operate at Layer 3 (Network Layer), making routing decisions based on IP addresses.",
        topic: "1.2 — Network devices",
      },
      {
        id: 2,
        question: "What is the maximum cable length for Cat 6 Ethernet?",
        choices: ["50 meters", "100 meters", "200 meters", "500 meters"],
        correct: 1,
        explanation:
          "Cat 6 has a maximum length of 100 meters for optimal performance.",
        topic: "1.3 — Cables & connectors",
      },
      {
        id: 3,
        question: "Which protocol operates at the Transport Layer?",
        choices: ["IP", "TCP", "Ethernet", "ARP"],
        correct: 1,
        explanation: "TCP operates at Layer 4, providing reliable data delivery.",
        topic: "1.1 — OSI model",
      },
      {
        id: 4,
        question: "What is the IP address class of 172.16.0.1?",
        choices: ["Class A", "Class B", "Class C", "Class D"],
        correct: 1,
        explanation:
          "172.16.0.1 falls in the Class B range (128.0.0.0 to 191.255.255.255).",
        topic: "1.4 — IP addressing",
      },
      {
        id: 5,
        question: "How many host addresses are available in a /26 subnet?",
        choices: ["30", "62", "126", "254"],
        correct: 1,
        explanation:
          "A /26 subnet has 6 host bits, giving 2^6 - 2 = 62 usable host addresses.",
        topic: "1.4 — Subnetting",
      },
    ];
  };

  // Demo questions - a small subset to give users a taste
  const demoQuestions: DemoQuestion[] = getTranslatedDemoQuestions();

  // Debug: Log questions on component mount
  useEffect(() => {
    console.log('Demo questions loaded:', demoQuestions.length, demoQuestions);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (quizActive && !showResults) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizActive, showResults]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start demo quiz
  const startQuiz = () => {
    setQuizActive(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimeElapsed(0);
    setUserAnswers([]);
    setSelectedAnswer(-1);
    setShowResults(false);
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    console.log('Answer selected:', answerIndex);
    setSelectedAnswer(answerIndex);
  };

  // Move to next question
  const nextQuestion = () => {
    console.log('Next question clicked', { currentQuestion, selectedAnswer, totalQuestions: demoQuestions.length });

    const isCorrect = selectedAnswer === demoQuestions[currentQuestion].correct;
    const newAnswers: DemoAnswer[] = [
      ...userAnswers,
      {
        questionIndex: currentQuestion,
        selected: selectedAnswer,
        correct: isCorrect,
      },
    ];
    setUserAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < demoQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(-1);
    } else {
      // Quiz complete
      setQuizActive(false);
      setShowResults(true);
    }
  };

  // Handle skip
  const handleSkip = () => {
    navigate(redirectTo);
  };

  // Handle complete
  const handleComplete = () => {
    navigate(redirectTo);
  };

  // Results component
  const ResultsScreen = () => {
    const finalScore = score;
    const totalQuestions = demoQuestions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    return (
      <div className="bg-gray-800 min-h-screen p-8">
        <div className="text-center mb-8">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2 text-white">{t('quiz:demo.demoComplete')}</h2>
          <p className="text-gray-300">
            {t('quiz:demo.scoreDescription', { correct: finalScore, total: totalQuestions, percentage })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {finalScore}/{totalQuestions}
            </div>
            <div className="text-gray-300">{t('quiz:demo.questionsCorrect')}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {percentage}%
            </div>
            <div className="text-gray-300">{t('quiz:demo.finalScore')}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-gray-300">{t('quiz:demo.timeTaken')}</div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handleComplete}
            variant="primary"
            size="lg"
            className="w-auto"
          >
            {t('quiz:demo.getFullAccess')}
          </Button>
        </div>

        {/* Review incorrect answers */}
        {userAnswers.filter((answer) => !answer.correct).length > 0 && (
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-red-400">
              {t('quiz:demo.reviewIncorrect')}
            </h3>
            <div className="space-y-4">
              {userAnswers
                .filter((answer) => !answer.correct)
                .map((answer, index) => {
                  const question = demoQuestions[answer.questionIndex];
                  return (
                    <div
                      key={index}
                      className="border border-red-500/30 rounded-lg p-4 bg-red-500/5"
                    >
                      <h4 className="text-lg font-semibold mb-2 text-white">
                        {t('quiz:demo.questionNumber', { number: answer.questionIndex + 1, question: question.question })}
                      </h4>
                      <p className="text-red-400 mb-2">
                        <strong>{t('quiz:demo.yourAnswer')}:</strong>{" "}
                        {question.choices[answer.selected]}
                      </p>
                      <p className="text-green-400 mb-2">
                        <strong>{t('quiz:demo.correctAnswer')}:</strong>{" "}
                        {question.choices[question.correct]}
                      </p>
                      <div className="bg-gray-600 rounded-lg p-3">
                        <p className="text-yellow-300 font-semibold mb-1">
                          {t('quiz:demo.explanation')}:
                        </p>
                        <p className="text-gray-300">{question.explanation}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (showResults) {
    return <ResultsScreen />;
  }

  if (!quizActive) {
    return (
      <div className="bg-gray-800 min-h-screen p-8 text-center flex flex-col items-center justify-between">
        <div className="max-w-xl w-full">
          <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-white">
            {t('quiz:demo.title')}
          </h2>
          <p className="text-gray-300 mb-6">
            {t('quiz:demo.description')}
          </p>
          <div className="flex justify-center gap-4 w-full lg:flex-row flex-col">
            <Button
              onClick={startQuiz}
              variant="primary"
              size="lg"
              className="w-[200px] flex items-center justify-center "
            >
              <Play className="w-4 h-4 mr-2" />
              {t('quiz:demo.startDemo')}
            </Button>
            <Button
              onClick={handleSkip}
              variant="secondary"
              size="lg"
              className="w-[200px] flex items-center justify-center "
            >
              <SkipForward className="w-4 h-4 mr-2" />
              {t('quiz:demo.skipDemo')}
            </Button>
          </div>
        </div>
        <footer className="text-xs text-gray-500 flex items-center gap-2">
          Powered by <Logo size="sm" />
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 h-screen p-6 flex flex-col justify-between">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-300">
            {t('quiz:demo.demoProgress', { current: currentQuestion + 1, total: demoQuestions.length })}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-gray-300">
                {t('quiz:demo.timeLabel')} {t('quiz:demo.time', { time: formatTime(timeElapsed) })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-300">{t('quiz:demo.scoreLabel')} {t('quiz:demo.score', { score })}</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-white">
          {demoQuestions[currentQuestion]?.question}
        </h2>

        <div className="space-y-3 mb-6">
          {demoQuestions[currentQuestion]?.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border transition-colors text-white ${selectedAnswer === index
                ? "border-blue-500 bg-blue-500/20"
                : "border-gray-600 bg-gray-700 hover:bg-gray-600"
                }`}
            >
              {choice}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center lg:flex-row flex-col gap-10">
          <p className="text-gray-400">
            {demoQuestions[currentQuestion]?.topic}
          </p>
          <div className="flex gap-2 lg:w-[500px] w-full">
            <Button
              onClick={handleSkip}
              variant="secondary"
              size="sm"
              className="w-[400px] flex items-center justify-center "
            >
              {t('quiz:demo.skipDemo')}
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={selectedAnswer === -1}
              variant="primary"
              size="sm"
              className="w-[200px] flex items-center justify-center "
            >
              {currentQuestion + 1 === demoQuestions.length ? t('quiz:demo.finish') : t('quiz:demo.next')}
            </Button>
          </div>
        </div>
      </div>
      <footer className="text-xs text-gray-500 flex items-center gap-2 justify-center">
        Powered by <Logo size="sm" />
      </footer>
    </div>
  );
};

export default DemoQuiz;
