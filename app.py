import requests
import re
import os
from bs4 import BeautifulSoup

from dotenv import load_dotenv
load_dotenv()

"""
link id = open-link<F3>
"""

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
            fields = row.find_all('td')
            sub_type = fields[4].string
            sub_les = f"{fields[0].string}: {fields[1].b.string} {fields[2].string}"
            room = fields[2].string
            txt = f": {fields[6].string}" if '&nbsp;' not in fields[6].prettify(formatter='html') else ''
            if sub_type == 'Entfall':
                print(f"{sub_les} entfaellt{txt}")
            elif sub_type == 'Verlegung':
                print(f"{sub_les} verlegt von {fields[5].string} in Raum {room}{txt}")
            elif sub_type == 'Unterricht geändert':
                print(f"{sub_les} geändert in {room}{txt}")
            elif sub_type == 'Vertretung':
                print(f"{sub_les} vertretung in {room}{txt}")
