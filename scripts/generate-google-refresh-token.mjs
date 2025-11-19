import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(process.cwd(), 'google-token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function generateRefreshToken() {
  try {
    // Carregar credenciais do arquivo JSON que você baixou do Google Cloud
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.error('❌ Arquivo credentials.json não encontrado!');
      console.log('📝 Passos:');
      console.log('1. Acesse: https://console.cloud.google.com/apis/credentials');
      console.log('2. Clique no cliente OAuth2 que você criou');
      console.log('3. Clique em "Download JSON"');
      console.log('4. Salve como "credentials.json" na pasta do projeto');
      process.exit(1);
    }

    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_id, client_secret, redirect_uris } = credentials.installed;

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Gerar URL de autenticação
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('🔐 Abra este link no navegador e autorize:');
    console.log(authUrl);
    console.log('\n⏳ Aguardando autorização...\n');

    // Aqui você precisa fazer login manualmente e copiar o código
    // Para simplificar, vamos usar local-auth que faz isso automaticamente
    const auth = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });

    const tokens = auth.credentials;
    
    if (tokens.refresh_token) {
      console.log('✅ Refresh Token gerado com sucesso!');
      console.log('\n📋 Copie este valor:');
      console.log('GOOGLE_OAUTH_REFRESH_TOKEN=' + tokens.refresh_token);
      
      // Salvar token para referência
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
      console.log('\n✅ Token salvo em google-token.json');
    } else {
      console.error('❌ Não foi possível gerar o refresh token');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

generateRefreshToken();
