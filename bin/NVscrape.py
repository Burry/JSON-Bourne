import requests
import nltk
import ScrapeFetchedRecipes
import re
from bs4 import BeautifulSoup
# nltk.download('punkt')
# nltk.download('maxent_treebank_pos_tagger')
# nltk.download('averaged_perceptron_tagger')

def getNVforRecipe(ingredient_list):
    errors = []
    filter_results = []
    totalNVstat = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0,0.0]
    k = 0
    #loop through each ingredient in ingredient list from ScrapeFetchedRecipes.py file

    while k < len(ingredient_list):
        #remove white space padding
        input_ingredient = ingredient_list[k].strip()
        input_ingredient = input_ingredient.lower()
        quantity_specified = re.match(r'[1-9/]{1,3}|One|Two|Three|Four', input_ingredient)
        if ' or ' in input_ingredient or 'recipe' in input_ingredient or 'pepper' in input_ingredient or 'salt' in input_ingredient or ' spray ' in input_ingredient:
            errors.append(input_ingredient)
            input_ingredient = input_ingredient + '***'
            filter_results.append(input_ingredient)
            k+=1
            continue
        if quantity_specified:
            if 'parmesan' in input_ingredient:
                ingredient = 'parmesan cheese'
                print ingredient
                k += 1
                continue
            if 'garlic' in input_ingredient and 'powder' not in input_ingredient:
                ingredient = 'garlic'
                print ingredient
                k += 1
                continue
            if 'cucumber' in input_ingredient:
                ingredient = 'cucumber'
                print ingredient
                k += 1
                continue
            Words = input_ingredient.split()
            ingredient = ' '
            for word in Words:
                if re.match('[0-9]+-', word) or re.match('[1-9]/[1-9]-', word):
                    continue
                tokenized_word = nltk.word_tokenize(word)
                POS =  nltk.pos_tag(tokenized_word)

                if POS[0][1] == 'NN' or POS[0][1] == 'NNS' or POS[0][1] == 'JJ':
                    ingredient = ingredient + POS[0][0] + ' '
            ingredient = ingredient.lower()
            ingredient = ingredient.replace(' bags ', ' ').replace(' bag ', '').replace(' teaspoons ', ' ').replace(' teaspoon ', ' ').replace(' cups ', ' ').replace(' cup ', ' ').replace(' container ', ' ').replace(' tablespoons ', ' ').replace(' tablespoon ', ' ').replace(' box ', ' ').replace(' ounces ', ' ').replace(' packages ', ' ').replace(' package ', ' ').replace(' packets', ' ').replace(' pounds ', ' ').replace(' pound ', ' ').replace(' pints ', ' ').replace(' cans ', ' ').replace(' can ', ' ').replace(' pint ', ' ').replace(' pure ', ' ').replace(' jar ', ' ').replace(' tsp ', ' ').replace(' tbsp ', ' ').replace(' large ', ' ').replace(' small ', ' ').replace(' medium ', ' ').replace(' dairy ', ' ').replace(' aisle ', ' ').replace(' chopped ', ' ').replace(' mix ', ' ').replace(' optional ', ' ').replace(' packed ', ' ').replace(' leftover ', ' ').replace(' delicious ', ' ').replace(' cooked ', ' ').replace(' cook ', ' ').replace(' note ', ' ').replace(' water ', ' ').replace(' store-bought ', ' ').replace(' good ', ' ').replace(' sprigs ', ' ').replace(' inches ', ' ').replace(' chunks ', ' ').replace(' head ', ' ').replace(' stalks ', ' ').replace(' extra ', ' ').replace(' ice cold ', ' ').replace(' stick ', ' ').replace(' homemade ', ' ').replace(' dry ', ' ').replace(' whole ', ' ').replace(' pieces ', ' ').replace(' cut ', ' ')
            #print ingredient


            #get rid of - then change format of quantity
            input_ingredient = input_ingredient.replace('-', ' ')
            m = re.match('[1-9] [1-9]/[1-9]', input_ingredient)
            if m:
                Num, space, rest = input_ingredient.partition(' ')
                input_ingredient = Num + '-' + rest
            #grab the '1 cup' or '1 pound' part of ingredient, store as string called quantity
            #I need to account for cases like this: 1 (15-ounce) can
            array = input_ingredient.split()
            quantity = array[0] + ' ' + array[1]
