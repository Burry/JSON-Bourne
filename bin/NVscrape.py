import requests
import ScrapeFetchedRecipes
import re
from bs4 import BeautifulSoup

def getNVforRecipe(ingredient_list):
    errors = []
    filter_results = []
    totalNVstat = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0,0.0]
    k = 0
    #loop through each ingredient in ingredient list from ScrapeFetchedRecipes.py file

    while k < len(ingredient_list):
        #remove white space padding
        input_ingredient = ingredient_list[k].strip()
        #get rid of a few words that mess up search results, get rid of - then change format of quantity
        input_ingredient = input_ingredient.replace('softened', '').replace('game ', '').replace(' in', '').replace('blossoms', '').replace(' if desired', '').replace('ripe', '').replace('quality', '').replace('good', '').replace(' mix' , '').replace(' blend' , '').replace('best', '').replace('slices', '').replace('minced', '').replace('small-diced', '').replace('assorted', '').replace('tops', '').replace('homemade', '').replace('toasted', '')
        input_ingredient = input_ingredient.replace('-', ' ')
        input_ingredient = re.sub('to [1-9] [1-9]/[1-9] ','', input_ingredient)
        #print input_ingredient
        m = re.match('[1-9] [1-9]/[1-9]', input_ingredient)
        if m:
            Num, space, rest = input_ingredient.partition(' ')
            input_ingredient = Num + '-' + rest
        #add ambiguities to error list
        if ' or ' in input_ingredient:
            errors.append(input_ingredient)
            input_ingredient = input_ingredient + '***'
            filter_results.append(input_ingredient)
            k += 1
            continue

        #corner cases

        #used for ingredients formatted as: '1 cup, plus 1/2 tablespoon ground cumin'
        if ',' in input_ingredient and input_ingredient.count(',') == 1:#if theres one comma
            check = input_ingredient.rsplit(',', 2)[1]
            check2 = input_ingredient.rsplit(',', 2)[0]
            check2 = check2.split()
            check = check.split()
            if len(check2) == 2 and check[0] == 'plus':
                input_ingredient = input_ingredient.replace(',', '')
            # print len(check)
            # if len(check) == 1:
            #     if check[0] == 'plus':
            #         input_ingredient = input_ingredient.replace(',', '')
            # else:
            #     if check[0] == 'plus' and check[1] == 'extra': #if the word immediately after the comma is plus, get rid of comma
            #         input_ingredient = input_ingredient

        #make sure quantity is specified
        quantity_specified = re.match(r'[1-9/]{1,3}|One|Two|Three|Four', input_ingredient)

        #there shouldn't be an exclamation point in ingredient.
        #Used for ingredients formatted as: '2 tablespoons I Cant Believe Its not Butter! spread'
        if '!' in input_ingredient:
            k+=1
            errors.append(input_ingredient)
            input_ingredient = input_ingredient + '***'
            filter_results.append(input_ingredient)
            continue
        if quantity_specified:
            #check for valid ingredient
            #due to fact that salt and pepper are sometimes combined into a single ingredient with quantites undspecified, and sometimes it specifies 'cooking spray' as an ingredient
            if 'pepper' in input_ingredient or 'salt' in input_ingredient or 'recipe' in input_ingredient or ' spray ' in input_ingredient:
                k += 1
                errors.append(input_ingredient)
                input_ingredient = input_ingredient + '***'
                filter_results.append(input_ingredient)
                continue
            #grab the '1 cup' or '1 pound' part of ingredient, store as string called quantity
            array = input_ingredient.split()
            quantity = array[0] + ' ' + array[1]
            #corner case
            #used to handle main ingredient formatted in unusual way
            slices_case = re.match(r'^[^\w]+[\w]+ cut into [1-9]+ slices', input_ingredient)
            #handles case of '1 egg beated with 1 cup water'
            if ' egg beaten ' in input_ingredient:
                ingredient = 'egg'
            elif slices_case:
                pieces = input_ingredient.split()
                ingredient = pieces[1]
            #in most cases, if theres a comma, the previous one or two words is the name of ingredient
            #for example: '1 white onion, finely diced'
            elif ',' in input_ingredient: #check for commas
                piece1 = input_ingredient.split(',', 1)[0]#grab whats before comma
                if piece1[len(piece1)-1] == ')' or ('(' in piece1 and ')' not in piece1):#get rid of parentheses
                    piece1 = piece1.rsplit('(', 1)[0]
                pieces = piece1.split()
                j = len(pieces) - 1
                if ' stock ' in pieces[j]:
                    ingredient = pieces[j-1] + ' ' + pieces[j]
                elif j > 2 and 'cooking' not in pieces[j-1]:
                    ingredient = pieces[j-1] + ' ' + pieces[j]
                else:
                    ingredient = pieces[j]

            else:#if there are no commas
                if input_ingredient[len(input_ingredient)-1] == ')':
                    input_ingredient = input_ingredient.rsplit('(', 1)[0]
                elif input_ingredient[len(input_ingredient)-1] == '}':
                    input_ingredient = input_ingredient.rsplit('{', 1)[0]
                pieces = input_ingredient.split()
                j = len(pieces) - 1
                if pieces[j] == 'vinegar' and pieces[j-1] == 'wine':
                    ingredient = pieces[j-2] + ' ' + pieces[j-1] + ' ' + pieces[j]
                elif (j > 2) and (pieces[j-1] == 'large' or pieces[j-1] == 'miniature' or 'cooking' in pieces[j-1]):
                    ingredient = pieces[j]
                elif (j <= 2):
                    ingredient = pieces[j]
                else:
                    ingredient = pieces[j-1] + ' ' + pieces[j]

            ingredient = ingredient.lower()
            # if ingredient[len(ingredient) - 1] == 's':
            #     ingredient = ingredient.rsplit('s',1)[0]
            #filter 2 to reduce number of no search results and to increase liklihood of getting the right results
            #often the problem is that ingredient is either too specific or not specific enough
            if 'hen' in ingredient:
                ingredient = 'cornish hen'
            elif 'potato' in ingredient:
                ingredient = 'potato'
            elif 'pancake' in ingredient:
                ingredient = 'pancakes'
            elif ingredient == 'egg whites':
                ingredient = 'egg white'
            elif 'pecan' in ingredient:
                ingredient = 'pecans'
            elif 'hazelnut' in ingredient:
                ingredient = 'hazelnuts'
            elif ingredient == 'butter chips':
                ingredient = 'chocolate chips'
            elif ingredient == 'butter chips':
                ingredient = 'chocolate chips'
            elif ingredient == 'garlic' or ((ingredient == 'cloves' or ingredient == 'clove') and pieces[j-1] == 'garlic') or 'garlic' in ingredient:
                ingredient = 'garlic cloves'
            elif ingredient == 'flour':
                ingredient = 'all-purpose flour'
            elif ingredient == 'acacia':
                ingredient = 'honey'
            elif ingredient == 'italian cheese' or ingredient == 'mexican cheese':
                ingredient = ingredient + ' ' + 'blend'
            elif 'adobo' == ingredient:
                ingredient = 'adobo spice'
            elif 'adobo' in ingredient:
                ingredient = 'adobo sauce'
            elif (len(ingredient.split()) == 2 and ('vinegar' in ingredient or 'capers' in ingredient or 'scallions' in ingredient or 'oregano' in ingredient or 'shrimp' in ingredient or 'tarragon' in ingredient or 'scallops' in ingredient or 'parsley' in ingredient or ingredient.split()[1] == 'onion' or ingredient.split()[1] == 'carrot' or 'celery' in ingredient or 'walnuts' in ingredient)):
                ingredient = ingredient.split()[1]
            elif 'oil' in ingredient:
                ingredient = 'olive oil'
            elif 'confectioners\'' in ingredient:
                ingredient = ingredient.replace('confectioners\' ', '')
            elif ingredient == 'half-and-half':
                ingredient = ingredient.replace('-', ' ')
            elif ingredient == 'leaves':
                ingredient = 'bay leaves'
            elif ingredient == 'fillet pieces':
                ingredient = pieces[j-2] + ' ' + ingredient
            elif ingredient == 'chile':
                ingredient = 'chili pepper'
            elif 'mint' in ingredient:
                ingredient = 'fresh mint'
            elif ingredient == 'stick':
                ingredient = pieces [j-1]
            elif 'tuna' in ingredient:
                ingredient = 'tuna'
            elif 'in ' in ingredient or 'water' in ingredient:
                errors.append(ingredient)
                k += 1
                input_ingredient = input_ingredient + '***'
                filter_results.append(input_ingredient)
                continue

        else:#no quantity specified, add to error list
            k+=1
            errors.append(input_ingredient)
            input_ingredient = input_ingredient + '***'
            filter_results.append(input_ingredient)
            continue
        filter_results.append(ingredient)#add re-formatted ingredient to list for debugging

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
        #if no search results
        if(link_to_data == ' '):
            print 'ingredient not found'
            errors.append(ingredient)
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
            g = len(units)-1
            if ')' == units[g] and 'oz' in units:#only preform calculation if NV data specifies oz for its unit in parenthesis at the end
                units = units.rsplit('(',2)[1] #get rid of parenthesis
                units = units.replace(')', '')
                units = units.split()[0]#get rid of letters
                NVunitOZ = float(units)#convert to float
                #print NVunitOZ #number of ounces that give fetched NV statistics (in float form)
                q = array[0]
                print input_ingredient
                print 'units in DB are:', units
                #print quantity #string specifying amount of ingredient and unit
                #extract amount and convert to floating point
                if '-' not in q and '/' not in q:
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
                    if '-' in q and '/' in q:
                        whole = q.rsplit('-',)[0]
                        a = q.split('-')[1]
                    elif '/' in q:
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
                    ingredient_qtyOZ = ingredient_qty
                    NVunitOZ = 1

                factor = ingredient_qtyOZ/NVunitOZ #multiply fetched NV data by this constant to get NV of ingredient
                print 'factor is: ' , factor
            #sum it all up
            i = 0
            j = len(IngredientNVdataG)
            while i < j:
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
    #print totalNVstat
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
# def string_to_number(argument):
#     switcher = {
#         'One': one,
#         'Two': two,
#         'three': three,
#         'four': four,
#     }
#     return
# def one():
#     return 1
# def two():
#     return 2
# def three():
#     return 3
# def four():
#     return 4
