// Spoonacular API call by ingredients. Returns 10 items
$.ajax({
    url: "https://api.spoonacular.com/recipes/findByIngredients?ingredients="+input+"&apiKey="+APIKeySpoonacular,
    method: "GET"
}).then(function(result){
    console.log(result)
    
    $(result).each(function(index, element){
        // Spoonacular recipe call by ID. Currently hard-coded to only get item 0
        $.ajax({
            url: "https://api.spoonacular.com/recipes/"+result[0].id+"/information?includeNutrition=true&apiKey="+APIKeySpoonacular,
            method: "GET"
        }).then(function(result){
            console.log(result)
})})})