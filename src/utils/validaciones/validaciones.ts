
/**
 * Valida que el email tenga formato correcto
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida la contraseña:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos un número
 */
export const isValidPassword = (password: string): boolean => {
  const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

/**
 * Valida que el nombre no esté vacío y tenga mínimo 2 caracteres
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2;
};

/**
 * Valida que la contraseña y confirmación coincidan
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Valida que el rol sea uno de los permitidos
 */
export const isValidRole = (role: string): boolean => {
  const roles = ["administrador", "guia", "turista"];
  return roles.includes(role.toLowerCase());
};

/**
 * Validación completa para registro
 */
export const validateRegister = (data: {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidName(data.nombre)) errors.push("Nombre inválido (mínimo 2 caracteres)");
  if (!isValidEmail(data.email)) errors.push("Email inválido");
  if (!isValidPassword(data.password)) errors.push("Contraseña inválida (mínimo 8 caracteres, una mayúscula, un número)");
  if (!doPasswordsMatch(data.password, data.confirmPassword)) errors.push("Las contraseñas no coinciden");
  if (!isValidRole(data.rol)) errors.push("Rol inválido");

  return { valid: errors.length === 0, errors };
};

/**
 * Validación para login
 */
export const validateLogin = (data: { email: string; password: string }): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!isValidEmail(data.email)) errors.push("Email inválido");
  if (!data.password) errors.push("Contraseña requerida");

  return { valid: errors.length === 0, errors };
};

// ========================================
// 🆕 VALIDACIONES MEJORADAS PARA RÚBRICA
// ========================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordStrength {
  score: number; // 0-5
  label: string;
  color: string;
  percentage: number; // Para barra visual
}

/**
 * 🆕 Validación de email con mensajes específicos
 */
export const validateEmailDetailed = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'El email es requerido' };
  }

  if (email.length > 100) {
    return { isValid: false, error: 'Email demasiado largo' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }

  return { isValid: true };
};

/**
 * 🆕 Validación de nombre con mensajes específicos
 */
export const validateNameDetailed = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'El nombre es requerido' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Mínimo 2 caracteres' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Máximo 50 caracteres' };
  }

  // Solo letras, espacios y acentos
  const nameRegex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s'-]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Solo letras y espacios' };
  }

  return { isValid: true };
};

/**
 * 🆕 Validación de contraseña con mensajes específicos
 */
export const validatePasswordDetailed = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Mínimo 8 caracteres' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Requiere una mayúscula' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Requiere un número' };
  }

  return { isValid: true };
};

/**
 * 🆕 Fortaleza de contraseña (para barra visual)
 */
export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return { score: 0, label: 'Sin contraseña', color: '#d1d5db', percentage: 0 };
  }

  let score = 0;

  // Criterios de fortaleza
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Determinar nivel
  const levels: Record<number, { label: string; color: string; percentage: number }> = {
    0: { label: 'Muy débil', color: '#ef4444', percentage: 0 },
    1: { label: 'Muy débil', color: '#ef4444', percentage: 20 },
    2: { label: 'Débil', color: '#f97316', percentage: 40 },
    3: { label: 'Media', color: '#eab308', percentage: 60 },
    4: { label: 'Fuerte', color: '#22c55e', percentage: 80 },
    5: { label: 'Muy fuerte', color: '#16a34a', percentage: 100 },
  };

  const level = levels[score] || levels[0];

  return {
    score,
    label: level.label,
    color: level.color,
    percentage: level.percentage,
  };
};

/**
 * 🆕 Validación de confirmación de contraseña
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmation: string
): ValidationResult => {
  if (!confirmation) {
    return { isValid: false, error: 'Confirma tu contraseña' };
  }

  if (password !== confirmation) {
    return { isValid: false, error: 'Las contraseñas no coinciden' };
  }

  return { isValid: true };
};

/**
 * 🆕 Sanitización de inputs (seguridad)
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/\s+/g, ' ') // Múltiples espacios a uno
    .replace(/[<>]/g, ''); // Remover caracteres peligrosos
};

/**
 * 🆕 Validación individual de campo (para validación en tiempo real)
 */
export const validateField = (
  fieldName: string,
  value: string,
  otherValue?: string
): ValidationResult => {
  switch (fieldName) {
    case 'nombre':
    case 'name':
      return validateNameDetailed(value);
    
    case 'email':
      return validateEmailDetailed(value);
    
    case 'password':
    case 'contraseña':
      return validatePasswordDetailed(value);
    
    case 'confirmPassword':
    case 'confirmarContraseña':
      return validatePasswordConfirmation(otherValue || '', value);
    
    case 'rol':
    case 'role':
      if (!value) return { isValid: false, error: 'Selecciona un rol' };
      if (!isValidRole(value)) return { isValid: false, error: 'Rol inválido' };
      return { isValid: true };
    
    default:
      return { isValid: true };
  }
};

/**
 * 🆕 Debounce para validación mientras se escribe
 * Retrasa la validación hasta que el usuario deje de escribir
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 🆕 Validación completa mejorada con errores específicos por campo
 */
export const validateRegisterForm = (data: {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: string;
}): { 
  valid: boolean; 
  errors: { [key: string]: string };
  globalErrors: string[];
} => {
  const errors: { [key: string]: string } = {};
  const globalErrors: string[] = [];

  // Validar cada campo
  const nameResult = validateNameDetailed(data.nombre);
  if (!nameResult.isValid) errors.nombre = nameResult.error!;

  const emailResult = validateEmailDetailed(data.email);
  if (!emailResult.isValid) errors.email = emailResult.error!;

  const passwordResult = validatePasswordDetailed(data.password);
  if (!passwordResult.isValid) errors.password = passwordResult.error!;

  const confirmResult = validatePasswordConfirmation(data.password, data.confirmPassword);
  if (!confirmResult.isValid) errors.confirmPassword = confirmResult.error!;

  if (!isValidRole(data.rol)) {
    errors.rol = 'Selecciona un rol válido';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    globalErrors,
  };
};