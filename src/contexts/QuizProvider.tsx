import React, { useState, ReactNode, useEffect } from 'react';
import { LoadedQuiz, QuizState } from '@/types/quiz';
import JSZip from 'jszip';
import { QuizContext } from './QuizContext';

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quizData, setQuizData] = useState<LoadedQuiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz state from useQuiz
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    timeRemaining: 0,
    isComplete: false,
  });

  // Update time limit when quiz data changes
  useEffect(() => {
    if (quizData) {
      setQuizState(prev => ({
        ...prev,
        timeRemaining: quizData.timeLimit
      }));
    }
  }, [quizData]);

  // Timer effect
  useEffect(() => {
    if (!quizState.isComplete && quizData) {
      const timer = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining <= 0) {
            clearInterval(timer);
            return { ...prev, isComplete: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState.isComplete, quizData]);

  const loadQuizFromZip = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      // Look for quiz.json in the root of the ZIP
      const quizFileEntry = Object.values(contents.files).find(
        zipFile => zipFile.name === 'quiz.json' || zipFile.name.endsWith('/quiz.json')
      );

      if (!quizFileEntry) {
        throw new Error('No quiz.json file found in the ZIP archive');
      }

      // Load the quiz.json file
      const quizJsonContent = await quizFileEntry.async('string');
      const quizJson = JSON.parse(quizJsonContent);

      // Validate the quiz structure
      if (!quizJson.title || !quizJson.description || !quizJson.timeLimit || !Array.isArray(quizJson.questions)) {
        throw new Error('Invalid quiz.json format');
      }

      // Create the loaded quiz object
      const loadedQuiz: LoadedQuiz = {
        title: quizJson.title,
        description: quizJson.description,
        timeLimit: quizJson.timeLimit,
        questions: quizJson.questions
      };

      setQuizData(loadedQuiz);
      setIsLoading(false);
      
      // Reset quiz state when loading a new quiz
      setQuizState({
        currentQuestion: 0,
        answers: {},
        timeRemaining: loadedQuiz.timeLimit,
        isComplete: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz from ZIP file');
      setIsLoading(false);
    }
  };

  // Methods from useQuiz
  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleNext = () => {
    if (quizData && quizState.currentQuestion === quizData.questions.length - 1) {
      setQuizState(prev => ({ ...prev, isComplete: true }));
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    }
  };

  const handlePrev = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestion: Math.max(0, prev.currentQuestion - 1),
    }));
  };

  const resetQuiz = () => {
    setQuizData(null);
    setError(null);
    setQuizState({
      currentQuestion: 0,
      answers: {},
      timeRemaining: 0,
      isComplete: false,
    });
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        isLoading,
        error,
        loadQuizFromZip,
        resetQuiz,
        // Quiz state
        currentQuestion: quizState.currentQuestion,
        answers: quizState.answers,
        timeRemaining: quizState.timeRemaining,
        isComplete: quizState.isComplete,
        // Quiz methods
        onAnswer: handleAnswer,
        onNext: handleNext,
        onPrev: handlePrev,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
