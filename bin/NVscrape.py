import requests
import ScrapeFetchedRecipes
import re
from bs4 import BeautifulSoup

k = 0
while k < len(ScrapeFetchedRecipes.ingredient_list):
    input_ingredient = ScrapeFetchedRecipes.ingredient_list[k]
    #word_count = len(input_ingredient.split())

    #check for valid ingredient
    if 'pepper' in input_ingredient or 'salt' in input_ingredient or 'recipe' in input_ingredient:#ignore salt and pepper
        k += 1
        continue
    if ',' in input_ingredient: #check for commas
        piece1 = input_ingredient.rsplit(',', 1)[0]
        while piece1.count(',') > 0:
            piece1 =  piece1.rsplit(',', 1)[0]
        pieces = piece1.split()
        j = len(pieces) - 1
        ingredient = pieces[j]

    else:#if there are no commas
        pieces = input_ingredient.split()
        j = len(pieces) - 1
        if ')' in pieces[j-1] or 'handful' in pieces[j-1]: #this will screw up my regex link filter
            ingredient = pieces[j]
        else:
            ingredient = pieces[j-1] + ' ' + pieces[j]

    ingredient = ingredient.lower()

    #special case
    if ingredient == 'garlic':
        ingredient = ingredient + ' ' + 'cloves'
    print ingredient
    keywords = ingredient.split() #split ingredients into array of words
    search = re.sub(r"[^\w]",'+', ingredient) #used for searching ingredients
    options = []

    #generate regex expression for finding link to ingredient
    # keys = []
    # i = 0
    # while i < len(keywords):
    #     key = '^http://www.calorieking.com/foods/calories-in-.*' + keywords[i] + '.*$'
    #     keys.append(key)
    #     i += 1

    key1 = '^http://www.calorieking.com/foods/calories-in-.*' + keywords[0] + '.*$'
    if(len(ingredient) == 2):
        key2 = '^http://www.calorieking.com/foods/calories-in-.*' + keywords[1] + '.*$'

    #construct link to search results
    part1 = 'http://www.calorieking.com/foods/search.php?keywords='
    part2 = '&go.x=0&go.y=0&go=Go'
    url = part1 + search + part2
    #grab page of search results
    r = requests.get(url)
    content = r.content
    soup = BeautifulSoup(content, 'html.parser')
    #filter links on search results
    for link in soup.find_all('a', href = True):
        #print link['href']
        match1 = re.match(key1, link['href'], re.M)
        # i = len(keys) - 1
        # while i >= 0:
        #     match = re.match(keys[i], link['href'], re.M)
        #     if match:
        #         print match.group(0)
        #         options.append(match.group(0))
        #         break
        #     i-=1
        # if i < len(keys):
        #     break
        if (len(ingredient) == 2):
            match2 = re.match(key2, link['href'], re.M)
            if match2:
                print match2.group(0)
                options.append(match2.group(0))
                break
        if match1:
            print match1.group(0)
            options.append(match1.group(0))
            break;
    r.close()
    if(len(options) == 0):
        print 'ingredient not found'
    else:
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

        r = requests.get(options[0])
        content = r.content
        soup = BeautifulSoup(content, 'html.parser')
        #grab calories per unit of food
        cal_div = soup.find('span', {'id' : 'mCal' })
        calories = cal_div.get_text()
        #grab units of food
        units_select = soup.find('select', {'id' : 'units'})
        if units_select:
            units_option = units_select.find('option', {'value' : '0'})
            if units_option:
                units = units_option.get_text()
        if calories != ' ':
            print 'There are ' + calories + ' calories in 1 ' + units
        #grab calories from fat
        fatCal_tr = soup.find('tr' , {'class' : 'fat-calories'})
        if fatCal_tr:
            fatCal_span = fatCal_tr.find('span', {'class' :'amount'})
            if fatCal_span:
                fatCal = fatCal_span.get_text()
        if fatCal != ' ':
            print 'There are ' + fatCal + ' calories from fat in 1 ' + units
        #grab total fat
        totalFat_tr = soup.find('tr' , {'class' : 'total-fat'})
        if totalFat_tr:
            totalFat_td = totalFat_tr.find('td', {'class' :'amount'})
            if totalFat_td :
                totalFat = totalFat_td.get_text()
        if totalFat != ' ':
            print 'There are ' + totalFat + ' of fat in 1 ' + units
        #grab saturated fat
        satFat_tr = soup.find('tr' , {'class' : 'sat-fat'})
        if satFat_tr:
            satFat_td = satFat_tr.find('td', {'class' :'amount'})
            if satFat_td :
                satFat = satFat_td.get_text()
        if satFat != ' ':
            print 'There are ' + satFat + ' of saturated fat in 1 ' + units
        #grab Cholesterol
        cholesterol_tr = soup.find('tr' , {'class' : 'cholesterol'})
        if cholesterol_tr:
            cholesterol_td = cholesterol_tr.find('td', {'class' :'amount'})
            if cholesterol_td :
                cholesterol = cholesterol_td.get_text()
        if cholesterol != ' ':
            print 'There are ' + cholesterol + ' of cholesterol in 1 ' + units
        #grab Sodium
        sodium_tr = soup.find('tr' , {'class' : 'sodium'})
        if sodium_tr:
            sodium_td = sodium_tr.find('td', {'class' :'amount'})
            if sodium_td :
                sodium = sodium_td.get_text()
        if sodium != ' ':
            print 'There are ' + sodium + ' of sodium in 1 ' + units
        #grab Total Carbs
        totalCarbs_tr = soup.find('tr' , {'class' : 'total-carbs'})
        if totalCarbs_tr:
            totalCarbs_td = totalCarbs_tr.find('td', {'class' :'amount'})
            if totalCarbs_td :
                totalCarbs = totalCarbs_td.get_text()
        if totalCarbs != ' ':
            print 'There are ' + totalCarbs + ' total carbs in 1 ' + units
        #grab fiber
        fiber_tr = soup.find('tr' , {'class' : 'fiber'})
        if fiber_tr:
            fiber_td = fiber_tr.find('td', {'class' :'amount'})
            if fiber_td :
                fiber = fiber_td.get_text()
        if fiber != ' ':
            print 'There are ' + fiber + ' of fiber in 1 ' + units
        #grab sugar
        sugar_tr = soup.find('tr' , {'class' : 'sugars'})
        if sugar_tr:
            sugar_td = sugar_tr.find('td', {'class' :'amount'})
            if sugar_td :
                sugar = sugar_td.get_text()
        if sugar != ' ':
            print 'There are ' + sugar + ' of sugar in 1 ' + units
        #grab protein
        protein_tr = soup.find('tr' , {'class' : 'protein'})
        if protein_tr:
            protein_td = protein_tr.find('td', {'class' :'amount'})
            if protein_td :
                protein = protein_td.get_text()
        if protein != ' ':
            print 'There are ' + protein + ' of protein in 1 ' + units
        #grab calcium
        calcium_tr = soup.find('tr' , {'class' : 'calcium'})
        if calcium_tr:
            calcium_td = calcium_tr.find('td', {'class' :'amount'})
            if calcium_td :
                calcium = calcium_td.get_text()
        if calcium != ' ':
            print 'There are ' + calcium + ' of calcium in 1 ' + units
    k += 1
