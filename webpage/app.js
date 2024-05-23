var redLedStatus = "On";
//var temperature = 0;
//var huminity = 0;
$(document).ready(function(){
	showLedStatus();
	getDHTValue();
	$("#updateDHTValue").on("click", function()
	{
		updateDhtFromHtmltoHttpServer();
		updateDhtValue();
	});
});


function showLedStatus()
{
	$("#ledGreen").text("On");
	$("#ledRed").text("On");
	$("#checkStatus").on ("click", function()
	{
		checkStatusRedLed();
	});
}

function getDHTValue()
{
	$("#getTempDHT").text("30");
	$("#getHuminityDHT").text("60");
	$("#ip_address_label").html("IP Address: ");
}

function runCode()
{
	if($("#deviceName1").val() == "android")
	{
		$("#ledGreen").text("Off");
	}
	else
	{
		$("#ledGreen").text("On");
	}
	
}

function updateDhtValue()
{
	temperature = $("#tempDHT").val();
	huminity = $("#huminityDHT").val();
	$("#getTempDHT").text(temperature);
	$("#getHuminityDHT").text(huminity);
}

function updateDhtFromHtmltoHttpServer()
{
	temp_DHT_value = $("#tempDHT").val();
	huminity_DHT_value = $("#huminityDHT").val();
	$.ajax({
		url: '/update_dht_from_html_to_http_server.json',
		dataType: 'json',
		method: 'POST',
		cache: false,
		headers: {'temp_DHT': temp_DHT_value, 'huminity_DHT' : huminity_DHT_value},
		data: {'timestamp': Date.now()}
	});
}


function checkStatusRedLed()
{
	if(redLedStatus == "On")
	{
		$("#ledRed").text("Off");
		redLedStatus = "Off";
	}
	else
	{
		$("#ledRed").text("On");
		redLedStatus = "On";
	}
}


function getFileInfo()
{
	var x = document.getElementById("fileSelect");
	var file = x.files[0];
	document.getElementById("fileInfo").innerHTML = " File: " + file.name + "<br>" + "Size: " + file.size + " bytes"; //"<br>" is newline
}
function getSSID()                                                                                                                                                                 
{
     $.getJSON('/apSSID.json', function(data) {
         $("#ap_ssid").text(data["ssid"]);
     });
}
function startUpdateFirmware()
{
	
	var formData = new FormData();
	var fileSelected = document.getElementById("fileSelect");
	if(fileSelected.files && fileSelected.files.length == 1)
	{
		var file = fileSelected.files[0]; //get file name (file object)
		formData.set("file", file, file.name);
		document.getElementById("otaStatus").innerHTML = "Uploading Selected File";
		
		//HTTP request
		var request = new XMLHttpRequest();
		//request.upload.addEventListener("progess", updateProgress); //this line no affect to loading file process
		request.open('POST', "/OTAUpdate");
		request.responeType = "blob";
		request.send(formData); //send file
		//document.getElementById("otaStatus").innerHTML = "check point";
	}
	else
	{
		window.alert("Select A File  FIrst")
	}
}
