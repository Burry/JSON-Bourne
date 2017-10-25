import requests
import ScrapeFetchedRecipes
import re
from bs4 import BeautifulSoup
errors = []
filter_results = []
k = 0
while k < len(ScrapeFetchedRecipes.ingredient_list):

    input_ingredient = ScrapeFetchedRecipes.ingredient_list[k].strip()
    input_ingredient = input_ingredient.replace(' mix' , '').replace(' blend' , '').replace('best', '').replace('slices', '').replace('minced', '').replace('small-diced', '').replace('assorted', '').replace('tops', '').replace('homemade', '').replace('toasted', '')
    input_ingredient = input_ingredient.replace('-', ' ')
    m = re.match('[1-9] [1-9]/[1-9]', input_ingredient)
    if m:
        Num, space, rest = input_ingredient.partition(' ')
        input_ingredient = Num + '-' + rest
    if ' or ' in input_ingredient:#pick first option always
        input_ingredient = input_ingredient.rsplit(' or ',1)[0]

    input_ingredient = input_ingredient.replace(' quality ',' ').replace(' good ' , ' ')
    slices_case = re.match(r'^[^\w]+[\w]+ cut into [1-9]+ slices', input_ingredient)
    quantity_specified = re.match(r'[1-9/]{1,3}|One', input_ingredient)
    if slices_case:
        pieces = input_ingredient.split()
        ingredient = pieces[1]
    #word_count = len(input_ingredient.split())

    elif quantity_specified:
        #check for valid ingredient
        if 'pepper' in input_ingredient or 'salt' in input_ingredient or 'recipe' in input_ingredient or ' spray ' in input_ingredient:
            k += 1
            continue
        #special case
        if ' egg beaten ' in input_ingredient:
            ingredient = 'egg'
        elif ',' in input_ingredient: #check for commas
            piece1 = input_ingredient.rsplit(',', 1)[0]
            while piece1.count(',') > 0:
                piece1 =  piece1.rsplit(',', 1)[0]
            if piece1[len(piece1)-1] == ')' or '(' in piece1:
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
        ingredient = re.sub(r"[0-9]",'',ingredient )
        #special case corrections (either too specific or not specific enough)
        if ingredient == 'garlic':
            ingredient = ingredient + ' ' + 'cloves'
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
        elif (len(ingredient.split()) == 2 and ('vinegar' in ingredient or 'capers' in ingredient or 'scallions' in ingredient or 'oregano' in ingredient or 'shrimp' in ingredient or 'tarragon' in ingredient or 'scallops' in ingredient or 'parsley' in ingredient or ingredient.split()[1] == 'onion' or ingredient.split()[1] == 'carrot' or 'celery' in ingredient or 'walnuts' in ingredient or 'butter' in ingredient)):
            ingredient = ingredient.split()[1]
        elif ingredient == 'oil':
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
            ingredient = 'chile pepper'
        elif 'mint' in ingredient:
            ingredient = 'fresh mint'
        elif ingredient == 'stick':
            ingredient = pieces [j-1] + ' ' + ingredient
        elif 'in ' in ingredient:
            k += 1
            continue
    else:
        k+=1
        continue
    filter_results.append(ingredient)

    keywords = ingredient.split() #split ingredients into array of words
    search = re.sub(r"[^\w]",'+', ingredient) #used for searching ingredients

    #generate regex expression
    if(len(keywords) == 3):
        key = '^http://www.calorieking.com/foods/calories-in-.*' + keywords[0] + '.*' + keywords[1] + '.*' + keywords[2] + '.*$'
    elif(len(keywords) == 2):
        key = '^http://www.calorieking.com/foods/calories-in-.*' + keywords[0] + '.*' + keywords[1] + '.*$'
    elif(len(keywords) == 1):
        key = '^http://www.calorieking.com/foods/calories-in-.*' + keywords[0] + '.*$'

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
    #intellegent search
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
                #print 'found'
                break
        else:
            for link in category.find_all('a', href = True):
                match1 = re.match(key, link['href'], re.M)
                if match1:
                    print ingredient + ': ' + match1.group(0)
                    link_to_data = match1.group(0)
                    break
            break
    #less intellegent search
    if(link_to_data == ' '):
        for link in soup.find_all('a', href = True):
            match1 = re.match(key, link['href'], re.M)
            if match1:
                print ingredient + ': ' + match1.group(0)
                link_to_data = match1.group(0)
                break

    r.close()
    if(link_to_data == ' '):
        print 'ingredient not found'
        errors.append(ingredient)
    # else:
    #     calories = ' '
    #     fatCal = ' '
    #     totalFat = ' '
    #     satFat = ' '
    #     cholesterol = ' '
    #     sodium = ' '
    #     sugar = ' '
    #     protein = ' '
    #     fiber = ' '
    #     totalCarbs = ' '
    #     calcium = ' '
    #
    #     r = requests.get(link_to_data)
    #     content = r.content
    #     soup = BeautifulSoup(content, 'html.parser')
    #     #grab calories per unit of food
    #     cal_div = soup.find('span', {'id' : 'mCal' })
    #     if cal_div:
    #         calories = cal_div.get_text()
    #     #grab units of food
    #     units_select = soup.find('select', {'id' : 'units'})
    #     if units_select:
    #         units_option = units_select.find('option', {'value' : '0'})
    #         if units_option:
    #             units = units_option.get_text()
    #     if calories != ' ':
    #         print 'There are ' + calories + ' calories in 1 ' + units
    #     #grab calories from fat
    #     fatCal_tr = soup.find('tr' , {'class' : 'fat-calories'})
    #     if fatCal_tr:
    #         fatCal_span = fatCal_tr.find('span', {'class' :'amount'})
    #         if fatCal_span:
    #             fatCal = fatCal_span.get_text()
    #     if fatCal != ' ':
    #         print 'There are ' + fatCal + ' calories from fat in 1 ' + units
    #     #grab total fat
    #     totalFat_tr = soup.find('tr' , {'class' : 'total-fat'})
    #     if totalFat_tr:
    #         totalFat_td = totalFat_tr.find('td', {'class' :'amount'})
    #         if totalFat_td :
    #             totalFat = totalFat_td.get_text()
    #     if totalFat != ' ':
    #         print 'There are ' + totalFat + ' of fat in 1 ' + units
    #     #grab saturated fat
    #     satFat_tr = soup.find('tr' , {'class' : 'sat-fat'})
    #     if satFat_tr:
    #         satFat_td = satFat_tr.find('td', {'class' :'amount'})
    #         if satFat_td :
    #             satFat = satFat_td.get_text()
    #     if satFat != ' ':
    #         print 'There are ' + satFat + ' of saturated fat in 1 ' + units
    #     #grab Cholesterol
    #     cholesterol_tr = soup.find('tr' , {'class' : 'cholesterol'})
    #     if cholesterol_tr:
    #         cholesterol_td = cholesterol_tr.find('td', {'class' :'amount'})
    #         if cholesterol_td :
    #             cholesterol = cholesterol_td.get_text()
    #     if cholesterol != ' ':
    #         print 'There are ' + cholesterol + ' of cholesterol in 1 ' + units
    #     #grab Sodium
    #     sodium_tr = soup.find('tr' , {'class' : 'sodium'})
    #     if sodium_tr:
    #         sodium_td = sodium_tr.find('td', {'class' :'amount'})
    #         if sodium_td :
    #             sodium = sodium_td.get_text()
    #     if sodium != ' ':
    #         print 'There are ' + sodium + ' of sodium in 1 ' + units
    #     #grab Total Carbs
    #     totalCarbs_tr = soup.find('tr' , {'class' : 'total-carbs'})
    #     if totalCarbs_tr:
    #         totalCarbs_td = totalCarbs_tr.find('td', {'class' :'amount'})
    #         if totalCarbs_td :
    #             totalCarbs = totalCarbs_td.get_text()
    #     if totalCarbs != ' ':
    #         print 'There are ' + totalCarbs + ' total carbs in 1 ' + units
    #     #grab fiber
    #     fiber_tr = soup.find('tr' , {'class' : 'fiber'})
    #     if fiber_tr:
    #         fiber_td = fiber_tr.find('td', {'class' :'amount'})
    #         if fiber_td :
    #             fiber = fiber_td.get_text()
    #     if fiber != ' ':
    #         print 'There are ' + fiber + ' of fiber in 1 ' + units
    #     #grab sugar
    #     sugar_tr = soup.find('tr' , {'class' : 'sugars'})
    #     if sugar_tr:
    #         sugar_td = sugar_tr.find('td', {'class' :'amount'})
    #         if sugar_td :
    #             sugar = sugar_td.get_text()
    #     if sugar != ' ':
    #         print 'There are ' + sugar + ' of sugar in 1 ' + units
    #     #grab protein
    #     protein_tr = soup.find('tr' , {'class' : 'protein'})
    #     if protein_tr:
    #         protein_td = protein_tr.find('td', {'class' :'amount'})
    #         if protein_td :
    #             protein = protein_td.get_text()
    #     if protein != ' ':
    #         print 'There are ' + protein + ' of protein in 1 ' + units
    #     #grab calcium
    #     calcium_tr = soup.find('tr' , {'class' : 'calcium'})
    #     if calcium_tr:
    #         calcium_td = calcium_tr.find('td', {'class' :'amount'})
    #         if calcium_td :
    #             calcium = calcium_td.get_text()
    #     if calcium != ' ':
    #         print 'There are ' + calcium + ' of calcium in 1 ' + units
    k += 1
file = open('ingredient_name.txt', 'w')
for item in filter_results:
        file.write("%s\n" % item)
file.close()
file = open('noSearchResults.txt', 'w')
for item in errors:
    file.write("%s\n" % item)
file.close()