#------------------------------------------------------------------------------------------------------------------
            #do i need this? Was originally for I Cant Believe Its not Butter! spread

            # if '!' in input_ingredient:
            #     k+=1
            #     errors.append(input_ingredient)
            #     input_ingredient = input_ingredient + '***'
            #     filter_results.append(input_ingredient)
            #     continue
            #
            #
            # #handles case of '1 egg beated with 1 cup water'
            # if ' egg beaten ' in input_ingredient:
            #     ingredient = 'egg'
            #
            # ingredient = ingredient.lower()
            #
            # elif 'in ' in ingredient or 'water' in ingredient:
            #     errors.append(ingredient)
            #     k += 1
            #     input_ingredient = input_ingredient + '***'
            #     filter_results.append(input_ingredient)
            #     continue
#------------------------------------------------------------------------------------------------------------------
        else:#no quantity specified, add to error list
            k+=1
            errors.append(input_ingredient)
            input_ingredient = input_ingredient + '***'
            filter_results.append(input_ingredient)
            continue
        filter_results.append(ingredient)#add re-formatted ingredient to list for debugging
############        BEGIN SEARCH        ##############
        keywords = ingredient.split() #split ingredients into array of keywords
        search = ingredient.replace(' ', '+')#this used to construct a link to search results (search uses GET requests)

        #construct link to search results
        part1 = 'http://www.calorieking.com/foods/search.php?keywords='
        part2 = '&go.x=0&go.y=0&go=Go'
        url = part1 + search + part2

        #grab HTML for page of search results
        r = requests.get(url)
        content = r.content
        soup = BeautifulSoup(content, 'html.parser')
        #initialize empty string (used to check for no results case)
        link_to_data = ' '
        #filter through links on search results page to find best result
        #most intellegent search, checks if category of link contains keywords
        for category in soup.find_all('div', {'class' : 'food-search-result left-vertical-border-green'}):
            subCategorySpan = category.find('span' , {'class' : 'food-search-category'} )
            subCategory = subCategorySpan.get_text()
            # print keywords[len(keywords) - 1]
            # print subCategory.lower()
            i = len(keywords) - 1

            if i == 0 and keywords[i] in subCategory.lower():
                #print 'yes!'
                optimizedLink = category.find('a',{'class' : 'food-search-result-name'}, href = True)
                if optimizedLink:
                    link_to_data = optimizedLink['href']
                    #print quantity + ' of ' + ingredient + ': ' + link_to_data
                    #print 'found'
                    break
            elif i == 1 and (keywords[i] in subCategory.lower() or keywords[0] in subCategory.lower()):
                optimizedLink = category.find('a',{'class' : 'food-search-result-name'}, href = True)
                if optimizedLink:
                    link_to_data = optimizedLink['href']
                    #print quantity + ' of ' + ingredient + ': ' + link_to_data
                    #print 'found'
                    break
            elif i == 2 and (keywords[i] in subCategory.lower() or keywords[1] in subCategory.lower() or keywords[0] in subCategory.lower()):
                optimizedLink = category.find('a',{'class' : 'food-search-result-name'}, href = True)
                if optimizedLink:
                    link_to_data = optimizedLink['href']
                    #print quantity + ' of ' + ingredient + ': ' + link_to_data
                    #print 'found'
                    break
        #intellegent search, checks if there is a link in green category with all keywords in it
        if link_to_data == ' ':#if havent found link yet
            for category in soup.find_all('div', {'class' : 'food-search-result left-vertical-border-green'}):
                link = category.find('a',{'class' : 'food-search-result-name'}, href = True)
                if len(keywords) == 3:
                    if '+' not in link['href'] and keywords[0] in link['href'] and keywords[1] in link['href'] and keywords[0] in link['href']:
                        #print quantity + ' of ' + ingredient + ': ' + link['href']
                        link_to_data = link['href']
                        break
                elif len(keywords) == 2:
                    if '+' not in link['href'] and keywords[0] in link['href'] and keywords[1] in link['href']:
                        #print quantity + ' of ' + ingredient + ': ' + link['href']
                        link_to_data = link['href']
                        break
                elif len(keywords) == 1:
                    if '+' not in link['href'] and keywords[0] in link['href']:
                        #print quantity + ' of ' + ingredient + ': ' + link['href']
                        link_to_data = link['href']
                        break
        #least intellegent search, goes through all the links
        if(link_to_data == ' '):#if no link found yet
            for link in soup.find_all('a', href = True):
                if len(keywords) == 3:
                    if '+' not in link['href'] and keywords[0] in link['href'] and keywords[1] in link['href'] and keywords[0] in link['href']:
                        #print quantity + ' of ' + ingredient + ': ' + link['href']
                        link_to_data = link['href']
                        break
                elif len(keywords) == 2:
                    if '+' not in link['href'] and keywords[0] in link['href'] and keywords[1] in link['href']:
                        #print quantity + ' of ' + ingredient + ': ' + link['href']
                        link_to_data = link['href']
                        break
                elif len(keywords) == 1:
                    if '+' not in link['href'] and keywords[0] in link['href']:
                        #print quantity + ' of ' + ingredient + ': ' + link['href']
                        link_to_data = link['href']
                        break

        r.close()
