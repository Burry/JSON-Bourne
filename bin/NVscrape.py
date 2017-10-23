import requests
import re
from bs4 import BeautifulSoup

ingredient = 'steak'
items = ingredient.split()
keyword = re.sub(r"[^\w]",'+', ingredient)
options = []
print keyword
key1 = '^http://www.calorieking.com/foods/calories-in-.*' + items[0] + '.*$'
if(len(ingredient) == 2):
    key2 = '^http://www.calorieking.com/foods/calories-in-.*' + items[1] + '.*$'


part1 = 'http://www.calorieking.com/foods/search.php?keywords='
part2 = '&go.x=0&go.y=0&go=Go'
url = part1 + keyword + part2
#print url
r = requests.get(url)
content = r.content
soup = BeautifulSoup(content, 'html.parser')

for link in soup.find_all('a', href = True):
    #print link['href']
    match1 = re.match(key1, link['href'], re.M)
    if (len(ingredient) == 2):
        match2 = re.match(key2, link['href'], re.M)
        if match2:
            print match2.group(0)
            options.append(match2.group(0))
            break
    if match1:
        print match1.group(0)
        options.append(match1.group(0))
        break;
