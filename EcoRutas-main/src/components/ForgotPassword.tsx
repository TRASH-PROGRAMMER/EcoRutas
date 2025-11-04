import { useState } from 'react';
import { validateEmailDetailed, sanitizeInput } from '@/utils/validaciones/validaciones';
import { useToast } from './Toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const toast = useToast();
  const [step, setStep] = useState<'email' | 'code' | 'newPassword' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  if (!isOpen) return null;

  // Reiniciar estado al cerrar
  const handleClose = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setTimer(60);
    setCanResend(false);
    onClose();
  };

  // Paso 1: Solicitar email
  const handleSendCode = async () => {
    setError('');
    const validation = validateEmailDetailed(email);
    
    if (!validation.isValid) {
      setError(validation.error || 'Email inválido');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío de código (reemplazar con API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí iría tu llamada a la API:
      // await fetch('/api/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      toast.success('Código enviado', 'Revisa tu email');
      setStep('code');
      
      // Iniciar contador de reenvío
      startTimer();
    } catch (err) {
      setError('Error al enviar el código. Intenta nuevamente');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timer para reenvío de código
  const startTimer = () => {
    setCanResend(false);
    setTimer(60);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Paso 2: Validar código
  const handleVerifyCode = async () => {
    setError('');
    
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular verificación de código (reemplazar con API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría tu llamada a la API:
      // const response = await fetch('/api/verify-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, code }),
      // });

      // Código correcto - avanzar al siguiente paso
      toast.success('Código verificado', 'Ahora crea tu nueva contraseña');
      setStep('newPassword');
    } catch (err) {
      setError('Código incorrecto. Verifica e intenta nuevamente');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paso 3: Establecer nueva contraseña
  const handleResetPassword = async () => {
    setError('');

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError('La contraseña debe tener al menos una mayúscula');
      return;
    }

    if (!/\d/.test(newPassword)) {
      setError('La contraseña debe tener al menos un número');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular cambio de contraseña (reemplazar con API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí iría tu llamada a la API:
      // await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, code, newPassword }),
      // });

      toast.success('Contraseña actualizada', '¡Ya puedes iniciar sesión!');
      setStep('success');
      
      // Cerrar modal después de 3 segundos
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      setError('Error al actualizar la contraseña. Intenta nuevamente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 pointer-events-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 'email' && 'Recuperar Contraseña'}
              {step === 'code' && 'Verificar Código'}
              {step === 'newPassword' && 'Nueva Contraseña'}
              {step === 'success' && '¡Listo!'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido según el paso */}
          <div className="space-y-4">
            {/* Paso 1: Email */}
            {step === 'email' && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Ingresa tu email y te enviaremos un código de verificación para restablecer tu contraseña.
                </p>
                
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(sanitizeInput(e.target.value));
                      setError('');
                    }}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                    autoFocus
                  />
                  {error && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSendCode}
                    disabled={isSubmitting || !email}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      'Enviar código'
                    )}
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}

            {/* Paso 2: Código de verificación */}
            {step === 'code' && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
                </p>
                
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Código de Verificación
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setCode(value);
                      setError('');
                    }}
                    placeholder="123456"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    autoFocus
                  />
                  {error && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>

                {/* Reenviar código */}
                <div className="text-center">
                  {canResend ? (
                    <button
                      onClick={handleSendCode}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Reenviar código
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Reenviar código en <strong>{timer}s</strong>
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleVerifyCode}
                    disabled={isSubmitting || code.length !== 6}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verificando...
                      </>
                    ) : (
                      'Verificar código'
                    )}
                  </button>
                  <button
                    onClick={() => setStep('email')}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Atrás
                  </button>
                </div>
              </>
            )}

            {/* Paso 3: Nueva contraseña */}
            {step === 'newPassword' && (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Crea una nueva contraseña segura para tu cuenta.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nueva Contraseña
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirmar Contraseña
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Repite tu contraseña"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-600 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  )}

                  {/* Requisitos de contraseña */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <p className="text-xs font-medium text-gray-700 mb-1">La contraseña debe tener:</p>
                    <div className="flex items-center gap-2 text-xs">
                      {newPassword.length >= 8 ? (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={newPassword.length >= 8 ? 'text-green-700' : 'text-gray-500'}>
                        Mínimo 8 caracteres
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {/[A-Z]/.test(newPassword) ? (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={/[A-Z]/.test(newPassword) ? 'text-green-700' : 'text-gray-500'}>
                        Una letra mayúscula
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {/\d/.test(newPassword) ? (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={/\d/.test(newPassword) ? 'text-green-700' : 'text-gray-500'}>
                        Un número
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleResetPassword}
                    disabled={isSubmitting || !newPassword || !confirmPassword}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Actualizando...
                      </>
                    ) : (
                      'Actualizar contraseña'
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Paso 4: Éxito */}
            {step === 'success' && (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Contraseña actualizada!
                </h3>
                <p className="text-sm text-gray-600">
                  Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};