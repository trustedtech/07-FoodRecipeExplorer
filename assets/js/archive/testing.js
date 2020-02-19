// API keys that may be useful
var APIKeyUSDA = "L3tHPcFfPTSKSiXbCfKg2KltRijm4Dlj6PL2hK7I"
var APIKeySpoonacular = "bbf5060f9b6b4edaa0e013dcaafdeb43"

var input

function makeFoodElements(response){
    console.log(response)
    var profile = $("#sectionProfile")
    var container = $("<div>")
    var column1 = $("<div>")
    var column2 = $("<div>")
    var segment = $("<div>")

    $(container).attr("class", "ui two column stackable grid")
    $(column1).attr("class", "column")
    $(column2).attr("class", "column")
    $(segment).attr("class", "ui segment")

    $(profile).append(container)
    $(container).append(column1)
    $(container).append(column2)
    $(column2).append(segment)

    $.each( response.labelNutrients,function(index, element){
        console.log(index)
        var p = $("<p>")
        $(p).text(index+": " + element.value)
        $(segment).append(p)
    })
}

function makeCalls(){
    // USDA ajax call of the generic item
    $.ajax({
        url: "https://api.nal.usda.gov/fdc/v1/search?api_key="+APIKeyUSDA+"\&generalSearchInput="+input,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        for(var i = 0; i < response.foods.length && i < 10; i++){
            // USDA call with item's ID
            $.ajax({
                url: "https://api.nal.usda.gov/fdc/v1/"+ response.foods[0].fdcId+"?api_key="+APIKeyUSDA,
                method:"GET"
            }).then(function(response){
                console.log(response)
                makeFoodElements(response);
            })
        }
    })
        
    // Spoonacular API call by ingredients. Returns 10 items
    $.ajax({
        url: "https://api.spoonacular.com/recipes/findByIngredients?ingredients="+input+"&apiKey="+APIKeySpoonacular,
        method: "GET"
    }).then(function(result){
        console.log(result)
        
        //    $(result).each(function(index, element){
        // Spoonacular recipe call by ID. Currently hard-coded to only get item 0
        // set to 0 during testing to reduce API limits
        $.ajax({
            url: "https://api.spoonacular.com/recipes/"+result[0].id+"/information?includeNutrition=true&apiKey="+APIKeySpoonacular,
            method: "GET"
        }).then(function(result){
            console.log(result);
        })
    })
}

$("#searchBar").on("click", function(){
    input = $("#inputField").val();
    console.log(input)
    makeCalls();
})