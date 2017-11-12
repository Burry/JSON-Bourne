from selenium import webdriver #type sudo easy-install selenium (mac)
from selenium.webdriver.support.ui import Select
import re

def SelectUnits(link, key):
    driver = webdriver.Chrome('./../../Desktop/chromedriver')#this path is the path to chromedriver, downloadale from https://chromedriver.storage.googleapis.com/index.html?path=2.33/
    driver.get(link)
    calories_div = driver.find_element_by_id('mCal')
    caloriesOld = calories_div.text
    print calories
    form = driver.find_element_by_id('units')
    for option in form.find_elements_by_tag_name('option'):
        if re.match(key, option.text):
            option.click()
            break
    calories_div = driver.find_element_by_id('mCal')
    caloriesNew = calories_div.text
    n = float(caloriesNew)
    d = float(caloriesOld)

    factor = n/d

    return factor