############# BEGIN SCRAPE #################
        #if no search results
        if(link_to_data == ' '):
            print 'ingredient not found'
            errors.append(ingredient)
            filter_results.append('No link found.')
        #if search results, get all nutritional value
        else:
            filter_results.append(link_to_data)
            factor = 0
            ingredient_qty = 0
            IngredientNVdataG = []
            calories = ' '
            fatCal = ' '
            totalFat = ' '
            satFat = ' '
            cholesterol = ' '
            sodium = ' '
            sugar = ' '
            protein = ' '
            fiber = ' '
            totalCarbs = ' '
            calcium = ' '
            r = requests.get(link_to_data)
            content = r.content
            soup = BeautifulSoup(content, 'html.parser')
            #grab calories per unit of food
            cal_div = soup.find('span', {'id' : 'mCal' })
            if cal_div:
                calories = cal_div.get_text()
                IngredientNVdataG.append(calories)
            #grab units of food
            units_select = soup.find('select', {'id' : 'units'})
            if units_select:
                units_option = units_select.find('option', {'value' : '0'})
                if units_option:
                    units = units_option.get_text()
            #if calories != ' ':
                #print 'There are ' + calories + ' calories in 1 ' + units
            #grab calories from fat
            fatCal_tr = soup.find('tr' , {'class' : 'fat-calories'})
            if fatCal_tr:
                fatCal_span = fatCal_tr.find('span', {'class' :'amount'})
                if fatCal_span:
                    fatCal = fatCal_span.get_text()
                    IngredientNVdataG.append(fatCal)
            #if fatCal != ' ':
                #print 'There are ' + fatCal + ' calories from fat in 1 ' + units
            #grab total fat
            totalFat_tr = soup.find('tr' , {'class' : 'total-fat'})
            if totalFat_tr:
                totalFat_td = totalFat_tr.find('td', {'class' :'amount'})
                if totalFat_td :
                    totalFat = totalFat_td.get_text()
                    IngredientNVdataG.append(totalFat)
            #if totalFat != ' ':
                #print 'There are ' + totalFat + ' of fat in 1 ' + units
            #grab saturated fat
            satFat_tr = soup.find('tr' , {'class' : 'sat-fat'})
            if satFat_tr:
                satFat_td = satFat_tr.find('td', {'class' :'amount'})
                if satFat_td :
                    satFat = satFat_td.get_text()
                    IngredientNVdataG.append(satFat)
            #if satFat != ' ':
                #print 'There are ' + satFat + ' of saturated fat in 1 ' + units
            #grab Cholesterol
            cholesterol_tr = soup.find('tr' , {'class' : 'cholesterol'})
            if cholesterol_tr:
                cholesterol_td = cholesterol_tr.find('td', {'class' :'amount'})
                if cholesterol_td :
                    cholesterol = cholesterol_td.get_text()
                    IngredientNVdataG.append(cholesterol)
            #if cholesterol != ' ':
                #print 'There are ' + cholesterol + ' of cholesterol in 1 ' + units
            #grab Sodium
            sodium_tr = soup.find('tr' , {'class' : 'sodium'})
            if sodium_tr:
                sodium_td = sodium_tr.find('td', {'class' :'amount'})
                if sodium_td :
                    sodium = sodium_td.get_text()
                    IngredientNVdataG.append(sodium)
            #if sodium != ' ':
                #print 'There are ' + sodium + ' of sodium in 1 ' + units
            #grab Total Carbs
            totalCarbs_tr = soup.find('tr' , {'class' : 'total-carbs'})
            if totalCarbs_tr:
                totalCarbs_td = totalCarbs_tr.find('td', {'class' :'amount'})
                if totalCarbs_td :
                    totalCarbs = totalCarbs_td.get_text()
                    IngredientNVdataG.append(totalCarbs)
            #if totalCarbs != ' ':
                #print 'There are ' + totalCarbs + ' total carbs in 1 ' + units
            #grab fiber
            fiber_tr = soup.find('tr' , {'class' : 'fiber'})
            if fiber_tr:
                fiber_td = fiber_tr.find('td', {'class' :'amount'})
                if fiber_td :
                    fiber = fiber_td.get_text()
                    IngredientNVdataG.append(fiber)
            #if fiber != ' ':
                #print 'There are ' + fiber + ' of fiber in 1 ' + units
            #grab sugar
            sugar_tr = soup.find('tr' , {'class' : 'sugars'})
            if sugar_tr:
                sugar_td = sugar_tr.find('td', {'class' :'amount'})
                if sugar_td :
                    sugar = sugar_td.get_text()
                    IngredientNVdataG.append(sugar)
            #if sugar != ' ':
                #print 'There are ' + sugar + ' of sugar in 1 ' + units
            #grab protein
            protein_tr = soup.find('tr' , {'class' : 'protein'})
            if protein_tr:
                protein_td = protein_tr.find('td', {'class' :'amount'})
                if protein_td :
                    protein = protein_td.get_text()
                    IngredientNVdataG.append(protein)
            #if protein != ' ':
                #print 'There are ' + protein + ' of protein in 1 ' + units
            #grab calcium
            calcium_tr = soup.find('tr' , {'class' : 'calcium'})
            if calcium_tr:
                calcium_td = calcium_tr.find('td', {'class' :'amount'})
                if calcium_td :
                    calcium = calcium_td.get_text()
                    IngredientNVdataG.append(calcium)
