import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SecurityState {
  isBiometricEnabled: boolean
  isLocked: boolean
  setBiometricEnabled: (enabled: boolean) => void
  setLocked: (locked: boolean) => void
  isSupported: () => Promise<boolean>
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      isBiometricEnabled: false,
      isLocked: false,
      
      setBiometricEnabled: (enabled: boolean) => {
        set({ isBiometricEnabled: enabled })
      },
      
      setLocked: (locked: boolean) => {
        set({ isLocked: locked })
      },
      
      isSupported: async () => {
        // Verificar se o navegador suporta WebAuthn e se há um autenticador de plataforma disponível
        if (window.PublicKeyCredential) {
          try {
            const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            return available;
          } catch (e) {
            return false;
          }
        }
        return false;
      }
    }),
    {
      name: 'security-storage',
      partialize: (state) => ({
        isBiometricEnabled: state.isBiometricEnabled,
      }),
    }
  )
)
