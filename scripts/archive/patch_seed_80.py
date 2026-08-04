import re
import datetime

countries = [
    # North America
    {"iso2Code": "US", "iso3Code": "USA", "name": "United States", "officialName": "United States of America", "region": "Americas", "subregion": "Northern America", "defaultCurrencyCode": "USD", "defaultLanguageCode": "en", "callingCode": "1"},
    {"iso2Code": "CA", "iso3Code": "CAN", "name": "Canada", "officialName": "Canada", "region": "Americas", "subregion": "Northern America", "defaultCurrencyCode": "CAD", "defaultLanguageCode": "en", "callingCode": "1"},
    {"iso2Code": "MX", "iso3Code": "MEX", "name": "Mexico", "officialName": "United Mexican States", "region": "Americas", "subregion": "Central America", "defaultCurrencyCode": "MXN", "defaultLanguageCode": "es", "callingCode": "52"},
    {"iso2Code": "CR", "iso3Code": "CRI", "name": "Costa Rica", "officialName": "Republic of Costa Rica", "region": "Americas", "subregion": "Central America", "defaultCurrencyCode": "CRC", "defaultLanguageCode": "es", "callingCode": "506"},
    # Europe
    {"iso2Code": "GB", "iso3Code": "GBR", "name": "United Kingdom", "officialName": "United Kingdom of Great Britain and Northern Ireland", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "GBP", "defaultLanguageCode": "en", "callingCode": "44"},
    {"iso2Code": "DE", "iso3Code": "DEU", "name": "Germany", "officialName": "Federal Republic of Germany", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "de", "callingCode": "49"},
    {"iso2Code": "FR", "iso3Code": "FRA", "name": "France", "officialName": "French Republic", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "fr", "callingCode": "33"},
    {"iso2Code": "NL", "iso3Code": "NLD", "name": "Netherlands", "officialName": "Kingdom of the Netherlands", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "nl", "callingCode": "31"},
    {"iso2Code": "IE", "iso3Code": "IRL", "name": "Ireland", "officialName": "Ireland", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "en", "callingCode": "353"},
    {"iso2Code": "SE", "iso3Code": "SWE", "name": "Sweden", "officialName": "Kingdom of Sweden", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "SEK", "defaultLanguageCode": "sv", "callingCode": "46"},
    {"iso2Code": "FI", "iso3Code": "FIN", "name": "Finland", "officialName": "Republic of Finland", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "fi", "callingCode": "358"},
    {"iso2Code": "NO", "iso3Code": "NOR", "name": "Norway", "officialName": "Kingdom of Norway", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "NOK", "defaultLanguageCode": "no", "callingCode": "47"},
    {"iso2Code": "DK", "iso3Code": "DNK", "name": "Denmark", "officialName": "Kingdom of Denmark", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "DKK", "defaultLanguageCode": "da", "callingCode": "45"},
    {"iso2Code": "ES", "iso3Code": "ESP", "name": "Spain", "officialName": "Kingdom of Spain", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "es", "callingCode": "34"},
    {"iso2Code": "IT", "iso3Code": "ITA", "name": "Italy", "officialName": "Italian Republic", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "it", "callingCode": "39"},
    {"iso2Code": "CH", "iso3Code": "CHE", "name": "Switzerland", "officialName": "Swiss Confederation", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "CHF", "defaultLanguageCode": "de", "callingCode": "41"},
    {"iso2Code": "AT", "iso3Code": "AUT", "name": "Austria", "officialName": "Republic of Austria", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "de", "callingCode": "43"},
    {"iso2Code": "BE", "iso3Code": "BEL", "name": "Belgium", "officialName": "Kingdom of Belgium", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "nl", "callingCode": "32"},
    {"iso2Code": "PL", "iso3Code": "POL", "name": "Poland", "officialName": "Republic of Poland", "region": "Europe", "subregion": "Eastern Europe", "defaultCurrencyCode": "PLN", "defaultLanguageCode": "pl", "callingCode": "48"},
    {"iso2Code": "CZ", "iso3Code": "CZE", "name": "Czech Republic", "officialName": "Czechia", "region": "Europe", "subregion": "Eastern Europe", "defaultCurrencyCode": "CZK", "defaultLanguageCode": "cs", "callingCode": "420"},
    {"iso2Code": "HU", "iso3Code": "HUN", "name": "Hungary", "officialName": "Hungary", "region": "Europe", "subregion": "Eastern Europe", "defaultCurrencyCode": "HUF", "defaultLanguageCode": "hu", "callingCode": "36"},
    {"iso2Code": "RO", "iso3Code": "ROU", "name": "Romania", "officialName": "Romania", "region": "Europe", "subregion": "Eastern Europe", "defaultCurrencyCode": "RON", "defaultLanguageCode": "ro", "callingCode": "40"},
    {"iso2Code": "BG", "iso3Code": "BGR", "name": "Bulgaria", "officialName": "Republic of Bulgaria", "region": "Europe", "subregion": "Eastern Europe", "defaultCurrencyCode": "BGN", "defaultLanguageCode": "bg", "callingCode": "359"},
    {"iso2Code": "GR", "iso3Code": "GRC", "name": "Greece", "officialName": "Hellenic Republic", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "el", "callingCode": "30"},
    {"iso2Code": "PT", "iso3Code": "PRT", "name": "Portugal", "officialName": "Portuguese Republic", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "pt", "callingCode": "351"},
    {"iso2Code": "LT", "iso3Code": "LTU", "name": "Lithuania", "officialName": "Republic of Lithuania", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "lt", "callingCode": "370"},
    {"iso2Code": "LV", "iso3Code": "LVA", "name": "Latvia", "officialName": "Republic of Latvia", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "lv", "callingCode": "371"},
    {"iso2Code": "EE", "iso3Code": "EST", "name": "Estonia", "officialName": "Republic of Estonia", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "et", "callingCode": "372"},
    # Oceania
    {"iso2Code": "AU", "iso3Code": "AUS", "name": "Australia", "officialName": "Commonwealth of Australia", "region": "Oceania", "subregion": "Australia and New Zealand", "defaultCurrencyCode": "AUD", "defaultLanguageCode": "en", "callingCode": "61"},
    {"iso2Code": "NZ", "iso3Code": "NZL", "name": "New Zealand", "officialName": "New Zealand", "region": "Oceania", "subregion": "Australia and New Zealand", "defaultCurrencyCode": "NZD", "defaultLanguageCode": "en", "callingCode": "64"},
    # Middle East
    {"iso2Code": "SA", "iso3Code": "SAU", "name": "Saudi Arabia", "officialName": "Kingdom of Saudi Arabia", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "SAR", "defaultLanguageCode": "ar", "callingCode": "966"},
    {"iso2Code": "AE", "iso3Code": "ARE", "name": "United Arab Emirates", "officialName": "United Arab Emirates", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "AED", "defaultLanguageCode": "ar", "callingCode": "971"},
    {"iso2Code": "QA", "iso3Code": "QAT", "name": "Qatar", "officialName": "State of Qatar", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "QAR", "defaultLanguageCode": "ar", "callingCode": "974"},
    {"iso2Code": "KW", "iso3Code": "KWT", "name": "Kuwait", "officialName": "State of Kuwait", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "KWD", "defaultLanguageCode": "ar", "callingCode": "965"},
    {"iso2Code": "BH", "iso3Code": "BHR", "name": "Bahrain", "officialName": "Kingdom of Bahrain", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "BHD", "defaultLanguageCode": "ar", "callingCode": "973"},
    {"iso2Code": "OM", "iso3Code": "OMN", "name": "Oman", "officialName": "Sultanate of Oman", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "OMR", "defaultLanguageCode": "ar", "callingCode": "968"},
    {"iso2Code": "JO", "iso3Code": "JOR", "name": "Jordan", "officialName": "Hashemite Kingdom of Jordan", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "JOD", "defaultLanguageCode": "ar", "callingCode": "962"},
    {"iso2Code": "LB", "iso3Code": "LBN", "name": "Lebanon", "officialName": "Lebanese Republic", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "LBP", "defaultLanguageCode": "ar", "callingCode": "961"},
    # Africa
    {"iso2Code": "EG", "iso3Code": "EGY", "name": "Egypt", "officialName": "Arab Republic of Egypt", "region": "Africa", "subregion": "Northern Africa", "defaultCurrencyCode": "EGP", "defaultLanguageCode": "ar", "callingCode": "20"},
    {"iso2Code": "MA", "iso3Code": "MAR", "name": "Morocco", "officialName": "Kingdom of Morocco", "region": "Africa", "subregion": "Northern Africa", "defaultCurrencyCode": "MAD", "defaultLanguageCode": "ar", "callingCode": "212"},
    {"iso2Code": "TN", "iso3Code": "TUN", "name": "Tunisia", "officialName": "Republic of Tunisia", "region": "Africa", "subregion": "Northern Africa", "defaultCurrencyCode": "TND", "defaultLanguageCode": "ar", "callingCode": "216"},
    {"iso2Code": "DZ", "iso3Code": "DZA", "name": "Algeria", "officialName": "People's Democratic Republic of Algeria", "region": "Africa", "subregion": "Northern Africa", "defaultCurrencyCode": "DZD", "defaultLanguageCode": "ar", "callingCode": "213"},
    {"iso2Code": "ZA", "iso3Code": "ZAF", "name": "South Africa", "officialName": "Republic of South Africa", "region": "Africa", "subregion": "Southern Africa", "defaultCurrencyCode": "ZAR", "defaultLanguageCode": "en", "callingCode": "27"},
    {"iso2Code": "KE", "iso3Code": "KEN", "name": "Kenya", "officialName": "Republic of Kenya", "region": "Africa", "subregion": "Eastern Africa", "defaultCurrencyCode": "KES", "defaultLanguageCode": "en", "callingCode": "254"},
    {"iso2Code": "GH", "iso3Code": "GHA", "name": "Ghana", "officialName": "Republic of Ghana", "region": "Africa", "subregion": "Western Africa", "defaultCurrencyCode": "GHS", "defaultLanguageCode": "en", "callingCode": "233"},
    {"iso2Code": "NG", "iso3Code": "NGA", "name": "Nigeria", "officialName": "Federal Republic of Nigeria", "region": "Africa", "subregion": "Western Africa", "defaultCurrencyCode": "NGN", "defaultLanguageCode": "en", "callingCode": "234"},
    {"iso2Code": "UG", "iso3Code": "UGA", "name": "Uganda", "officialName": "Republic of Uganda", "region": "Africa", "subregion": "Eastern Africa", "defaultCurrencyCode": "UGX", "defaultLanguageCode": "en", "callingCode": "256"},
    {"iso2Code": "RW", "iso3Code": "RWA", "name": "Rwanda", "officialName": "Republic of Rwanda", "region": "Africa", "subregion": "Eastern Africa", "defaultCurrencyCode": "RWF", "defaultLanguageCode": "rw", "callingCode": "250"},
    {"iso2Code": "ET", "iso3Code": "ETH", "name": "Ethiopia", "officialName": "Federal Democratic Republic of Ethiopia", "region": "Africa", "subregion": "Eastern Africa", "defaultCurrencyCode": "ETB", "defaultLanguageCode": "am", "callingCode": "251"},
    {"iso2Code": "TZ", "iso3Code": "TZA", "name": "Tanzania", "officialName": "United Republic of Tanzania", "region": "Africa", "subregion": "Eastern Africa", "defaultCurrencyCode": "TZS", "defaultLanguageCode": "sw", "callingCode": "255"},
    {"iso2Code": "SN", "iso3Code": "SEN", "name": "Senegal", "officialName": "Republic of Senegal", "region": "Africa", "subregion": "Western Africa", "defaultCurrencyCode": "XOF", "defaultLanguageCode": "fr", "callingCode": "221"},
    # Asia
    {"iso2Code": "MY", "iso3Code": "MYS", "name": "Malaysia", "officialName": "Malaysia", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "MYR", "defaultLanguageCode": "ms", "callingCode": "60"},
    {"iso2Code": "TR", "iso3Code": "TUR", "name": "Turkey", "officialName": "Republic of Turkey", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "TRY", "defaultLanguageCode": "tr", "callingCode": "90"},
    {"iso2Code": "JP", "iso3Code": "JPN", "name": "Japan", "officialName": "Japan", "region": "Asia", "subregion": "Eastern Asia", "defaultCurrencyCode": "JPY", "defaultLanguageCode": "ja", "callingCode": "81"},
    {"iso2Code": "KR", "iso3Code": "KOR", "name": "South Korea", "officialName": "Republic of Korea", "region": "Asia", "subregion": "Eastern Asia", "defaultCurrencyCode": "KRW", "defaultLanguageCode": "ko", "callingCode": "82"},
    {"iso2Code": "CN", "iso3Code": "CHN", "name": "China", "officialName": "People's Republic of China", "region": "Asia", "subregion": "Eastern Asia", "defaultCurrencyCode": "CNY", "defaultLanguageCode": "zh", "callingCode": "86"},
    {"iso2Code": "SG", "iso3Code": "SGP", "name": "Singapore", "officialName": "Republic of Singapore", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "SGD", "defaultLanguageCode": "en", "callingCode": "65"},
    {"iso2Code": "IN", "iso3Code": "IND", "name": "India", "officialName": "Republic of India", "region": "Asia", "subregion": "Southern Asia", "defaultCurrencyCode": "INR", "defaultLanguageCode": "hi", "callingCode": "91"},
    {"iso2Code": "ID", "iso3Code": "IDN", "name": "Indonesia", "officialName": "Republic of Indonesia", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "IDR", "defaultLanguageCode": "id", "callingCode": "62"},
    {"iso2Code": "TH", "iso3Code": "THA", "name": "Thailand", "officialName": "Kingdom of Thailand", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "THB", "defaultLanguageCode": "th", "callingCode": "66"},
    {"iso2Code": "VN", "iso3Code": "VNM", "name": "Vietnam", "officialName": "Socialist Republic of Vietnam", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "VND", "defaultLanguageCode": "vi", "callingCode": "84"},
    {"iso2Code": "PH", "iso3Code": "PHL", "name": "Philippines", "officialName": "Republic of the Philippines", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "PHP", "defaultLanguageCode": "en", "callingCode": "63"},
    {"iso2Code": "PK", "iso3Code": "PAK", "name": "Pakistan", "officialName": "Islamic Republic of Pakistan", "region": "Asia", "subregion": "Southern Asia", "defaultCurrencyCode": "PKR", "defaultLanguageCode": "ur", "callingCode": "92"},
    {"iso2Code": "BD", "iso3Code": "BGD", "name": "Bangladesh", "officialName": "People's Republic of Bangladesh", "region": "Asia", "subregion": "Southern Asia", "defaultCurrencyCode": "BDT", "defaultLanguageCode": "bn", "callingCode": "880"},
    {"iso2Code": "LK", "iso3Code": "LKA", "name": "Sri Lanka", "officialName": "Democratic Socialist Republic of Sri Lanka", "region": "Asia", "subregion": "Southern Asia", "defaultCurrencyCode": "LKR", "defaultLanguageCode": "si", "callingCode": "94"},
    {"iso2Code": "TW", "iso3Code": "TWN", "name": "Taiwan", "officialName": "Republic of China", "region": "Asia", "subregion": "Eastern Asia", "defaultCurrencyCode": "TWD", "defaultLanguageCode": "zh", "callingCode": "886"},
    {"iso2Code": "KZ", "iso3Code": "KAZ", "name": "Kazakhstan", "officialName": "Republic of Kazakhstan", "region": "Asia", "subregion": "Central Asia", "defaultCurrencyCode": "KZT", "defaultLanguageCode": "kk", "callingCode": "7"},
    {"iso2Code": "UZ", "iso3Code": "UZB", "name": "Uzbekistan", "officialName": "Republic of Uzbekistan", "region": "Asia", "subregion": "Central Asia", "defaultCurrencyCode": "UZS", "defaultLanguageCode": "uz", "callingCode": "998"},
    # South America
    {"iso2Code": "BR", "iso3Code": "BRA", "name": "Brazil", "officialName": "Federative Republic of Brazil", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "BRL", "defaultLanguageCode": "pt", "callingCode": "55"},
    {"iso2Code": "AR", "iso3Code": "ARG", "name": "Argentina", "officialName": "Argentine Republic", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "ARS", "defaultLanguageCode": "es", "callingCode": "54"},
    {"iso2Code": "CL", "iso3Code": "CHL", "name": "Chile", "officialName": "Republic of Chile", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "CLP", "defaultLanguageCode": "es", "callingCode": "56"},
    {"iso2Code": "CO", "iso3Code": "COL", "name": "Colombia", "officialName": "Republic of Colombia", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "COP", "defaultLanguageCode": "es", "callingCode": "57"},
    {"iso2Code": "PE", "iso3Code": "PER", "name": "Peru", "officialName": "Republic of Peru", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "PEN", "defaultLanguageCode": "es", "callingCode": "51"}
]

