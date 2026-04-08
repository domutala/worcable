import { DNSRecords } from './generate_config';

interface Instruction {
  type: string;
  host: string;
  value: string;
  purpose: string;
}

interface DomainInstructionResponse {
  status: string;
  domain: string;
  instructions: Instruction[];
}

/**
 * Transforme les données de configuration en instructions lisibles pour l'utilisateur
 * @param config - L'objet retourné par generateDomainConfig
 */
export function formatDomainInstructions(
  config: DNSRecords,
): DomainInstructionResponse {
  return {
    status: 'pending',
    domain: config.domain,
    instructions: [
      {
        type: config.dkim.type,
        host: config.dkim.host,
        value: config.dkim.value,
        purpose: 'DKIM (Signature des emails)',
      },
      {
        type: config.spf.type,
        host: config.spf.host,
        value: config.spf.value,
        purpose: "SPF (Autorisation d'envoi)",
      },
      {
        type: config.dmarc.type,
        host: config.dmarc.host,
        value: config.dmarc.value,
        purpose: 'DMARC (Politique de sécurité)',
      },
    ],
  };
}
