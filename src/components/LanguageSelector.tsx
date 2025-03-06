import { LanguageButton } from './LanguageButton';

export const LanguageSelector = () => {
  return (
    <div className="fixed top-4 left-4 flex items-center gap-2">
      <div className="flex gap-1">
        <LanguageButton lang="en" label="EN" />
        <LanguageButton lang="uk" label="UK" />
      </div>
    </div>
  );
};
