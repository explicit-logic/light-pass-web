import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { QuestionPage } from '@/pages/QuestionPage';
import { useQuiz as useQuizHook } from '@/hooks/useQuiz';
import { useEffect } from 'react';
import { Question } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';

export const Route = createFileRoute('/quiz/$questionId')({
  component: QuizRoute,
});

function QuizRoute() {
  const navigate = useNavigate();
  const { questionId } = useParams({ from: '/quiz/$questionId' });
  const { quizData } = useQuiz();
  
  const { 
    answers,
    timeRemaining,
    isComplete,
    onAnswer,
  } = useQuizHook();
  
  // Use effect for completion check and redirection
  useEffect(() => {
    if (isComplete) {
      navigate({ to: '/completion' });
    }
  }, [isComplete, navigate]);
  
  // If quiz data is not loaded, redirect to home
  if (!quizData) {
    navigate({ to: '/' });
    return null;
  }

  // Get current question
  const currentQuestion = quizData.questions.find(q => q.id === questionId);
  if (!currentQuestion) {
    navigate({ to: '/' });
    return null;
  }
  
  // Get current question index
  const currentIndex = quizData.questions.findIndex(q => q.id === questionId);
  
  // Handle answer submission
  const handleAnswer = (answer: string | string[]) => {
    onAnswer(questionId, answer);
  };
  
  // Navigate to next question
  const onNext = () => {
    if (currentIndex < quizData.questions.length - 1) {
      const nextQuestion = quizData.questions[currentIndex + 1];
      navigate({ to: '/quiz/$questionId', params: { questionId: nextQuestion.id } });
    } else {
      navigate({ to: '/completion' });
    }
  };
  
  // Navigate to previous question
  const onPrev = () => {
    if (currentIndex > 0) {
      const prevQuestion = quizData.questions[currentIndex - 1];
      navigate({ to: '/quiz/$questionId', params: { questionId: prevQuestion.id } });
    }
  };

  return (
    <QuestionPage
      question={currentQuestion as Question}
      totalQuestions={quizData.questions.length}
      onAnswer={handleAnswer}
      onNext={onNext}
      onPrev={onPrev}
      answers={answers}
      timeRemaining={timeRemaining}
      currentQuestion={currentIndex}
    />
  );
}
