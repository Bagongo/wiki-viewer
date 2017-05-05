$(document).ready(function(){

    var maxResults = 15;
    var resultHeaders;
    var resultDescr;
    var resultLinks;
    var holdNewSearches = false; //prevents new search from interfering with the previous one

    $("form").on("submit", function(e){            
        e.preventDefault();
        
        if(!holdNewSearches)
        {
            holdNewSearches = true;
            foldPreviousSearch();
        }
    });

    //remove previous search's boxes and initiate new search
    function foldPreviousSearch()
    {
        $boxes = $(".result-box:not(#proto-box)");
        var timing = 500;

        if($boxes.length > 0)
        { 
            $boxes.animate({marginLeft:"+=7000px"}, timing, function(){
                $(this).remove();
            });
            
            setTimeout(function(){
                performSearch($("#search-bar").val());                    
            }, timing * 2);                    
        }
        else
            performSearch($("#search-bar").val());                    
    }
      
    //make a request to the Wikpedia's API and preps the returned data      
    function performSearch(search)
    {            
        $.ajax({
            url: "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit="+maxResults+"&search="+search+"&callback=?",
            dataType: "json",
            success: function (data) {                                      
                if(data.hasOwnProperty("error") || data[1].length < 1)
                    handleError(data.error);
                else
                {
                    resultHeaders = data[1].slice();
                    resultDescr = data[2].slice();
                    resultLinks = data[3].slice();
                    generateResults();
                }
            },
            error: function (errorMessage) {
                handleError(errorMessage);
            }
        });
    }

    function handleError(error)
    {
        console.log(error);
        alert("Your search had no results or some error occurred...");
        holdNewSearches = false;
    }

    //creates a new result box and fill its fields with the search data 
    function generateResults()
    {               
        for(var i=0; i < resultHeaders.length; i++)
        {
            var $cloneBox = $("#proto-box").clone(true);

            $cloneBox.removeAttr("id");
            $cloneBox.css("order", i);
            $cloneBox.find("h4").text(resultHeaders[i]);
            $cloneBox.find("p").text(resultDescr[i]);
            $cloneBox.find("a").attr("href", resultLinks[i]);
            $("#flex-container").append($cloneBox);
        }
                    
        $(".result-box:not(#proto-box)").addClass("pop-left");
        holdNewSearches = false;
    }

    //intial default search
    performSearch("wikipedia");

});