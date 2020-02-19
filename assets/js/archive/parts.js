// Creates ten elements in usdaGeneral
// End goal: users can click on them to bring up nutrition details of each item
// TODO: add click function
function recommendOptions(response){
    for(var i = 0; i < response.foods.length && i < 10; i++){
        var pSection = $("<li>")
        $(pSection).attr("id", i)
        $(pSection).attr("fdcId", response.foods[i].fdcId)
        if(typeof response.foods[i].brandOwner !== "undefined")   
            $(pSection).text(response.foods[i].brandOwner)
        else
            $(pSection).text(response.foodSearchCriteria.generalSearchInput)
        
        $("#usdaResultsList").append(pSection)
    }

}

function makeCalls(){
    // USDA ajax call of the generic item
    $.ajax({
        url: "https://api.nal.usda.gov/fdc/v1/search?api_key="+APIKeyUSDA+"\&generalSearchInput="+input,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        recommendOptions(response)
        // LEAVE THIS HERE FOR NOW. I'M GOING TO USE IT LATER WHEN I ENABLE CLICK ELEMENTS

        /*for(var i = 0; i < response.foods.length && i < 10; i++){
            // USDA call with item's ID
            $.ajax({
                url: "https://api.nal.usda.gov/fdc/v1/"+ response.foods[0].fdcId+"?api_key="+APIKeyUSDA,
                method:"GET"
            }).then(function(response){
                console.log(response)
                makeFoodElements(response);
            })
        }*/
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

// Print nutrition info of selected food item
function makeFoodElements(response){
    console.log(response)

    $.each( response.labelNutrients,function(index, element){
        console.log(index)
        var p = $("<p>")
        $(p).text(index+": " + element.value)
        $(segment).append(p)
    })
}
