function setRawDataFeedValues(results) {
	$('.propertytaxes').text(Math.round(results.propertytaxes))
	$('.mortgagepayment').text(Math.round(results.mortgagepayment))
	$('.homeexpenses').text(Math.round(results.homeexpenses))
	$('.monthlysavings').text(Math.round(results.monthlysavings))
	$('.homevalue').text(Math.round(results.homevalue))
	$('.realestateequity').text(Math.round(results.realestateequity))
	$('.realestatedebt').text(Math.round(results.realestatedebt))
	$('.initstock').text(Math.round(results.initstock))
	$('.stockequity').text(Math.round(results.stockequity))
	$('.totalnetworth').text(Math.round(results.totalnetworth))
	$('.instock').text(Math.round(results.instock))
	$('.inrealestate').text(Math.round(results.inrealestate))
	$('.indebt').text(Math.round(results.indebt))
}

function buildRawDataFeed() {
	var row = document.createElement("tr");

	$(row).append($(document.createElement("td")).addClass("propertytaxes"));
	$(row).append($(document.createElement("td")).addClass("mortgagepayment"));
	$(row).append($(document.createElement("td")).addClass("homeexpenses"));
	$(row).append($(document.createElement("td")).addClass("monthlysavings"));
	$(row).append($(document.createElement("td")).addClass("homevalue"));
	$(row).append($(document.createElement("td")).addClass("realestateequity"));
	$(row).append($(document.createElement("td")).addClass("realestatedebt"));
	$('#rawdatatable1 tbody').append(row);

	row = document.createElement("tr");
	$(row).append($(document.createElement("td")).addClass("initstock"));
	$(row).append($(document.createElement("td")).addClass("stockequity"));
	$(row).append($(document.createElement("td")).addClass("totalnetworth"));
	$(row).append($(document.createElement("td")).addClass("instock"));
	$(row).append($(document.createElement("td")).addClass("inrealestate"));
	$(row).append($(document.createElement("td")).addClass("indebt"));

	$('#rawdatatable2 tbody').append(row);
}