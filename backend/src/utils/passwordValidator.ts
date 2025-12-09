/**
 * Validador de senha forte
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PasswordValidator {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 128;

  /**
   * Validar força da senha
   */
  static validate(password: string): PasswordValidationResult {
    const errors: string[] = [];

    // Verificar comprimento mínimo
    if (password.length < this.MIN_LENGTH) {
      errors.push(`A senha deve ter no mínimo ${this.MIN_LENGTH} caracteres`);
    }

    // Verificar comprimento máximo
    if (password.length > this.MAX_LENGTH) {
      errors.push(`A senha deve ter no máximo ${this.MAX_LENGTH} caracteres`);
    }

    // Verificar se contém letra maiúscula
    if (!/[A-Z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }

    // Verificar se contém letra minúscula
    if (!/[a-z]/.test(password)) {
      errors.push('A senha deve conter pelo menos uma letra minúscula');
    }

    // Verificar se contém número
    if (!/\d/.test(password)) {
      errors.push('A senha deve conter pelo menos um número');
    }

    // Verificar se contém caractere especial
    if (!/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(password)) {
      errors.push('A senha deve conter pelo menos um caractere especial (@$!%*?&#^()_+-=[]{};\':"|,.<>/)');
    }

    // Verificar se não contém espaços
    if (/\s/.test(password)) {
      errors.push('A senha não pode conter espaços');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Verificar se duas senhas são iguais
   */
  static areEqual(password1: string, password2: string): boolean {
    return password1 === password2;
  }

  /**
   * Calcular força da senha (0-100)
   */
  static calculateStrength(password: string): number {
    let strength = 0;

    // Comprimento (máximo 40 pontos)
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;

    // Variedade de caracteres (máximo 60 pontos)
    if (/[a-z]/.test(password)) strength += 15; // Minúsculas
    if (/[A-Z]/.test(password)) strength += 15; // Maiúsculas
    if (/\d/.test(password)) strength += 15; // Números
    if (/[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/.test(password)) strength += 15; // Especiais

    return Math.min(strength, 100);
  }

  /**
   * Obter descrição da força da senha
   */
  static getStrengthDescription(strength: number): string {
    if (strength < 40) return 'Fraca';
    if (strength < 70) return 'Média';
    if (strength < 90) return 'Forte';
    return 'Muito Forte';
  }

  /**
   * Validar e retornar mensagem amigável
   */
  static validateWithMessage(password: string): { isValid: boolean; message: string } {
    const result = this.validate(password);
    
    if (result.isValid) {
      const strength = this.calculateStrength(password);
      const description = this.getStrengthDescription(strength);
      return {
        isValid: true,
        message: `Senha ${description.toLowerCase()} (${strength}%)`,
      };
    }

    return {
      isValid: false,
      message: result.errors.join('. '),
    };
  }
}
