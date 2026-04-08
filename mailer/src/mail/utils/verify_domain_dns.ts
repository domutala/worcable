import dns from 'dns/promises';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DNSRecords } from './generate_config';

interface VerificationResult {
  spfValid: boolean;
  dkimValid: boolean;
  dmarcValid: boolean;
  allValid: boolean;
}

/**
 * Vérifie la présence des enregistrements DNS pour un domaine
 * @param domain - Le domaine à vérifier (ex: client-startup.io)
 */
export async function verifyDomainDns(
  domain: string,
): Promise<VerificationResult> {
  const results = {
    spfValid: false,
    dkimValid: false,
    dmarcValid: false,
    allValid: false,
  };

  try {
    const configPath = join(
      process.cwd(),
      `${domain.replaceAll('.', '_')}.pending.dns.json`,
    );

    const config = JSON.parse(readFileSync(configPath, 'utf-8')) as DNSRecords;

    // 1. Vérification du DKIM (Le plus important)
    // On cherche l'enregistrement TXT sur selector._domainkey.domain.com
    const dkimRecords = await dns.resolveTxt(`${config.dkim.host}.${domain}`);
    // resolveTxt retourne un tableau de tableaux (car un record TXT peut être splitté)
    const flatDkim = dkimRecords.map((r) => r.join('')).join('');
    results.dkimValid = flatDkim.includes(config.dkim.value.trim());

    // 2. Vérification du SPF
    const spfRecords = await dns.resolveTxt(domain);
    const flatSpf = spfRecords.map((r) => r.join('')).join('');
    // On vérifie si votre service est inclus dans le SPF
    results.spfValid =
      flatSpf.includes('v=spf1') && flatSpf.includes('mailer.worcable.space');

    // 3. Vérification du DMARC (Optionnel mais recommandé)
    try {
      const dmarcRecords = await dns.resolveTxt(`_dmarc.${domain}`);
      const flatDmarc = dmarcRecords.map((r) => r.join('')).join('');
      results.dmarcValid = flatDmarc.includes('v=DMARC1');
    } catch {
      results.dmarcValid = false;
    }

    results.allValid = results.dkimValid && results.spfValid;
  } catch (error) {
    console.error(`Erreur lors de la vérification DNS pour ${domain}:`, error);
  }

  return results;
}
