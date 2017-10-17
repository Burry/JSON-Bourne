import re
import requests
from bs4 import BeautifulSoup


#Due to website naming being weird, http://www.foodnetwork.com/recipes/a-z is equivalent to
#http://www.foodnetwork.com/recipes/a-z/123 and the loop that runs through every page will never exit
#because of this but since theres only 2 pages of recipes that start with 123, i just did it manually here
r = requests.get("http://www.foodnetwork.com/recipes/a-z")
content = r.content
recipe_links = []
links = []
soup = BeautifulSoup(content, 'html.parser')
for link in soup.find_all('a'):
	match = re.match(r'^http://www.foodnetwork.com/recipes/(?!photos/).*$' , link.get('href'), re.M)
	if match:
		check = re.match(r'^http://www.foodnetwork.com/recipes/a-z.*$' , match.group(0), re.M)
		if check:
			links.append(check.group(0))
		else:
			recipe_links.append(match.group(0))
r.close()
r = requests.get("http://www.foodnetwork.com/recipes/a-z/123/p/2")
content = r.content
soup = BeautifulSoup(content, 'html.parser')
for link in soup.find_all('a'):
	match = re.match(r'^http://www.foodnetwork.com/recipes/(?!photos/).*$' , link.get('href'), re.M)
	if match:
		check = re.match(r'^http://www.foodnetwork.com/recipes/a-z.*$' , match.group(0), re.M)
		if check:
			links.append(check.group(0))
		else:
			recipe_links.append(match.group(0))
r.close()
r = requests.get("http://www.foodnetwork.com/recipes/a-z/a")
print r.url
content = r.content
soup = BeautifulSoup(content, 'html.parser')

#loop 1 get all recipes starting with... a-z
i = 2
while i < 26:
	#loop through each page on current letter
	j = len(links) - 2
	k = i - 1
	while (links[j] != links[k]):	#loop through each page
		for link in soup.find_all('a'):
			match = re.match(r'^http://www.foodnetwork.com/recipes/(?!photos/).*$' , link.get('href'), re.M)
			if match:
				check = re.match(r'^http://www.foodnetwork.com/recipes/a-z.*$' , match.group(0), re.M)
				if check:
					links.append(check.group(0))
				else:
					recipe_links.append(match.group(0))

		j = len(links) - 2
	 	print links[j] #prints next page
		# if links[j] == links[1]:
		# 	break
		r.close()
		r = requests.get(links[j]) #go to next page
		content = r.content
		soup = BeautifulSoup(content, 'html.parser')
	r.close()
	r = requests.get(links[i]) #go to next letter
	print r.url
	content = r.content
	soup = BeautifulSoup(content, 'html.parser')
	#print i
	i += 1

# i = 0
# while i < len(links):
# 	print links[i]
# 	i += 1
#print "/n"
i = 0
while i < len(recipe_links):
	print recipe_links[i]
	i+=1
