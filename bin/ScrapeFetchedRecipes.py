import requests
import NVscrape
import re
from bs4 import BeautifulSoup
myfile = open('IngredientString.txt', 'w')
myfile.write('')
myfile.close()
myfile = open('noSearchResults.txt', 'w')
myfile.write('')
myfile.close()
myfile = open('ingredient_name.txt', 'w')
myfile.write('')
myfile.close()
i = 0
with open("recipes.txt", "r") as links:
	recipe_links = []

	for line in links:
		i += 1
		recipe_links.append(line)
		if i > 500:
			break # i only exists so loop doesnt go through every line in the text file
j = 0
#scrapes first recipe extracted from text file
ingredient_list = []
while j < 20:
	ingredient_list = []
	Directions = 'Directions: \n'
	Amount = 'for '
	Cook_Time = 'Total Cooking Time: '
	time = ' '
	servings = ' '
	title = ' '
	r = requests.get(recipe_links[j])
	print (r.url) #can verify information by going to URL
	content = r.content
	soup = BeautifulSoup(content, 'html.parser')
	#get title
	title_h = soup.find('h1', {'class' : 'o-AssetTitle__a-Headline'})
	if title_h:
		title_span = title_h.find('span', {'class' : 'o-AssetTitle__a-HeadlineText'})
		if title_span:
			title = title_span.get_text()
			#print title
	#Get directions
	for item in soup.find_all('div' , {'class' : 'o-Method__m-Body'}):
		if item:
			Directions = Directions + (item.get_text()) #puts instructions into list
	image_div = soup.find('div', {'class' : 'o-AssetMultiMedia__m-MediaBlock'})
	#check for image
	if image_div:
		image_obj = image_div.find('img' , {'class' : 'o-AssetMultiMedia__a-Image'})
		if image_obj:
			image_src = image_obj.find('src' ) #if there is an image, grab the source
			#print ("There is an image!")
	#get ingredients
	ingredients_div = soup.find('div', {'class' : 'o-Ingredients__m-Body'})
	if ingredients_div:
		for li in ingredients_div.find_all('li' , {'class' : 'o-Ingredients__a-ListItem'}):
			item = li.find('input')
			ingredient_list.append(item.get('value'))#put ingredients into list
	#get cook time
	cook_time_section = soup.find('section', {'class' : 'o-RecipeInfo o-Time'})
	if cook_time_section:
		dl = cook_time_section.find('dl')
		time = dl.find('dd', {'class' : 'o-RecipeInfo__a-Description--Total'})
		Cook_Time = Cook_Time + time.get_text()
	#get yield
	yield_section = soup.find('section' , {'class' : 'o-RecipeInfo o-Yield'})
	if yield_section:
		dl = yield_section.find('dl')
		if dl:
			servings = dl.find('dd', {'class' : 'o-RecipeInfo__a-Description'})
	if servings != ' ':
		Amount = servings.get_text()
	#write name of recipe and ingredient to file
	myfile = open("IngredientString.txt", "a")
	# myfile.write("\n\nTitle: %s\n\n" % title)
	for item in ingredient_list:
		item = item.encode('utf-8')
		myfile.write("%s\n\n" % item)
	#print (Cook_Time) # print cooking time
	#print (Amount) #prints number of servings
	#print (Directions)
	NVscrape.getNVforRecipe(ingredient_list)
	j+=1
