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
	var inputs = {
			income: $("#income").val()
		,	expenses: $("#expenses").val()
		,	reapr: $("#reapr").val()
		,	investapr: $("#investapr").val()
		,	savings: $("#savings").val()
		,	years: $("#years").val()
		,	mortapr: $("#mortapr").val()
		,	term: $("#term").val()
		,	downpayment: $("#downpayment").val()
		,	tax: $("#tax").val()
		,	homeprice: $('.homeprice', scenario).val()
		,	renmaint: $('.rentmaint', scenario).val()
		,	heatelec: $('.heatelec', scenario).val()
	}

	var results = {
			propertytaxes: inputs.homeprice * (inputs.tax/100)
		,	mortgagepayment: (inputs.homeprice * (1 - (inputs.downpayment/100)) * Math.pow((1 + (inputs.mortapr/12)),(1 + (inputs.mortapr/12)) * (inputs.term * 12))) / Math.pow((1 + (inputs.mortapr/12)), (inputs.term * 12)-1)
		,	homeexpenses: (inputs.homeprice * (inputs.tax/100))/12 + inputs.rentmaint + inputs.heatelec + inputs.expenses
		,	monthlysavings: inputs.income - inputs.expenses - ((inputs.homeprice * (inputs.tax/100))/12 + inputs.rentmaint + inputs.heatelec + inputs.expenses)
		,	homevalue: inputs.homeprice * (Math.pow((1 + inputs.reapr),inputs.years)/1000)
		,	realestateequity: 
		,	realestatedebt:
		,	initstock:
		,	stockequity:
		,	totalnetworth:
		,	instock:
		,	inrealestate:
		,	indebt:
	}
}

function setValues(scenario,results) {
	$('.propertytaxes', scenario).text(results.propertytaxes)
	$('.mortgagepayment', scenario).text(results.mortgagepayment)
	$('.homeexpenses', scenario).text(results.homeexpenses)
	$('.monthlysavings', scenario).text(results.monthlysavings)
	$('.homevalue', scenario).text(results.homevalue)
	$('.realestateequity', scenario).text(results.realestateequity)
	$('.realestatedebt', scenario).text(results.realestatedebt)
	$('.initstock', scenario).text(results.initstock)
	$('.stockequity', scenario).text(results.stockequity)
	$('.totalnetworth', scenario).text(results.totalnetworth)
	$('.instock', scenario).text(results.instock)
	$('.inrealestate', scenario).text(results.inrealestate)
	$('.indebt', scenario).text(results.indebt)
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