seed_records = []
for c in countries:
    seed_records.append(f"""    {{
      id: "mem-{c['iso2Code']}",
      iso2Code: "{c['iso2Code']}",
      iso3Code: "{c['iso3Code']}",
      name: "{c['name']}",
      officialName: "{c['officialName']}",
      region: "{c['region']}",
      subregion: "{c['subregion']}",
      defaultCurrencyCode: "{c['defaultCurrencyCode']}",
      defaultLanguageCode: "{c['defaultLanguageCode']}",
      callingCode: "{c['callingCode']}",
      flagAssetId: null,
      isActive: true,
      metadata: {{ source: "curated-reference-seed", referenceOnly: true, studyDestinationCandidate: true, destinationReviewStatus: "UNREVIEWED", publicVisible: false, publicStatus: "DRAFT", note: "Visible in admin Study Destinations workspace only. Public visibility requires later review and activation." }},
      createdAt: new Date(),
      updatedAt: new Date()
    }}""")

replacement = "referenceCountry: [\n" + ",\n".join(seed_records) + "\n  ],"

with open('apps/api/src/infrastructure/di/container.ts', 'r') as f:
    code = f.read()

# Replace existing referenceCountry array with the new one
code = re.sub(r"referenceCountry:\s*\[[\s\S]*?\n\s*\],", replacement, code)

with open('apps/api/src/infrastructure/di/container.ts', 'w') as f:
    f.write(code)

print(f"Patched successfully with {len(countries)} countries")
