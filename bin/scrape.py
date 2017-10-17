import re
import requests
from bs4 import BeautifulSoup
r = requests.get("http://www.foodnetwork.com/recipes/a-z/a/")
content = r.content
recipe_links =  []
links = []


soup = BeautifulSoup(content, 'html.parser')

for link in soup.find_all('a'):
	match = re.match(r'^http://www.foodnetwork.com/recipes/(?!photos/).*$', link.get('href'), re.M);
      	if match:
		check = re.match(r'^http://www.foodnetwork.com/recipes/a-z.*$', match.group(0), re.M)
		if check:
			links.append(check.group(0))		
			
		else: 
			recipe_links.append(match.group(0))	
			
i = 0
while i < len(links):
	print links[i]
	i +=1
print "\n"
i = 0
while i < len(recipe_links):
	print recipe_links[i]
	i+=1
