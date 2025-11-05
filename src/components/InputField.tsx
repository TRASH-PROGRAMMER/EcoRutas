import { useState, useEffect, InputHTMLAttributes } from 'react';
import { validateField, debounce, ValidationResult } from '../utils/validaciones/validaciones';

interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  name: string;
  error?: string;
  helpText?: string;
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean, error?: string) => void;
  onChange?: (value: string) => void;
  compareValue?: string; // Para confirmación de contraseña
}

export const InputField = ({
  label,
  name,
  type = 'text',
  value = '',
  error,
  helpText,
  showValidation = true,
  onValidationChange,
  onChange,
  compareValue,
  required = false,
  placeholder,
  ...rest
}: InputFieldProps) => {
  const [internalValue, setInternalValue] = useState(value as string);
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });
  const [showPassword, setShowPassword] = useState(false);

  // Determinar si mostrar error
  const shouldShowError = touched && showValidation && (error || validationResult.error);
  const errorMessage = error || validationResult.error;

  // Determinar si mostrar éxito
  const shouldShowSuccess = touched && showValidation && !error && validationResult.isValid && internalValue.length > 0;

  // Validación con debounce
  const debouncedValidation = debounce((fieldName: string, fieldValue: string, compareVal?: string) => {
    const result = validateField(fieldName, fieldValue, compareVal);
    setValidationResult(result);
    
    if (onValidationChange) {
      onValidationChange(result.isValid, result.error);
    }
  }, 300);

  // Efecto para validación cuando cambia el valor o compareValue
  useEffect(() => {
    if (touched && internalValue) {
      debouncedValidation(name, internalValue, compareValue);
    }
  }, [internalValue, compareValue, touched, name]);

  // Manejar cambio de valor
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  // Manejar blur (cuando pierde el foco)
  const handleBlur = () => {
    setTouched(true);
  };

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determinar el tipo de input
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Clases dinámicas para el input
  const inputClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    ${shouldShowError 
      ? 'border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50' 
      : shouldShowSuccess 
        ? 'border-green-500 focus:border-green-500 focus:ring-green-200 bg-green-50'
        : 'border-gray-300 focus:border-primary-600 focus:ring-primary-200 bg-white'
    }
    ${rest.disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
  `;

  return (
    <div className="w-full space-y-1.5">
      {/* Label */}
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        
        {/* Tooltip de ayuda */}
        {helpText && (
          <button
            type="button"
            className="ml-2 inline-flex items-center justify-center w-4 h-4 text-xs text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            title={helpText}
            aria-label={`Ayuda para ${label}`}
          >
            ?
          </button>
        )}
      </label>

      {/* Input Container */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={shouldShowError ? 'true' : 'false'}
          aria-describedby={shouldShowError ? `${name}-error` : undefined}
          {...rest}
        />

        {/* Icono de validación o botón ver contraseña */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Botón mostrar/ocultar contraseña */}
          {type === 'password' && internalValue.length > 0 && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}

          {/* Icono de validación */}
          {showValidation && touched && internalValue.length > 0 && type !== 'password' && (
            <>
              {shouldShowError && (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {shouldShowSuccess && (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mensaje de error */}
      {shouldShowError && (
        <p 
          id={`${name}-error`}
          className="text-sm text-red-600 flex items-start gap-1 animate-slide-up"
        >
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{errorMessage}</span>
        </p>
      )}

      {/* Mensaje de ayuda (cuando no hay error) */}
      {!shouldShowError && helpText && (
        <p className="text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};