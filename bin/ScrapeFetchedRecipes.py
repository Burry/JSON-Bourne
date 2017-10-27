import requests
import re
from bs4 import BeautifulSoup

i = 0
with open("recipes.txt", "r") as links:
	recipe_links = []

	for line in links:
		i += 1
		recipe_links.append(line)
		if i > 500:
			break # i only exists so loop doesnt go through every line in the text file
#prints first 10 links extracted from text file
# j = 0
# while j < 50:
# 	print recipe_links[j]
# 	j+=1
j = 20
#scrapes first recipe extracted from text file
ingredient_list = []
while j < 30:
	#ingredient_list = []
	Directions = 'Directions: \n'
	Amount = 'Makes: '
	Cook_Time = 'Total Cooking Time: '
	time = ' '
	servings = ' '
	r = requests.get(recipe_links[j])
	#print (r.url) #can verify information by going to URL
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
			#print ("There is an image!")
	ingredients_div = soup.find('div', {'class' : 'o-Ingredients__m-Body'})
	if ingredients_div:
		for li in ingredients_div.find_all('li' , {'class' : 'o-Ingredients__a-ListItem'}):
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
	if servings != ' ':
		Amount = Amount + servings.get_text()
	#print (Cook_Time) # print cooking time
	#print (Amount) #prints number of servings
	#print (Directions)
	j+=1
file = open('IngredientString.txt', 'w')
for item in ingredient_list:
	if 'salt' in item or 'pepper' in item:
		continue
	match = re.match(r'[1-9/]{1,3}|One', item)
	item = item.encode('utf-8')
	if match:
		file.write("%s\n" % item)
