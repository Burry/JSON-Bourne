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
soup = BeautifulSoup(content, 'html.parser')
for link in soup.find_all('a'): #grab links and recipes from page 1
	match = re.match(r'^http://www.foodnetwork.com/recipes/(?!photos/).*$' , link.get('href'), re.M)
	if match:
		check = re.match(r'^http://www.foodnetwork.com/recipes/a-z.*$' , match.group(0), re.M)
		if check:
			links.append(check.group(0))
		else:
			recipe_links.append(match.group(0))
r.close()
r = requests.get("http://www.foodnetwork.com/recipes/a-z/123/p/2")#grab page 2
content = r.content
soup = BeautifulSoup(content, 'html.parser')
for link in soup.find_all('a'):#grab links and recipes from page 2
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
i = 2 # i starts at 2 because we already got 123 catagory
letter_loop_iterations = 26
reduced_loop_iterations = 3 #used for testing purposes, this grabs 123 and a category
while i < reduced_loop_iterations: # a-z plus 123 but xyz are combined so we have 26 - 2 + 1  = 25 different iterations
	j = len(links) - 2 # link to next page is always second to last link in links list
	k = i - 1
	#loop through each page on current letter
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

print 'Scraped ' , len(recipe_links) , 'recipes from www.foodnetwork.com \n'



j = 0
while j < 10:

	ingredient_list = []
	Directions = 'Directions: \n'
	Amount = 'Makes: '
	Cook_Time = 'Total Cooking Time: '
	r.close()
	r = requests.get(recipe_links[j])
	print r.url #can verify information by going to URL
	content = r.content
	soup = BeautifulSoup(content, 'html.parser')

	for item in soup.find_all('div' , {'class' : 'o-Method__m-Body'}):
		if item:
			Directions = Directions + (item.get_text()) #puts instructions into list
	image_div = soup.find('div', {'class' : 'o-AssetMultiMedia__m-MediaBlock'})
	if image_div:
		image_obj = image_div.find('img' , {'class' : 'o-AssetMultiMedia__a-Image'})
		if image_obj:
			image_src = image_obj.find('src' ) #if there is an image, grab the source
			print "There is an image!"
	ingredients_div = soup.find('div', {'class' : 'o-Ingredients__m-Body'})
	if ingredients_div:
		for li in ingredients_div.find_all('li'):
			item = li.find('input')
			ingredient_list.append(item.get('value'))#put ingredients into list
	cook_time_section = soup.find('section', {'class' : 'o-RecipeInfo o-Time'})
	if cook_time_section:
		dl = cook_time_section.find('dl')
		time = dl.find('dd', {'class' : 'o-RecipeInfo__a-Description--Total'})

	Cook_Time = Cook_Time + time.get_text()
	yield_section = soup.find('section' , {'class' : 'o-RecipeInfo o-Yield'})
	if yield_section:
		dl = yield_section.find('dl')
		if dl:
			servings = dl.find('dd', {'class' : 'o-RecipeInfo__a-Description'})
	Amount = Amount + servings.get_text()
	print Cook_Time # print cooking time
	print Amount #prints number of servings
	i = 0
	while i < len(ingredient_list):
		print ingredient_list[i] #print ingredients
		i+=1
	i = 0
	print Directions
	j+=1



#below is used for debugging

# i = 0
# while i < len(links):
# 	print links[i]
# 	i += 1
#print "/n"
# i = 0
# while i < len(recipe_links):
# 	print recipe_links[i]
# 	i+=1