################# BEGIN CALCULATING NUTRITIONAL VALUE #######################
            g = len(units)-1
            if g > 0:
                if ')' == units[g] and 'oz' in units:#only preform calculation if NV data specifies oz for its unit in parenthesis at the end
                    units = units.rsplit('(',2)[1] #get rid of parenthesis
                    units = units.replace(')', '')
                    units = units.split()[0]#get rid of letters
                    NVunitOZ = float(units)#convert to float
                    #print NVunitOZ #number of ounces that give fetched NV statistics (in float form)
                    q = array[0] #quantity specified in ingredient, as a string
                    #print input_ingredient

                    #print 'units in DB are:', units
                    #print quantity #string specifying amount of ingredient and unit
                    #extract amount and convert to floating point
                    if '-' not in q and '/' not in q: #if q is a whole number
                        if q == 'One':
                            q = 1.0
                        elif q == 'Two':
                            q = 2.0
                        elif q == 'Three':
                            q = 3.0
                        elif q == 'Four':
                            q = 4.0
                        else:
                            ingredient_qty = float(q)
                    else:
                        if '-' in q and '/' in q: #if q is a whole number plus a fraction
                            whole = q.rsplit('-',)[0]
                            a = q.split('-')[1]
                        elif '/' in q: #if q is just a fraction
                            a = q
                        numerator = a.split('/')[0]
                        denominator = a.split('/')[1]
                        n = float(numerator)
                        d = float(denominator)
                        r = n/d

                        ingredient_qty = float(r)
                        if '-' in q:
                            ingredient_qty = ingredient_qty + float(whole)


                    #unit conversion on ingredient side
                    if 'teaspoon' in  quantity:
                        ingredient_qtyOZ = ingredient_qty*0.16667
                    elif 'tablespoon' in quantity:
                        ingredient_qtyOZ = ingredient_qty*0.5
                    elif 'cup' in quantity:
                        ingredient_qtyOZ = ingredient_qty*8
                    elif 'gallon' in quantity:
                        ingredient_qtyOZ = ingredient_qty*128
                    elif 'quart' in quantity:
                        ingredient_qtyOZ = ingredient_qty*32
                    elif 'pint' in quantity or 'pound' in quantity:
                        ingredient_qtyOZ = ingredient_qty*16

                    elif 'ounces' in quantity or 'oz' in quantity:
                        ingredient_qtyOZ = ingredient_qty
                    else:
                        print 'bad unit is: ' + quantity + 'for ingredient: ' + ingredient
                        errors.append(input_ingredient)
                        input_ingredient = input_ingredient + '***'
                        filter_results.append(input_ingredient)
                        ingredient_qtyOZ = 0.0
                        # NVunitOZ = 1

                    factor = ingredient_qtyOZ/NVunitOZ #multiply fetched NV data by this constant to get NV of ingredient
                    #print 'factor is: ' , factor
                #sum it all up
                i = 0
                #j = len(IngredientNVdataG)
            while i < len(IngredientNVdataG):
                IngredientNVdataG[i] = IngredientNVdataG[i].replace('g','').replace('m', '').replace('<' , '')
                IngredientNVdataG[i] = float(IngredientNVdataG[i])
                totalNVstat[i] = (factor * IngredientNVdataG[i]) + totalNVstat[i]
                i += 1
        k += 1
    #display data
    print 'For ' + ScrapeFetchedRecipes.Amount.strip() + ':'
    print 'There are ' , totalNVstat[0] , ' calories in this recipe'
    print 'There are ' , totalNVstat[1] , ' calories from fat in this recipe'
    print 'There are ' , totalNVstat[2] , 'g of fat in this recipe'
    print 'There are ' , totalNVstat[3] , 'g of saturated fat in this recipe'
    print 'There are ' , totalNVstat[4] , 'mg of cholesterol in this recipe'
    print 'There are ' , totalNVstat[5] , 'mg of sodium in this recipe'
    print 'There are ' , totalNVstat[6] , 'g total carbs in this recipe'
    print 'There are ' , totalNVstat[7] , 'g of fiber in this recipe'
    print 'There are ' , totalNVstat[8] , 'g of sugar in this recipe'
    print 'There are ' , totalNVstat[9] , 'g of protein in this recipe'
    print 'There are ' , totalNVstat[10] , 'mg of calcium in this recipe'
    file = open('ingredient_name.txt', 'a')
    for item in filter_results:
        item = item.encode('utf-8')
        file.write("%s\n" % item)
    file.close()
    file = open('noSearchResults.txt', 'a')
    for item in errors:
        item = item.encode('utf-8')
        file.write("%s\n" % item)
    file.close()
    return
