import { useEffect, useState } from 'react';
import { getPasswordStrength, PasswordStrength as PasswordStrengthType } from '../utils/validaciones/validaciones';

interface PasswordStrengthProps {
  password: string;
  showLabel?: boolean;
  showRequirements?: boolean;
}

export const PasswordStrength = ({ 
  password, 
  showLabel = true,
  showRequirements = false 
}: PasswordStrengthProps) => {
  const [strength, setStrength] = useState<PasswordStrengthType>({
    score: 0,
    label: 'Sin contraseña',
    color: '#d1d5db',
    percentage: 0,
  });

  useEffect(() => {
    if (password) {
      const result = getPasswordStrength(password);
      setStrength(result);
    } else {
      setStrength({
        score: 0,
        label: 'Sin contraseña',
        color: '#d1d5db',
        percentage: 0,
      });
    }
  }, [password]);

  // Requisitos de contraseña
  const requirements = [
    { met: password.length >= 8, text: 'Mínimo 8 caracteres' },
    { met: /[A-Z]/.test(password), text: 'Una letra mayúscula' },
    { met: /[a-z]/.test(password), text: 'Una letra minúscula' },
    { met: /\d/.test(password), text: 'Un número' },
    { met: /[^a-zA-Z0-9]/.test(password), text: 'Un carácter especial (opcional)' },
  ];

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2">
      {/* Barra de fortaleza */}
      <div className="space-y-1">
        {/* Contenedor de la barra */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full"
            style={{
              width: `${strength.percentage}%`,
              backgroundColor: strength.color,
            }}
          />
        </div>

        {/* Label de fortaleza */}
        {showLabel && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: strength.color }}>
              {strength.label}
            </span>
            <span className="text-xs text-gray-500">
              {strength.percentage}%
            </span>
          </div>
        )}
      </div>

      {/* Lista de requisitos */}
      {showRequirements && (
        <div className="space-y-1 pt-1">
          <p className="text-xs font-medium text-gray-600">Requisitos:</p>
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              {req.met ? (
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};