
$(document).ready(function(){

    var maxResults = 15;
    var resultHeaders;
    var resultDescr;
    var resultLinks;
    var holdNewSearches = false;

    $("form").on("submit", function(e){            
        e.preventDefault();

        if(!holdNewSearches)
        {
            holdNewSearches = true;
            foldPreviousSearch();
        }
    });

    function foldPreviousSearch()
    {
        $boxes = $(".result-box:not(#proto-box)");
        var timing = 500;

        if($boxes.length > 0)
        { 
            $boxes.animate({marginLeft:"150px"}, timing, function(){
                $(this).remove();
            });

            setTimeout(function(){
                performSearch($("#search-bar").val());                    
            }, timing * 2);                    
        }
        else
            performSearch($("#search-bar").val());                    
    }

    function performSearch(search){            

        $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit="+maxResults+"&search="+search+"&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {

                if(data.hasOwnProperty("error"))
                    handleError();
                else
                {
                    resultHeaders = data[1].slice();
                    resultDescr = data[2].slice();
                    resultLinks = data[3].slice();
                    generateResults();
                }
            },
            error: function (errorMessage) {
                handleError();
            }
        });
    }

    function handleError()
    {
        alert("There's a problem with your search! Please try again.");
        holdNewSearches = false;
    }

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

    performSearch("wikipedia");

});