CODE:

input field:  food item











UI:
 - input fields for: food eaten, brand/restaurant, amount, 
 - 
 How to use the USDA API:

It will require two ajax calls. The first one will be a call with the generic item.
"https://api.nal.usda.gov/fdc/v1/search?api_key=" + APIKeyUSDA + "\&generalSearchInput=" + input

 You then need to pull the fdcID with response.foods[index].fdcId.

The second ajax call will use the fdcID
 "https://api.nal.usda.gov/fdc/v1/"+ fdcID +"?api_key=" + APIKeyUSDA
 
 Nutrition facts can be found using response.labelNutrients
