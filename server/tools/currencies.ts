export const currenciesCodes = [
  "USD",
  "CAD",
  "EUR",
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ARS",
  "AUD",
  "AZN",
  "BAM",
  "BDT",
  "BGN",
  "BHD",
  "BIF",
  "BND",
  "BOB",
  "BRL",
  "BWP",
  "BYN",
  "BZD",
  "CDF",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CRC",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EEK",
  "EGP",
  "ERN",
  "ETB",
  "GBP",
  "GEL",
  "GHS",
  "GNF",
  "GTQ",
  "HKD",
  "HNL",
  "HRK",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "IQD",
  "IRR",
  "ISK",
  "JMD",
  "JOD",
  "JPY",
  "KES",
  "KHR",
  "KMF",
  "KRW",
  "KWD",
  "KZT",
  "LBP",
  "LKR",
  "LTL",
  "LVL",
  "LYD",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MOP",
  "MUR",
  "MXN",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "NZD",
  "OMR",
  "PAB",
  "PEN",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SDG",
  "SEK",
  "SGD",
  "SOS",
  "SYP",
  "THB",
  "TND",
  "TOP",
  "TRY",
  "TTD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "UYU",
  "UZS",
  "VEF",
  "VND",
  "XAF",
  "XOF",
  "YER",
  "ZAR",
  "ZMK",
  "ZWL",
];

export const currencySalaryMultiples = [
  {
    currencies: [
      "EUR",
      "USD",
      "GBP",
      "CHF",
      "CAD",
      "AUD",
      "SGD",
      "BHD",
      "KWD",
      "OMR",
      "ILS",
      "TND",
    ],
    multiple: 500,
    max: 200_000,
  },

  {
    currencies: [
      "PEN",
      "AED",
      "ARS",
      "AZN",
      "BGN",
      "BRL",
      "BWP",
      "BYN",
      "CNY",
      "CZK",
      "DKK",
      "GEL",
      "HKD",
      "HRK",
      "LYD",
      "MAD",
      "MYR",
      "NOK",
      "PLN",
      "QAR",
      "RON",
      "SAR",
      "SEK",
      "TRY",
      "TTD",
      "TWD",
      "ZAR",
      "MXN",
      "IQD",
    ],
    multiple: 1_000,
    max: 2_200_000,
  },

  {
    currencies: [
      "GHS",

      //--

      "EGP",
      "INR",
      "LKR",
      "MUR",
      "THB",
      "UAH",
      "PHP",
    ],
    multiple: 2_000,
    max: 12_000_000,
  },

  {
    currencies: ["AFN", "ALL", "KES", "DZD", "ISK", "JPY", "ETB", "MZN"],
    multiple: 5_000,
    max: 30_000_000,
  },

  {
    currencies: [
      // 30 miilions
      "XOF",
      "XAF",
      "UZS",
      "VND",
      "YER",
      "HUF",
      "KMF",
      "KZT",
      "SOS",
      "AMD",
      "CLP",
      "CRC",
      "PKR",
    ],
    multiple: 50_000,
    max: 130_000_000,
  },

  {
    currencies: [
      // 100 millions
      "NGN",
      "CDF",
      "RWF",
    ],
    multiple: 10_000,
    max: 340_000_000,
  },

  {
    currencies: [
      // billion
      "IDR",
      "IRR",
      "GNF",
      "KHR",
      "KRW",
      "LBP",
      "MGA",
      "MMK",
      "PYG",
      "TZS",
      "BIF",
      "COP",
      "UGX",
      "ZWL",
    ],
    multiple: 1_000_000,
    max: 655_000_000,
  },
];

const DEFAULT_SALARY_MULTIPLE = 500;
export function getSalaryMultiple(currencyCode: string): number {
  const salaryMultipleMap: Record<string, number> =
    currencySalaryMultiples.reduce<Record<string, number>>(
      (acc, { currencies, multiple }) => {
        for (const currency of currencies) {
          acc[currency] = multiple;
        }
        return acc;
      },
      {},
    );

  return salaryMultipleMap[currencyCode] ?? 200_000;
}

export function getSalaryMax(currencyCode: string): number {
  const salaryMaxMap: Record<string, number> = currencySalaryMultiples.reduce<
    Record<string, number>
  >((acc, { currencies, max }) => {
    for (const currency of currencies) {
      acc[currency] = max;
    }
    return acc;
  }, {});

  return salaryMaxMap[currencyCode] ?? 500;
}

/**
 * Formate un nombre en fonction du code de devise (ISO 4217).
 * @param amount - Le montant à formater
 * @param currencyCode - Le code (ex: 'EUR', 'XOF', 'USD')
 * @param locale - Optionnel : la locale (par défaut celle du navigateur)
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string,
  {
    locale = "fr",
    style = "decimal",
  }: { locale?: string; style?: Intl.NumberFormatOptionsStyle } = {},
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style,
      currency: currencyCode,
      // Optionnel : masquer les centimes pour les grosses monnaies comme le XOF
      minimumFractionDigits: ["XOF", "XAF", "JPY", "KRW"].includes(currencyCode)
        ? 0
        : 2,
      maximumFractionDigits: ["XOF", "XAF", "JPY", "KRW"].includes(currencyCode)
        ? 0
        : 2,
    }).format(amount);
  } catch (error) {
    // Repli sécurisé si le code de devise est invalide
    return `${amount}`;
  }
};
