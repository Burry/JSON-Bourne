
import re
import requests
from bs4 import BeautifulSoup


#Due to website naming being weird, http://www.foodnetwork.com/recipes/a-z is equivalent to
#http://www.foodnetwork.com/recipes/a-z/123 and the loop that runs through every page will never exit
#because of this but since theres only 2 pages of recipes that start with 123, i just did it manually here
r = requests.get("http://www.foodnetwork.com/recipes/a-z")#grab page 1
content = r.content
recipe_links = []
links = []
match = 0
soup = BeautifulSoup(content, 'html.parser')


for link in soup.find_all('a', href = True): #grab links and recipes from page 1
	match = re.match(r'^http://www.foodnetwork.com/recipes/(?!photos/).*$' , link['href'], re.M)
	if match is not None:
		#print match.group(0)
		check = re.match(r'^http://www.foodnetwork.com/recipes/a-z.*$' , match.group(0), re.M)
		if check:
			links.append(check.group(0))
		else:
			recipe_links.append(match.group(0))
r.close()
r = requests.get("http://www.foodnetwork.com/recipes/a-z/123/p/2")#grab page 2
content = r.content
soup = BeautifulSoup(content, 'html.parser')
for link in soup.find_all('a', href = True):#grab links and recipes from page 2
	match = re.match(r'^http://www.foodnetwork.com/recipes/(?!photos/).*$' , link['href'], re.M)
	if match:
		check = re.match(r'^http://www.foodnetwork.com/recipes/a-z.*$' , match.group(0), re.M)
		if check:
			links.append(check.group(0))
		else:
			recipe_links.append(match.group(0))
r.close()
r = requests.get("http://www.foodnetwork.com/recipes/a-z/a")
print (r.url)
content = r.content
soup = BeautifulSoup(content, 'html.parser')

#loop 1 get all recipes starting with... a-z
i = 2 # i starts at 2 because we already got 123 catagory
letter_loop_iterations = 26
reduced_loop_iterations = 3 #used for testing purposes, this grabs 123 and a category
while i < 26: # a-z plus 123 but xyz are combined so we have 26 - 2 + 1  = 25 different iterations
	j = len(links) - 2 # link to next page is always second to last link in links list
	k = i - 1
	#loop through each page on current letter
	while (links[j] != links[k]):	#loop through each page
		for link in soup.find_all('a', href = True):
			match = re.match(r'^http://www.foodnetwork.com/recipes/(?!photos/).*$', link['href'], re.M)
			if match:
				check = re.match(r'^http://www.foodnetwork.com/recipes/a-z.*$' , match.group(0), re.M)
				if check:
					links.append(check.group(0))
				else:
					recipe_links.append(match.group(0))

		j = len(links) - 2
		print (links[j]) #prints next page
		r.close()
		r = requests.get(links[j]) #go to next page
		content = r.content
		soup = BeautifulSoup(content, 'html.parser')
	r.close()
	r = requests.get(links[i]) #go to next letter
	print (r.url)
	content = r.content
	soup = BeautifulSoup(content, 'html.parser')
	#print i
	i += 1

print ('Scraped ' , len(recipe_links) , 'recipes from www.foodnetwork.com \n')
file = open('recipes.txt', 'w')
for item in recipe_links:
        file.write("%s\n" % item)
