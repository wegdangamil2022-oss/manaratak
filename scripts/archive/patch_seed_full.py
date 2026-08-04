import json
import re

with open('countries.json') as f:
    countries = json.load(f)

study_dest_candidates = {'US', 'CA', 'MX', 'CR', 'GB', 'DE', 'FR', 'NL', 'IE', 'SE', 'FI', 'NO', 'DK', 'ES', 'IT', 'CH', 'AT', 'BE', 'PL', 'CZ', 'HU', 'RO', 'BG', 'GR', 'PT', 'LT', 'LV', 'EE', 'AU', 'NZ', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'EG', 'MA', 'TN', 'DZ', 'ZA', 'KE', 'GH', 'NG', 'UG', 'RW', 'ET', 'TZ', 'SN', 'MY', 'TR', 'JP', 'KR', 'CN', 'SG', 'IN', 'ID', 'TH', 'VN', 'PH', 'PK', 'BD', 'LK', 'TW', 'KZ', 'UZ', 'BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'PY', 'BO', 'EC', 'PA', 'SK', 'SI', 'HR', 'RS', 'ZM', 'ZW', 'CI', 'MM', 'KH', 'NP', 'IR'}

seed_records = []
for c in countries:
    iso2 = c.get('cca2', '')
    if not iso2:
        continue
    
    iso3 = c.get('cca3', '')
    name = c.get('name', {}).get('common', '').replace('"', '\\"')
    official = c.get('name', {}).get('official', '').replace('"', '\\"')
    region = c.get('region', '')
    subregion = c.get('subregion', '')
    
    currency_code = ""
    currencies = c.get('currencies', {})
    if currencies:
        currency_code = list(currencies.keys())[0]
        
    lang_code = ""
    languages = c.get('languages', {})
    if languages:
        lang_code = list(languages.keys())[0]
            
    calling_code = ""
    idd = c.get('idd', {})
    if idd.get('root'):
        calling_code = idd.get('root').replace('+', '')
        if idd.get('suffixes') and len(idd.get('suffixes')) == 1:
            calling_code += idd.get('suffixes')[0]

    is_candidate = "true" if iso2 in study_dest_candidates else "false"

    metadata = f'{{ source: "curated-reference-seed", referenceOnly: true, studyDestinationCandidate: {is_candidate}, destinationReviewStatus: "UNREVIEWED", publicVisible: false, publicStatus: "DRAFT", note: "Reference identity only. Admin may later mark this country as a study destination candidate; public visibility requires review and activation." }}'
    
    seed_records.append(f"""    {{
      id: "mem-{iso2}",
      iso2Code: "{iso2}",
      iso3Code: "{iso3}",
      name: "{name}",
      officialName: "{official}",
      region: "{region}",
      subregion: "{subregion}",
      defaultCurrencyCode: "{currency_code}",
      defaultLanguageCode: "{lang_code}",
      callingCode: "{calling_code}",
      flagAssetId: null,
      isActive: true,
      metadata: {metadata},
      createdAt: new Date(),
      updatedAt: new Date()
    }}""")

replacement = "referenceCountry: [\n" + ",\n".join(seed_records) + "\n  ],"

with open('apps/api/src/infrastructure/di/container.ts', 'r') as f:
    code = f.read()

code = re.sub(r"referenceCountry:\s*\[[\s\S]*?\n\s*\],", replacement, code)

with open('apps/api/src/infrastructure/di/container.ts', 'w') as f:
    f.write(code)

print(f"Patched successfully with {len(seed_records)} countries")
