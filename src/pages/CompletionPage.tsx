import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Key } from 'lucide-react';
import quizData from '@/data/quiz.json';
import { useLanguage } from '@/hooks/useLanguage';
import { generateKeyPair, encryptData, importPublicKey } from '@/utils/crypto';

interface CompletionPageProps {
  answers: Record<string, string | string[]>;
  onRestart: () => void;
}

interface AnswerData {
  question: string;
  questionType: 'multiple-choice' | 'multiple-response' | 'fill-in-blank';
  imageUrl?: string;
  options?: string[];
  selectedAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
}

export const CompletionPage: React.FC<CompletionPageProps> = ({ answers, onRestart }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [keyPair, setKeyPair] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const initializeKeys = async () => {
      const keys = await generateKeyPair();
      setKeyPair(keys);
    };
    initializeKeys();
  }, []);

  const formatAnswers = (): Record<string, AnswerData> => {
    const formattedAnswers: Record<string, AnswerData> = {};
    
    quizData.questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      formattedAnswers[question.id] = {
        question: question.question,
        questionType: question.type as AnswerData['questionType'],
        imageUrl: question.imageUrl,
        options: question.options,
        selectedAnswer: userAnswer || (question.type === 'multiple-response' ? [] : ''),
        correctAnswer: question.correctAnswer,
        isCorrect: Array.isArray(question.correctAnswer)
          ? JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)
          : userAnswer === question.correctAnswer
      };
    });

    return formattedAnswers;
  };

  const calculateScore = () => {
    const answers = formatAnswers();
    const correct = Object.values(answers).filter(a => a.isCorrect).length;
    const total = quizData.questions.length;
    const percentage = (correct / total) * 100;
    return {
      correct,
      total,
      percentage: Math.round(percentage * 10) / 10
    };
  };

  const handleDownload = async () => {
    if (!keyPair) return;

    const score = calculateScore();
    const downloadData = {
      studentInfo: userInfo,
      quizInfo: {
        title: quizData.title,
        description: quizData.description,
        timeLimit: quizData.timeLimit,
      },
      submissionInfo: {
        timestamp: new Date().toISOString(),
        score: score
      },
      answers: formatAnswers()
    };

    try {
      // Import the public key and encrypt the data
      const publicKey = await importPublicKey(keyPair.publicKey);
      const encryptedResult = await encryptData(JSON.stringify(downloadData), publicKey);

      // Create the final encrypted package
      const encryptedPackage = {
        encryptedData: encryptedResult.encryptedData,
        encryptedKey: encryptedResult.encryptedKey,
        iv: encryptedResult.iv,
        publicKey: keyPair.publicKey
      };

      // Download the encrypted data
      const encryptedBlob = new Blob(
        [JSON.stringify(encryptedPackage, null, 2)],
        { type: 'application/json' }
      );
      const encryptedUrl = URL.createObjectURL(encryptedBlob);
      const encryptedLink = document.createElement('a');
      encryptedLink.href = encryptedUrl;
      encryptedLink.download = `quiz-answers-${userInfo.name.toLowerCase().replace(/\s+/g, '-')}-encrypted.json`;
      document.body.appendChild(encryptedLink);
      encryptedLink.click();
      document.body.removeChild(encryptedLink);
      URL.revokeObjectURL(encryptedUrl);

      // Download the private key separately
      const privateKeyBlob = new Blob(
        [keyPair.privateKey],
        { type: 'text/plain' }
      );
      const privateKeyUrl = URL.createObjectURL(privateKeyBlob);
      const privateKeyLink = document.createElement('a');
      privateKeyLink.href = privateKeyUrl;
      privateKeyLink.download = `private-key-${userInfo.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(privateKeyLink);
      privateKeyLink.click();
      document.body.removeChild(privateKeyLink);
      URL.revokeObjectURL(privateKeyUrl);

      setShowDialog(false);
    } catch (error) {
      console.error('Error encrypting data:', error);
      alert('An error occurred while encrypting the data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl w-full">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 
                        dark:border-gray-700 mb-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 
                         dark:text-white">
            {t('congratulations')}
          </h1>
          
          <p className="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400">
            {t('quizCompleted')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowDialog(true)}
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium 
                         text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 
                         focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 
                         dark:focus:ring-blue-800"
            >
              <Download className="w-5 h-5 mr-2" />
              <Key className="w-5 h-5 mr-2" />
              {t('downloadAnswers')}
            </button>
            
            <button
              onClick={onRestart}
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium 
                         text-center text-gray-900 bg-white border border-gray-300 rounded-lg 
                         hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 
                         dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 
                         dark:hover:border-gray-700 dark:focus:ring-gray-700"
            >
              {t('startNewQuiz')}
            </button>
          </div>
        </div>

        {showDialog && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('enterInformation')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                               focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                               dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                               dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleDownload}
                  disabled={!userInfo.name || !userInfo.email}
                  className="flex-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                             focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 
                             dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('download')}
                </button>
                
                <button
                  onClick={() => setShowDialog(false)}
                  className="flex-1 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 
                             focus:ring-gray-200 border border-gray-200 rounded-lg text-sm 
                             font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 
                             dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 
                             dark:hover:text-white dark:hover:bg-gray-600 
                             dark:focus:ring-gray-600"
                >
                  {t('cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
