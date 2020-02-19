// API keys that may be useful
var APIKeyUSDA = "L3tHPcFfPTSKSiXbCfKg2KltRijm4Dlj6PL2hK7I"
var APIKeySpoonacular = "1a70f69a748a4b5e80cb0e156492511e"
// var nutrientMap = [
//     {1008:"Calories: "},
//     {1004:"Total Fat: "},
//     {1292:"Unsaturated Fat (Mono): "},
//     {1293:"Unsaturated Fat (Poly): "},
//     {1258:"Saturated Fat: "},
//     {1257:"Trans Fat: "},
//     {1253:"Cholesterol: "},
//     {1093:"Sodium: "},
//     {2039:"Carbohydrates: "},
//     {1079:"Dietary Fiber: "},
//     {2000:"Added Sugar: "},
//     {1003:"Protein: "},];
var nutrientMap = {
    1008:"Calories: ",
    1004:"Total Fat: ",
    1292:"Unsaturated Fat (Mono): ",
    1293:"Unsaturated Fat (Poly): ",
    1258:"Saturated Fat: ",
    1257:"Trans Fat: ",
    1253:"Cholesterol: ",
    1093:"Sodium: ",
    2039:"Carbohydrates: ",
    1079:"Dietary Fiber: ",
    2000:"Added Sugar: ",
    1003:"Protein: "
};

var input;

$('#searchForm').on("submit",(function(event){
    event.preventDefault();
    $('#inputDiv').addClass('loading');
    input = $('#inputField').val();
    console.log("Search String: " + input);

    //Clears any existing search results
    $('#usdaResultsList').empty();
    $('#nutrientList').empty();
    $('#itemName').empty();
    $('#recipeList').empty();


    getUSDAGeneral();
    getRecipe();
})) 
//Listens for a click on the Search submit button
$('#inputSubmit').on("click",(function(){
    $('#inputDiv').addClass('loading');
    input = $('#inputField').val();
    console.log("Search String: " + input);

    //Clears any existing search results
    $('#usdaResultsList').empty();
    $('#nutrientList').empty();
    $('#itemName').empty();
    $('#recipeList').empty();


    getUSDAGeneral();
    getRecipe();
}))
$('')


function getUSDAGeneral(){

    $.ajax({
        url: "https://api.nal.usda.gov/fdc/v1/search?api_key="+APIKeyUSDA+"\&generalSearchInput="+input+"\&includeDataTypeList=SR%20Legacy,Foundation",
        method: "GET"
    }).then(function(response) {
        console.log(response);
        $('#inputDiv').removeClass('loading');
        
        //Loop through the resulting array of food items 
        response.foods.forEach(function(item, index){

            //Create an appendix string specifying the brand if one exists 
            if ( 'brandOwner' in item )
                { var brand = " --[Brand: " + item.brandOwner + "]";}
            else 
                { var brand = "";}            

            //Create and append a list element that relates to this food item
            var listItem = $('<li/>').attr('data-fdcid', item.fdcId).html('<a class="usda-results" href="#">' + item.description +  brand + '</a>');
            $('#usdaResultsList').append(listItem);

        })

        //Listens for clicks on USDA general result items
        $('.usda-results').on("click",(function(){
            event.stopPropagation();
            var fdcId = $(this).parent().attr('data-fdcid');
            console.log("FDC ID of selected item: " + fdcId);
            
            //Clear any existing content from prior searches and toggle table header
            $('#nutrientList').empty();
            $('#tablehead').css('display','table-header-group');
            $('#measureref').css('display','inline');
            $('#foodResults').css('padding-top','30px');

            getUSDASpecific(fdcId);

        }));
    });
}

function getUSDASpecific(lookup){
    $.ajax({
        url: "https://api.nal.usda.gov/fdc/v1/"+ lookup +"?api_key="+APIKeyUSDA,
        method:"GET"
    }).then(function(response){
        console.log(response);

        $('#itemName').text(response.description);

        //Populate nutrient data
        response.foodNutrients.forEach(function(item,index){

            var refID = item.nutrient.id;

            if ((nutrientMap.hasOwnProperty(refID)) && (item.amount !== undefined)){
                var nutrient = $('<tr/>').html('<td class="nutrient-key">' + nutrientMap[refID] + '</td><td class="nutrient-value">' + item.amount + " " + item.nutrient.unitName + '</td>');  
                $('#nutrientList').append(nutrient);
            }
        });
    })
}

