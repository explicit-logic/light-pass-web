import React from 'react';
import { ArrowRight, ArrowLeft, Square, SquareCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { PageConfig, Question, QuestionOption } from '@/types/quiz';
import { useForm, Controller, FormProvider } from 'react-hook-form';

interface QuizPageProps {
  page: PageConfig;
  onAnswer: (questionId: string, answer: string | string[]) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  timeRemaining: number;
  currentPage: number;
  totalPages: number;
}

type FormValues = {
  [key: string]: string | string[];
};

export const QuizPage: React.FC<QuizPageProps> = ({
  page,
  onAnswer,
  onNextPage,
  onPrevPage,
  timeRemaining,
  currentPage,
  totalPages,
}): React.ReactElement => {
  const { t } = useLanguage();
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const methods = useForm<FormValues>({
    defaultValues: {},
  });
  
  const { handleSubmit, control, watch } = methods;
  
  // Watch for changes and update answers
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && value[name] !== undefined) {
        onAnswer(name, value[name] as string | string[]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onAnswer]);
  
  const onSubmit = (data: FormValues) => {
    // Save all answers
    Object.entries(data).forEach(([questionId, answer]) => {
      onAnswer(questionId, answer);
    });
    onNextPage();
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {question.text}
            </h3>
            
            {question.image && (
              <img
                src={question.image}
                alt="Question illustration"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <Controller
              name={question.id}
              control={control}
              render={({ field }) => {
                return (
                <div className="space-y-4">
                  {question.options.map((option: QuestionOption) => {
                    const checked = field.value === option.id;

                    return (
                    <div key={option.id} className="relative">
                      <input
                        type="radio"
                        id={option.id}
                        value={option.id}
                        checked={checked}
                        onChange={() => field.onChange(option.id)}
                        className="peer absolute opacity-0 w-full h-full cursor-pointer"
                        aria-labelledby={`label-${option.id}`}
                      />
                      <label 
                        id={`label-${option.id}`}
                        htmlFor={option.id}
                        className="flex w-full p-4 text-sm font-medium text-gray-900 bg-white border-2 
                                 border-gray-200 rounded-lg cursor-pointer dark:text-gray-300 
                                 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 
                                 dark:hover:bg-gray-600 peer-checked:border-blue-600 
                                 peer-checked:text-blue-600 dark:peer-checked:text-blue-500 
                                 peer-checked:bg-blue-50 dark:peer-checked:bg-gray-800 
                                 transition-all duration-200 ease-in-out"
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 mr-3 border-2 flex-shrink-0 relative
                                  ${checked ? 'border-blue-600 dark:border-blue-500' : 'border-gray-300 dark:border-gray-500'}
                                  rounded-full overflow-hidden
                                  transition-all duration-200 ease-in-out`}>
                            {checked && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500
                                            transform scale-100 opacity-100
                                            transition-all duration-200 ease-in-out"></div>
                              </div>
                            )}
                          </div>
                          {option.text}
                        </div>
                      </label>
                    </div>
                  )})}
                </div>
              )}}
            />
          </div>
        );

      case 'multiple-response':
        return (
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {question.text}
            </h3>
            
            {question.image && (
              <img
                src={question.image}
                alt="Question illustration"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <Controller
              name={question.id}
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <div className="space-y-4">
                  {question.options.map((option: QuestionOption) => {
                    const values = field.value as string[] || [];
                    const checked = values.includes(option.id);

                    return (
                      <div key={option.id} className="relative">
                        <input
                          type="checkbox"
                          id={option.id}
                          value={option.id}
                          checked={values.includes(option.id)}
                          onChange={(e) => {
                            const newValues = e.target.checked
                              ? [...values, option.id]
                              : values.filter(id => id !== option.id);
                            field.onChange(newValues);
                          }}
                          className="peer absolute opacity-0 w-full h-full cursor-pointer"
                          aria-labelledby={`label-${option.id}`}
                        />
                        <label 
                          id={`label-${option.id}`}
                          htmlFor={option.id}
                          className="flex w-full p-4 text-sm font-medium text-gray-900 bg-white border-2 
                                   border-gray-200 rounded-lg cursor-pointer dark:text-gray-300 
                                   dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-50 
                                   dark:hover:bg-gray-600 peer-checked:border-blue-600 
                                   peer-checked:text-blue-600 dark:peer-checked:text-blue-500 
                                   peer-checked:bg-blue-50 dark:peer-checked:bg-gray-800 
                                   transition-all duration-200 ease-in-out"
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 mr-3 flex-shrink-0 relative rounded-md transition-all duration-200 ease-in-out ${checked ? 'text-blue-600 dark:text-blue-500' : 'text-gray-300 dark:text-gray-500'}`}>
                              {checked? (
                                <SquareCheck
                                  className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 stroke-[2]"
                                />
                              ) : (
                                <Square
                                  className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 stroke-[2]"
                                />
                              )}
                            </div>
                            {option.text}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            />
          </div>
        );

      case 'fill-in-the-blank':
        return (
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {question.text}
            </h3>
            
            {question.image && (
              <img
                src={question.image}
                alt="Question illustration"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <Controller
              name={question.id}
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder={t('question')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                           focus:ring-blue-500 focus:border-blue-500 block w-full p-4
                           dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                           dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              )}
            />
          </div>
        );
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="text-base font-medium text-gray-900 dark:text-white">
              {currentPage + 1} {t('of')} {totalPages}
            </div>
            <div className="text-base font-medium text-gray-900 dark:text-white bg-gray-100 
                          dark:bg-gray-800 px-4 py-2 rounded-lg font-mono">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 
                        dark:border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {page.title}
            </h2>

            {page.questions.map(renderQuestion)}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onPrevPage}
              disabled={currentPage === 0}
              className="flex items-center px-5 py-2.5 text-sm font-medium text-gray-900 
                       bg-white border border-gray-200 rounded-lg hover:bg-gray-100 
                       hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 
                       dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 
                       dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t('previous')}
            </button>

            <button
              type="submit"
              className="flex items-center px-5 py-2.5 text-sm font-medium text-white 
                       bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                       rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 
                       focus:outline-none dark:focus:ring-blue-800"
            >
              {currentPage === totalPages - 1 ? t('finish') : t('next')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}; 
