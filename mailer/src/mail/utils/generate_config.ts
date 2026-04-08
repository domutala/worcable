import { generateKeyPairSync } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface DNSRecords {
  domain: string;
  spf: { type: string; host: string; value: string };
  dkim: { type: string; host: string; value: string; privateKey: string };
  dmarc: { type: string; host: string; value: string };
}

/**
 * Génère les configurations DNS pour un nouveau domaine utilisateur
 * @param domain - Le domaine entré par l'utilisateur (ex: "mon-app.com")
 * @param selector - Le sélecteur DKIM (Resend utilise souvent 'resend', vous pouvez utiliser 'mail')
 */
export function generateDomainConfig(
  domain: string,
  selector: string = 'worcable',
): DNSRecords {
  const configPath = join(
    process.cwd(),
    `${domain.replaceAll('.', '_')}.pending.dns.json`,
  );

  if (!existsSync(configPath)) {
    // 1. Génération de la paire de clés RSA pour DKIM
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048, // Standard de sécurité actuel
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    // Nettoyage de la clé publique pour l'enregistrement DNS TXT
    // On retire les headers PEM et les retours à la ligne
    const publicKeyClean = publicKey
      .replace(/-----BEGIN PUBLIC KEY-----/, '')
      .replace(/-----END PUBLIC KEY-----/, '')
      .replace(/\s+/g, '');

    const config = {
      domain,
      // Enregistrement SPF : Autorise votre IP ou votre serveur de mail
      spf: {
        type: 'TXT',
        host: '@',
        value: `v=spf1 include:mailer.worcable.space ~all`,
      },
      // Enregistrement DKIM : Permet de vérifier la signature des mails
      dkim: {
        type: 'TXT',
        host: `${selector}._domainkey`,
        value: `v=DKIM1; k=rsa; p=${publicKeyClean}`,
        privateKey: privateKey, // À stocker de façon sécurisée (Chiffrée si possible)
      },
      // Enregistrement DMARC : Conseille quoi faire en cas d'échec
      dmarc: {
        type: 'TXT',
        host: '_dmarc',
        value: `v=DMARC1; p=none;`, // 'none' pour commencer sans bloquer
      },
    };

    writeFileSync(
      join(process.cwd(), `${domain.replaceAll('.', '_')}.pending.dns.json`),
      JSON.stringify(config),
    );

    return config;
  } else {
    const config = JSON.parse(readFileSync(configPath, 'utf-8')) as DNSRecords;
    return config;
  }
}
