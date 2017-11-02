import requests
import ScrapeFetchedRecipes
import re
from bs4 import BeautifulSoup
errors = []
filter_results = []
totalNVstat = [0,0,0,0,0,0,0,0,0,0,0,0]
k = 0
while k < len(ScrapeFetchedRecipes.ingredient_list):
    #format input string
    input_ingredient = ScrapeFetchedRecipes.ingredient_list[k].strip()
    input_ingredient = input_ingredient.replace('blossoms', '').replace(' if desired', '').replace('ripe', '').replace('quality', '').replace('good', '').replace(' mix' , '').replace(' blend' , '').replace('best', '').replace('slices', '').replace('minced', '').replace('small-diced', '').replace('assorted', '').replace('tops', '').replace('homemade', '').replace('toasted', '')
    input_ingredient = input_ingredient.replace('-', ' ')
    m = re.match('[1-9] [1-9]/[1-9]', input_ingredient)
    if m:
        Num, space, rest = input_ingredient.partition(' ')
        input_ingredient = Num + '-' + rest
    if ' or ' in input_ingredient:#pick first option always
        errors.append(input_ingredient) #input_ingredient = input_ingredient.rsplit(' or ',1)[0]
        k += 1
        continue
    #corner cases
    if ',' in input_ingredient and input_ingredient.count(',') == 1:
        check = input_ingredient.rsplit(',', 2)[1]
        check = check.split()[0]
        if check == 'plus':
            input_ingredient = input_ingredient.replace(',', '')

    quantity_specified = re.match(r'[1-9/]{1,3}|One', input_ingredient)
    if '!' in input_ingredient:
        k+=1
        errors.append(input_ingredient)
        continue
    if quantity_specified:
        #check for valid ingredient
        if 'pepper' in input_ingredient or 'salt' in input_ingredient or 'recipe' in input_ingredient or ' spray ' in input_ingredient:
            k += 1
            continue
        array = input_ingredient.split()
        quantity = array[0] + ' ' + array[1]
        #corner case
        slices_case = re.match(r'^[^\w]+[\w]+ cut into [1-9]+ slices', input_ingredient)
        if ' egg beaten ' in input_ingredient:
            ingredient = 'egg'
        elif slices_case:
            pieces = input_ingredient.split()
            ingredient = pieces[1]

        elif ',' in input_ingredient: #check for commas
            piece1 = input_ingredient.split(',', 1)[0]
            if piece1[len(piece1)-1] == ')' or ('(' in piece1 and ')' not in piece1):
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
        if 'potato' in ingredient:
            ingredient = 'potato'
        if ingredient == 'egg whites':
            ingredient = 'egg white'
        if 'pecan' in ingredient:
            ingredient = 'pecans'
        if 'hazelnut' in ingredient:
            ingredient = 'hazelnuts'
        if ingredient == 'butter chips':
            ingredient = 'chocolate chips'
        if ingredient == 'butter chips':
            ingredient = 'chocolate chips'
        if ingredient == 'garlic' or ((ingredient == 'cloves' or ingredient == 'clove') and pieces[j-1] == 'garlic'):
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
            continue
    else:
        k+=1
        continue
    filter_results.append(ingredient)

    keywords = ingredient.split() #split ingredients into array of words
    search = re.sub(r"[^\w]",'+', ingredient) #used for searching ingredients

    #construct link to search results
    part1 = 'http://www.calorieking.com/foods/search.php?keywords='
    part2 = '&go.x=0&go.y=0&go=Go'
    url = part1 + search + part2

    #grab page of search results
    r = requests.get(url)
    content = r.content
    soup = BeautifulSoup(content, 'html.parser')
    link_to_data = ' '
    #filter links on search results
    #most intellegent search
    for category in soup.find_all('div', {'class' : 'food-search-result left-vertical-border-green'}):
        subCategorySpan = category.find('span' , {'class' : 'food-search-category'} )
        subCategory = subCategorySpan.get_text()
        # print keywords[len(keywords) - 1]
        # print subCategory.lower()
        i = len(keywords) - 1
        if keywords[i] in subCategory.lower():
            #print 'yes!'
            optimizedLink = category.find('a',{'class' : 'food-search-result-name'}, href = True)
            if optimizedLink:
                link_to_data = optimizedLink['href']
                #print quantity + ' of ' + ingredient + ': ' + link_to_data
                #print 'found'
                break
    #intellegent search
    if link_to_data == ' ':
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
    #least intellegent search
    if(link_to_data == ' '):
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
                    link_to_data = link['hef']
                    break

    r.close()
    if(link_to_data == ' '):
        print 'ingredient not found'
        errors.append(ingredient)
    else:
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
        #if calcium != ' ':
            #print 'There are ' + calcium + ' of calcium in 1 ' + units
        g = len(units)-1
        if ')' == units[g]:
            units = units.rsplit('(',1)[1]
            units = units.replace(')', '')
            units = units.split()[0]
            NVunitOZ = float(units)
            print NVunitOZ
            q = array[0]

            print quantity
            #print q

            # if len(qantity.split()) == 1 and :
            #     qtyStr = quantity.split()[0]
            #     ingredient_qty = int(qtyStr)
            if '-' not in q and '/' not in q:
                ingredient_qty = float(q)
            else:
                if '-' in q and '/' in q:
                    whole = q.rsplit('-',)[0]
                    #print 'whole: ' + whole
                    a = q.split('-')[1]
                elif '/' in q:
                    a = q
                #print a
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
            elif 'pint' in quantity:
                ingredient_qtyOZ = ingredient_qty*16
            elif 'ounces' in quantity or 'oz' in quantity:
                ingredient_qtyOZ = ingredient_qty
            else:
                ingredient_qtyOZ = ingredient_qty
                NVunitOZ = 1

            factor = ingredient_qtyOZ/NVunitOZ
            print 'factor is: ' , factor

        i = 0
        j = len(IngredientNVdataG)
        while i < j:
            IngredientNVdataG[i] = IngredientNVdataG[i].replace('m', '').replace('g', '').replace('<' , '')
            IngredientNVdataG[i] = float(IngredientNVdataG[i])
            totalNVstat[i] = factor * IngredientNVdataG[i] + totalNVstat[i]

            i += 1
    k += 1
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
print totalNVstat
file = open('ingredient_name.txt', 'w')
for item in filter_results:
        file.write("%s\n" % item)
file.close()
file = open('noSearchResults.txt', 'w')
for item in errors:
    file.write("%s\n" % item)
file.close()
