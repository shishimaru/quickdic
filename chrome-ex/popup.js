/* $Id$ */
//console.log = function(v){};
String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
};

var baseURL = "http://eow.alc.co.jp/search?q=";

var alc_html = null;
function get(keyword) {
    var req = new XMLHttpRequest();
    var url = baseURL + encodeURI(keyword);
    req.open("GET", url, true);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && this.responseText.length) {
	    $("#progress").hide();
	    alc_html = this.responseText;
	    var index = alc_html.indexOf("<div id=\"resultsList\"");
	    if(index == -1) {//not found
		$("#message").html("<strong style='color:red;'>not found <i>"
				   + keyword + "</i></strong>");
		showHistory();
		$("#container").html("");
	    } else {
		alc_html = alc_html.substr(index);
		alc_html = $.parseHTML(alc_html)[0];
		$("#message").html("");
		$("#history").html("");
		$("#container").html(alc_html);
		
		//add history
		localStorage.setItem(keyword, new Date());
	    }
	}
    };
    req.send(null);
    $("#progress").show();
}
function showHistory() {
    function comp(a, b) {
	return b.d - a.d;
    }
    var words = [];
    for(var key in localStorage) {
	var date = new Date(localStorage[key]);
	var word = {};
	word["s"] = key;
	word["d"] = date;
	words.push(word);
    }
    words.sort(comp);
    
    var historyHTML = "<h2 class='title'>History</h2><table id='word_history' width='100%'>";
    for(var i = 0; i < words.length; i++) {
	historyHTML += "<tr class='frame' href='" + words[i].s + "'><td title='click for search again!'>" + words[i].s +
	    "</td><td style='float:right'>" +  words[i].d.toLocaleString() + "</td></tr>";
    }
    historyHTML += "</table>";
    $("#history").html(historyHTML);
    $("#container").html("");

    $("#word_history tr").click(function() {
	get($($(this)).attr("href"));
    });
}
document.addEventListener('DOMContentLoaded', function () {
    ct_main = document.getElementById("container");
    $("#search").focus();
    $("#progress").hide();
    $("#search").keypress(function(event) {
	if(event.which == 13) {
	    get(this.value);
	}
    });
    $("#bt_clear").click(function(event) {
	localStorage.clear();
	showHistory();
    });
    $("#bt_history").click(function(event) {
	showHistory();
    });
    
    //show history
    showHistory();
});
