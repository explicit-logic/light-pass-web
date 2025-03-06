import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { QuestionPage } from '@/pages/QuestionPage';
import { useQuiz } from '@/hooks/useQuiz';
import { useEffect } from 'react';
import questions from '@/data/questions';
import { Question } from '@/types/quiz';

export const Route = createFileRoute('/quiz/$questionId')({
  loader: async ({ params }) => {
    const question = questions.find(q => q.id === params.questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    return question;
  },
  component: QuizRoute,
});

function QuizRoute() {
  const navigate = useNavigate();
  const { questionId } = useParams({ from: '/quiz/$questionId' });
  const currentQuestion = Route.useLoaderData();
  
  const { 
    answers,
    timeRemaining,
    isComplete,
  } = useQuiz();
  
  // Get current question index
  const currentIndex = questions.findIndex(q => q.id === questionId);
  
  // Handle answer submission
  const onAnswer = (answer: string | string[]) => {
    console.log(answer);
    // submitAnswer(questionId, answer);
    // Optionally check if all questions are answered
    // checkCompletion();
  };
  
  // Navigate to next question
  const onNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      navigate({ to: '/quiz/$questionId', params: { questionId: nextQuestion.id } });
    } else {
      navigate({ to: '/completion' });
    }
  };
  
  // Navigate to previous question
  const onPrev = () => {
    if (currentIndex > 0) {
      const prevQuestion = questions[currentIndex - 1];
      navigate({ to: '/quiz/$questionId', params: { questionId: prevQuestion.id } });
    }
  };

  useEffect(() => {
    if (isComplete) {
      navigate({ to: '/completion' });
    }
  }, [isComplete, navigate]);

  return (
    <QuestionPage
      question={currentQuestion as Question}
      totalQuestions={questions.length}
      onAnswer={onAnswer}
      onNext={onNext}
      onPrev={onPrev}
      answers={answers}
      timeRemaining={timeRemaining}
      currentQuestion={currentIndex}
    />
  );
}
