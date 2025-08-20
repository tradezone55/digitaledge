import { useState, useEffect } from "react";
import { Clock, Play, SkipForward, BookOpen, Award } from "lucide-react";
import Button from "./ui/Button";
import { useNavigate } from "react-router-dom";
import Logo from "./ui/Logo";

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

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<DemoAnswer[]>([]);

  // Demo questions - a small subset to give users a taste
  const demoQuestions: DemoQuestion[] = [
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
    setSelectedAnswer(answerIndex);
  };

  // Move to next question
  const nextQuestion = () => {
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
          <h2 className="text-3xl font-bold mb-2 text-white">Demo Complete!</h2>
          <p className="text-gray-300">
            You answered {finalScore} out of {totalQuestions} questions
            correctly ({percentage}%)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {finalScore}/{totalQuestions}
            </div>
            <div className="text-gray-300">Questions Correct</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {percentage}%
            </div>
            <div className="text-gray-300">Final Score</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-gray-300">Time Taken</div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handleComplete}
            variant="primary"
            size="lg"
            className="w-auto"
          >
            Get Full Access
          </Button>
        </div>

        {/* Review incorrect answers */}
        {userAnswers.filter((answer) => !answer.correct).length > 0 && (
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-red-400">
              Review Your Incorrect Answers
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
                        Question {answer.questionIndex + 1}: {question.question}
                      </h4>
                      <p className="text-red-400 mb-2">
                        <strong>Your Answer:</strong>{" "}
                        {question.choices[answer.selected]}
                      </p>
                      <p className="text-green-400 mb-2">
                        <strong>Correct Answer:</strong>{" "}
                        {question.choices[question.correct]}
                      </p>
                      <div className="bg-gray-600 rounded-lg p-3">
                        <p className="text-yellow-300 font-semibold mb-1">
                          Explanation:
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
            Try Our Demo Quiz
          </h2>
          <p className="text-gray-300 mb-6">
            Experience our comprehensive question format with 5 sample questions
            from Domain 1. Get instant feedback and explanations for each
            answer.
          </p>
          <div className="flex justify-center gap-4 w-full lg:flex-row flex-col">
            <Button
              onClick={startQuiz}
              variant="primary"
              size="lg"
              className="w-[200px] flex items-center justify-center "
            >
              <Play className="w-4 h-4 mr-2" />
              Start Demo
            </Button>
            <Button
              onClick={handleSkip}
              variant="secondary"
              size="lg"
              className="w-[200px] flex items-center justify-center "
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip Demo
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
            Demo Q {currentQuestion + 1}/{demoQuestions.length}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-gray-300">
                Time {formatTime(timeElapsed)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-300">Score {score}</span>
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
              Skip Demo
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={selectedAnswer === -1}
              variant="primary"
              size="sm"
              className="w-[200px] flex items-center justify-center "
            >
              {currentQuestion + 1 === demoQuestions.length ? "Finish" : "Next"}
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
