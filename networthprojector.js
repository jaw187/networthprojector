/*

results = {
	HomePrice
	PropertyTaxes
	Rent/Maint	
	Heat/Electric	
	MortgagePayment	
	HomeExpenses	
	MonthlySavings	
	HomeValue (k)	
	RealEstateEquity (k)	
	RealEstateDebt (k)	
	InitStock	
	Stock Equity (k)	
	TotalNetWorth (mil)	
	InStock (%)	
	InReal Estate (%)	
	InDebt(%)
}

*/

$(function () {
	setDefaultValues(addScenario());
})

function addScenario() {
	var scenario = buildScenarioRow();
	return scenario;
}

function getValues(scenario) {

}

function calculateResults(scenario) {

}

function setValues(scenario,results) {
	$('.homeprice', scenario).val(results.homeprice)
	$('.propertytaxes', scenario).append(results.propertytaxes)
	$('.rentmaint', scenario).val(results.rentmaint)
	$('.heatelec', scenario).val(results.heatelec)
	$('.mortgagepayment', scenario).append(results.mortgagepayment)
	$('.homeexpenses', scenario).append(results.homeexpenses)
	$('.monthlysavings', scenario).append(results.monthlysavings)
	$('.homevalue', scenario).append(results.homevalue)
	$('.realestateequity', scenario).append(results.realestateequity)
	$('.realestatedebt', scenario).append(results.realestatedebt)
	$('.initstock', scenario).append(results.initstock)
	$('.stockequity', scenario).append(results.stockequity)
	$('.totalnetworth', scenario).append(results.totalnetworth)
	$('.instock', scenario).append(results.instock)
	$('.inrealestate', scenario).append(results.inrealestate)
	$('.indebt', scenario).append(results.indebt)
}

function setDefaultValues(scenario) {
	$("#income").val(7000)
	$("#expenses").val(2000);
	$("#reapr").val(5);
	$("#investapr").val(7);
	$("#savings").val(50000);
	$("#years").val(20);
	$("#mortapr").val(3.875);
	$("#term").val(30);
	$("#downpayment").val(12);
	$("#tax").val(2);

	$('.homeprice', scenario).val(100000)
	$('.rentmaint', scenario).val(200)
	$('.heatelec', scenario).val(200)
}

function buildInputField(which,d) {
	var form = $(document.createElement("form")).addClass("pure-form pure-g")
	  , div = $(document.createElement("div")).addClass("pure-u-1")
	  , input = $($(document.createElement("input")).addClass("pure-input-1")).addClass(which);

	$(d).append($(form).append($(div).append(input)));
}

function buildScenarioRow() {
	var row = document.createElement("tr");

	var homepricetd = document.createElement("td");
	buildInputField('homeprice',homepricetd);
	$(row).append(homepricetd); 

	$(row).append($(document.createElement("td")).addClass("propertytaxes"));

	var rentmainttd = document.createElement("td");
	buildInputField('rentmaint',rentmainttd);
	$(row).append(rentmainttd);

	var heatelectd = document.createElement("td");
	buildInputField('heatelec',heatelectd);
	$(row).append(heatelectd);

	$(row).append($(document.createElement("td")).addClass("mortgagepayment"));
	$(row).append($(document.createElement("td")).addClass("homeexpenses"));
	$(row).append($(document.createElement("td")).addClass("monthlysavings"));
	$(row).append($(document.createElement("td")).addClass("homevalue"));
	$(row).append($(document.createElement("td")).addClass("realestateequity"));
	$(row).append($(document.createElement("td")).addClass("initstock"));
	$(row).append($(document.createElement("td")).addClass("stockequity"));
	$(row).append($(document.createElement("td")).addClass("totalnetworth"));
	$(row).append($(document.createElement("td")).addClass("instock"));
	$(row).append($(document.createElement("td")).addClass("inrealestate"));
	$(row).append($(document.createElement("td")).addClass("indebt"));

	$('tbody.scenarios').append(row);

	return row;
}