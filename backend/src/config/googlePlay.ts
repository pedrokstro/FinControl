import { config } from './env';
import fs from 'fs';
import path from 'path';

/**
 * Obter caminho do arquivo de credenciais do Google Play
 * Em produção (Render), decodifica de Base64
 * Em desenvolvimento, usa arquivo local
 */
export function getGooglePlayCredentialsPath(): string {
  // Se estiver em produção e tiver a variável Base64
  if (process.env.NODE_ENV === 'production' && process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64) {
    const base64Credentials = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_BASE64;
    const jsonCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    
    // Criar arquivo temporário
    const tempPath = path.join('/tmp', 'google-play-service-account.json');
    fs.writeFileSync(tempPath, jsonCredentials);
    
    console.log('✅ Google Play credentials loaded from Base64 (Render)');
    return tempPath;
  }
  
  // Em desenvolvimento, usar arquivo local
  console.log('✅ Google Play credentials loaded from local file (Development)');
  return config.googlePlay.serviceAccountKeyPath;
}
