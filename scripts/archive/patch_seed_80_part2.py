import re

additional_countries = [
    # Americas
    {"iso2Code": "UY", "iso3Code": "URY", "name": "Uruguay", "officialName": "Oriental Republic of Uruguay", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "UYU", "defaultLanguageCode": "es", "callingCode": "598"},
    {"iso2Code": "PY", "iso3Code": "PRY", "name": "Paraguay", "officialName": "Republic of Paraguay", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "PYG", "defaultLanguageCode": "es", "callingCode": "595"},
    {"iso2Code": "BO", "iso3Code": "BOL", "name": "Bolivia", "officialName": "Plurinational State of Bolivia", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "BOB", "defaultLanguageCode": "es", "callingCode": "591"},
    {"iso2Code": "EC", "iso3Code": "ECU", "name": "Ecuador", "officialName": "Republic of Ecuador", "region": "Americas", "subregion": "South America", "defaultCurrencyCode": "USD", "defaultLanguageCode": "es", "callingCode": "593"},
    {"iso2Code": "PA", "iso3Code": "PAN", "name": "Panama", "officialName": "Republic of Panama", "region": "Americas", "subregion": "Central America", "defaultCurrencyCode": "PAB", "defaultLanguageCode": "es", "callingCode": "507"},
    # Europe
    {"iso2Code": "SK", "iso3Code": "SVK", "name": "Slovakia", "officialName": "Slovak Republic", "region": "Europe", "subregion": "Eastern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "sk", "callingCode": "421"},
    {"iso2Code": "SI", "iso3Code": "SVN", "name": "Slovenia", "officialName": "Republic of Slovenia", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "sl", "callingCode": "386"},
    {"iso2Code": "HR", "iso3Code": "HRV", "name": "Croatia", "officialName": "Republic of Croatia", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "EUR", "defaultLanguageCode": "hr", "callingCode": "385"},
    {"iso2Code": "RS", "iso3Code": "SRB", "name": "Serbia", "officialName": "Republic of Serbia", "region": "Europe", "subregion": "Southern Europe", "defaultCurrencyCode": "RSD", "defaultLanguageCode": "sr", "callingCode": "381"},
    # Africa
    {"iso2Code": "ZM", "iso3Code": "ZMB", "name": "Zambia", "officialName": "Republic of Zambia", "region": "Africa", "subregion": "Eastern Africa", "defaultCurrencyCode": "ZMW", "defaultLanguageCode": "en", "callingCode": "260"},
    {"iso2Code": "ZW", "iso3Code": "ZWE", "name": "Zimbabwe", "officialName": "Republic of Zimbabwe", "region": "Africa", "subregion": "Eastern Africa", "defaultCurrencyCode": "ZWL", "defaultLanguageCode": "en", "callingCode": "263"},
    {"iso2Code": "CI", "iso3Code": "CIV", "name": "Côte d'Ivoire", "officialName": "Republic of Côte d'Ivoire", "region": "Africa", "subregion": "Western Africa", "defaultCurrencyCode": "XOF", "defaultLanguageCode": "fr", "callingCode": "225"},
    # Asia
    {"iso2Code": "MM", "iso3Code": "MMR", "name": "Myanmar", "officialName": "Republic of the Union of Myanmar", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "MMK", "defaultLanguageCode": "my", "callingCode": "95"},
    {"iso2Code": "KH", "iso3Code": "KHM", "name": "Cambodia", "officialName": "Kingdom of Cambodia", "region": "Asia", "subregion": "South-eastern Asia", "defaultCurrencyCode": "KHR", "defaultLanguageCode": "km", "callingCode": "855"},
    {"iso2Code": "NP", "iso3Code": "NPL", "name": "Nepal", "officialName": "Federal Democratic Republic of Nepal", "region": "Asia", "subregion": "Southern Asia", "defaultCurrencyCode": "NPR", "defaultLanguageCode": "ne", "callingCode": "977"},
    {"iso2Code": "IR", "iso3Code": "IRN", "name": "Iran", "officialName": "Islamic Republic of Iran", "region": "Asia", "subregion": "Southern Asia", "defaultCurrencyCode": "IRR", "defaultLanguageCode": "fa", "callingCode": "98"}
]

seed_records = []
for c in additional_countries:
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

replacement_to_insert = ",\n".join(seed_records) + "\n  ],"

with open('apps/api/src/infrastructure/di/container.ts', 'r') as f:
    code = f.read()

# Replace existing ending of referenceCountry array to insert more
code = code.replace("\n  ],", ",\n" + replacement_to_insert, 1)

with open('apps/api/src/infrastructure/di/container.ts', 'w') as f:
    f.write(code)

print(f"Added {len(additional_countries)} more countries.")