function getRecipe(){
    // Spoonacular API call by ingredients. Returns 10 items
    $.ajax({
        url: "https://api.spoonacular.com/recipes/findByIngredients?ingredients="+input+"&apiKey="+APIKeySpoonacular,
        method: "GET"
    }).then(function(result){
        console.log(result)

        var i = Math.floor(Math.random()*result.length);
        var j = Math.floor(Math.random()*result.length);
        var k = Math.floor(Math.random()*result.length);
        if (i == j){
            j += 1;
            j %= result.length;
        }
        if (i == k){
            k += 1;
            k %= result.length;
        }
        if(j == k){
            k += 1;
            k %= result.length;
        }
       //$(result).each(function(index, element){
        // Spoonacular recipe call by ID. Currently hard-coded to only get item 0
        $.ajax({
            url: "https://api.spoonacular.com/recipes/"+result[i].id+"/information?includeNutrition=true&apiKey="+APIKeySpoonacular,
            method: "GET"
        }).then(function(result){
            console.log(result)
            createRecipeElement(result);
        })
        $.ajax({
            url: "https://api.spoonacular.com/recipes/"+result[j].id+"/information?includeNutrition=true&apiKey="+APIKeySpoonacular,
            method: "GET"
        }).then(function(result){
            console.log(result)
            createRecipeElement(result);
        })
        $.ajax({
            url: "https://api.spoonacular.com/recipes/"+result[k].id+"/information?includeNutrition=true&apiKey="+APIKeySpoonacular,
            method: "GET"
        }).then(function(result){
            console.log(result)
            createRecipeElement(result);
        })
    })
}

function createRecipeElement(result){
    // list element
    var listItem = $("<li>");

    // recipe container
    var container = $("<div>");
    $(container).attr("class", "ui segment");
    $(listItem).append(container);

    // recipe title
    var text = $("<h5>");
    $(text).attr("class", "ui center aligned header");
    var link = $("<a>");
    $(link).text(result.title);
    $(link).attr("href", result.sourceUrl);
    $(link).attr("target", "_blank");
    $(text).append(link);
    $(container).append(text);

    // grid element
    var grid = $("<div>");
    $(grid).attr("class", "ui three column doubling grid container");
    $(container).append(grid);

    // first column
    var column1 = $("<div>");
    $(column1).attr("class", "column");
    $(grid).append(column1)

    // recipe image
    var image = $("<img>");
    $(image).attr("src", result.image);

    if (typeof $(image).attr("src")==="undefined")
        { $(image).attr("src", "assets/img/968871-312x231.jpg"); }
    else 
        { $(image).attr("class", "ui small image"); }
    $(column1).append(image);

    // second column
    var column2 = $("<div>");
    $(column2).attr("class", "column");
    $(grid).append(column2)

    // second column content
    var servingSize = $("<p>");
    var prepTime = $("<p>");
    var cookTime = $("<p>");
    $(servingSize).text("Servings: "+ result.servings);
    $(prepTime).text("Prep Time: " + result.preparationMinutes+ " minutes");
    $(cookTime).text("Cooking Time: "+ result.cookingMinutes+" minutes");
    $(column2).append(servingSize)
    $(column2).append(prepTime)
    $(column2).append(cookTime)
    
    // third column
    var column3 = $("<div>");
    $(column3).attr("class", "column");
    $(grid).append(column3)

    // third column elements
    if (result.vegetarian){
        var vegetarian = $("<p>");
        $(vegetarian).text("Vegetarian")
        $(column3).append(vegetarian)
    }
    if (result.vegan){
        var vegan = $("<p>");
        $(vegan).text("Vegan")
        $(column3).append(vegan)
    }
    if (result.glutenFree){
        var glutenFree = $("<p>");
        $(glutenFree).text("Gluten Free")
        $(column3).append(glutenFree)
    }
    if (result.dairyFree){
        var dairyFree = $("<p>");
        $(dairyFree).text("Dairy Free")
        $(column3).append(dairyFree)
    }
    $('#recipeList').append(listItem);
    console.log(listItem);
}