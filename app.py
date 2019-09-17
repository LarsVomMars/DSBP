import requests
import re
from bs4 import BeautifulSoup

# TODO: Dynamic URL; idk how
URL = "https://app.dsbcontrol.de/data/c0bc0590-65dc-470e-bd27-d5cd5ad140bd/dedb7e2a-7747-4751-b390-f4d9d8ac71c9/dedb7e2a-7747-4751-b390-f4d9d8ac71c9.htm"
# SEARCH_CLASS = re.compile('.*?TGI12/1.*?', re.IGNORECASE)
SEARCH_CLASS = re.compile('.*?')

#req = requests.get(URL)
#page = BeautifulSoup(req.text, 'html.parser')
page = BeautifulSoup(open('test.html', 'r').read(), 'html.parser')
days = [d.parent for d in page.find_all('div', class_='mon_title')]
days_dict = {}

for day in days:
    day_info = day.find('div', class_='mon_title').string.split()
    date_str = day_info[0]
    day_name = day_info[1][:-1]
    week_info = day_info[2]

    rows = day.find_all('tr', class_='list')[2:]
    for row in rows:
        if SEARCH_CLASS.match(row.td.b.string):
            fields = row.find_all('td')[1:]
            sub_type = fields[3].string
            sub_les = f"{fields[0].b.string} {fields[1].string}"
            if sub_type == 'Entfall':
                txt = f": {fields[5].string}" if '&nbsp;' not in fields[5].prettify(formatter='html') else ''
                print(f"{sub_les} entfaellt{txt}")
            elif sub_type == 'Verlegung':
                print(f"{sub_les} verlegt von {fields[4].string} in Raum {fields[2].string}{txt}")
