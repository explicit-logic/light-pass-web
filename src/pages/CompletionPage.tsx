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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('congratulations')}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {t('quizCompleted')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowDialog(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl
                         font-semibold flex items-center justify-center gap-2
                         hover:bg-indigo-700 transform transition-all
                         hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-5 h-5" />
              <Key className="w-5 h-5" />
              {t('downloadAnswers')}
            </button>
            
            <button
              onClick={onRestart}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700
                         text-gray-800 dark:text-white rounded-xl font-semibold
                         hover:bg-gray-300 dark:hover:bg-gray-600
                         transform transition-all hover:scale-[1.02]"
            >
              {t('startNewQuiz')}
            </button>
          </div>
        </div>

        {showDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t('enterInformation')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600
                               rounded-lg bg-white dark:bg-gray-700
                               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600
                               rounded-lg bg-white dark:bg-gray-700
                               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleDownload}
                  disabled={!userInfo.name || !userInfo.email}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl
                             font-semibold disabled:opacity-50 disabled:cursor-not-allowed
                             hover:bg-indigo-700 transform transition-all
                             hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t('download')}
                </button>
                
                <button
                  onClick={() => setShowDialog(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700
                             text-gray-800 dark:text-white rounded-xl font-semibold
                             hover:bg-gray-300 dark:hover:bg-gray-600"
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
