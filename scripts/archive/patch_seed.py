import re
import datetime

countries = [
    {"iso2Code": "US", "iso3Code": "USA", "name": "United States", "officialName": "United States of America", "region": "Americas", "subregion": "Northern America", "defaultCurrencyCode": "USD", "defaultLanguageCode": "en", "callingCode": "1"},
    {"iso2Code": "GB", "iso3Code": "GBR", "name": "United Kingdom", "officialName": "United Kingdom of Great Britain and Northern Ireland", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "GBP", "defaultLanguageCode": "en", "callingCode": "44"},
    {"iso2Code": "CA", "iso3Code": "CAN", "name": "Canada", "officialName": "Canada", "region": "Americas", "subregion": "Northern America", "defaultCurrencyCode": "CAD", "defaultLanguageCode": "en", "callingCode": "1"},
    {"iso2Code": "AU", "iso3Code": "AUS", "name": "Australia", "officialName": "Commonwealth of Australia", "region": "Oceania", "subregion": "Australia and New Zealand", "defaultCurrencyCode": "AUD", "defaultLanguageCode": "en", "callingCode": "61"},
    {"iso2Code": "DE", "iso3Code": "DEU", "name": "Germany", "officialName": "Federal Republic of Germany", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "de", "callingCode": "49"},
    {"iso2Code": "FR", "iso3Code": "FRA", "name": "France", "officialName": "French Republic", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "fr", "callingCode": "33"},
    {"iso2Code": "NL", "iso3Code": "NLD", "name": "Netherlands", "officialName": "Kingdom of the Netherlands", "region": "Europe", "subregion": "Western Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "nl", "callingCode": "31"},
    {"iso2Code": "IE", "iso3Code": "IRL", "name": "Ireland", "officialName": "Ireland", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "en", "callingCode": "353"},
    {"iso2Code": "NZ", "iso3Code": "NZL", "name": "New Zealand", "officialName": "New Zealand", "region": "Oceania", "subregion": "Australia and New Zealand", "defaultCurrencyCode": "NZD", "defaultLanguageCode": "en", "callingCode": "64"},
    {"iso2Code": "SE", "iso3Code": "SWE", "name": "Sweden", "officialName": "Kingdom of Sweden", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "SEK", "defaultLanguageCode": "sv", "callingCode": "46"},
    {"iso2Code": "FI", "iso3Code": "FIN", "name": "Finland", "officialName": "Republic of Finland", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "fi", "callingCode": "358"},
    {"iso2Code": "NO", "iso3Code": "NOR", "name": "Norway", "officialName": "Kingdom of Norway", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "NOK", "defaultLanguageCode": "no", "callingCode": "47"},
    {"iso2Code": "DK", "iso3Code": "DNK", "name": "Denmark", "officialName": "Kingdom of Denmark", "region": "Europe", "subregion": "Northern Europe", "defaultCurrencyCode": "DKK", "defaultLanguageCode": "da", "callingCode": "45"},
    {"iso2Code": "ES", "iso3Code": "ESP", "name": "Spain", "officialName": "Kingdom of Spain", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "es", "callingCode": "34"},
    {"iso2Code": "IT", "iso3Code": "ITA", "name": "Italy", "officialName": "Italian Republic", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "it", "callingCode": "39"},
    {"iso2Code": "MY", "iso3Code": "MYS", "name": "Malaysia", "officialName": "Malaysia", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "MYR", "defaultLanguageCode": "ms", "callingCode": "60"},
    {"iso2Code": "TR", "iso3Code": "TUR", "name": "Turkey", "officialName": "Republic of Turkey", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "TRY", "defaultLanguageCode": "tr", "callingCode": "90"},
    {"iso2Code": "AE", "iso3Code": "ARE", "name": "United Arab Emirates", "officialName": "United Arab Emirates", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "AED", "defaultLanguageCode": "ar", "callingCode": "971"},
    {"iso2Code": "SA", "iso3Code": "SAU", "name": "Saudi Arabia", "officialName": "Kingdom of Saudi Arabia", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "SAR", "defaultLanguageCode": "ar", "callingCode": "966"},
    {"iso2Code": "QA", "iso3Code": "QAT", "name": "Qatar", "officialName": "State of Qatar", "region": "Asia", "subregion": "Western Asia", "defaultCurrencyCode": "QAR", "defaultLanguageCode": "ar", "callingCode": "974"},
    {"iso2Code": "JP", "iso3Code": "JPN", "name": "Japan", "officialName": "Japan", "region": "Asia", "subregion": "Eastern Asia", "defaultCurrencyCode": "JPY", "defaultLanguageCode": "ja", "callingCode": "81"},
    {"iso2Code": "KR", "iso3Code": "KOR", "name": "South Korea", "officialName": "Republic of Korea", "region": "Asia", "subregion": "Eastern Asia", "defaultCurrencyCode": "KRW", "defaultLanguageCode": "ko", "callingCode": "82"},
    {"iso2Code": "CN", "iso3Code": "CHN", "name": "China", "officialName": "People's Republic of China", "region": "Asia", "subregion": "Eastern Asia", "defaultCurrencyCode": "CNY", "defaultLanguageCode": "zh", "callingCode": "86"},
    {"iso2Code": "SG", "iso3Code": "SGP", "name": "Singapore", "officialName": "Republic of Singapore", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "SGD", "defaultLanguageCode": "en", "callingCode": "65"}
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
      metadata: {{ studyDestinationCandidate: true, source: "curated-reference-seed", note: "Reference identity only; destination content populated by later phases." }},
      createdAt: new Date(),
      updatedAt: new Date()
    }}""")

replacement = "referenceCountry: [\n" + ",\n".join(seed_records) + "\n  ],"

with open('apps/api/src/infrastructure/di/container.ts', 'r') as f:
    code = f.read()

code = re.sub(r"referenceCountry:\s*\[\],", replacement, code)

with open('apps/api/src/infrastructure/di/container.ts', 'w') as f:
    f.write(code)

print("Patched successfully")
