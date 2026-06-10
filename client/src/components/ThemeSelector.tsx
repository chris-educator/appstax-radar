import { THEME_OPTIONS } from '../constants/theme'
import { useTheme } from '../context/ThemeContext'

export function ThemeSelector() {
  const { preference, setPreference } = useTheme()
  return (
    <div className="theme-selector" role="group" aria-label="Theme">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            preference === option.value ? 'theme-selector__btn is-active' : 'theme-selector__btn'
          }
          onClick={() => setPreference(option.value)}
          aria-label={option.ariaLabel}
          aria-pressed={preference === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
