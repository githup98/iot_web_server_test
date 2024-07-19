/*
	status var
*/
var greenLedState = "OFF";
var redLedState = "OFF";
var tempValue = 25;
var huminityValue = 60;
var dev1="OFF";
var dev2="OFF";

/*
set value for selector by code

function selectElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

selectElement('leaveCode', '11');


*/

/*
set and get value of div use it's id

	var temppp = document.getElementById('device1');
	temppp.value="hellllo";
	$("#uploadStatus1").text(temppp.value);
*/

/*
	Initialize functions here
*/

$(document).ready(function(){
	getStatus();
	getDeviceInfo();
	getControl();

	$("#selectFirmware1").on("click", function(){
		checkSelectedValue(1);
	});
	$("#selectFirmware2").on("click", function(){
		checkSelectedValue(2);
	});
	
	/*
		called from html code
	*/

	////$("#uploadFirmWare1").on("click", function(){
	////	startUploadFirmw(1);
	////});
	////$("#uploadFirmWare2").on("click", function(){
	////	startUploadFirmw(2);
	////});
});

function getStatus()
{
	$("#greenLedID").text(greenLedState);
	$("#redLedID").text(redLedState);
	$("#tempID").text(tempValue);
	$("#huminityID").text(huminityValue);
	$("#device1").text(dev1);
	$("#device2").text(dev2);
	selectorDefault('selectFirmware1', 'NO');
	selectorDefault('selectFirmware2', 'NO');
}


function selectorDefault(id, valueToSet)
{
	let element = document.getElementById(id);
	element.value = valueToSet;
}


function sendValueToHttpServerDevice()
{
	$.ajax({
		url: "/send_value_to_server_device.json",
		dataType: "json",
		method: "POST",
		cache: false,
		header: {'greenLed': greenLedState, 'redLed': redLedState, 'temp': tempValue, 'huminity': huminityValue},
		data:{'timestamp': Date.now()}
	});
}


function getControl()
{
	$("#sendControl").on("click", function(){
		greenLedState = $("#selectGreenState").val();
		redLedState = $("#selectRedState").val();
		if($("#inputTemp").val() != "" && $("#inputTemp").val() != "0")
		{
			tempValue = $("#inputTemp").val();
		}
		if($("#inputHuminity").val() != "" && $("#inputHuminity").val() != "0")
		{
			huminityValue = $("#inputHuminity").val();
		}
		getStatus();
		sendValueToHttpServerDevice();
	});
}

function getDeviceInfo()
{
	$("#deviceID1").text("esp_server");
	$("#newFirmwareID1").text("No");
	$("#deviceID2").text("esp_dht");
	$("#newFirmwareID2").text("No");
}


function getFileInfo(device)
{
	var x = document.getElementById('fileExplorer'+device);
	var file = x.files[0];
	document.getElementById('selectedFileInfo'+device).innerHTML = "Name: " + file.name + 	"<br> Size: " + file.size + " bytes";
}

function openFileExplorer(device)
{
	document.getElementById('fileExplorer'+device).click();
}


function checkSelectedValue(device){
	var x = document.getElementById("file"+device);
	if($("#selectFirmware"+device).val() == "YES")
	{
		if(x.style.display === "none")
		{
			x.style.display = "inline";
		}
	}
	else
	{
		x.style.display = "none";
	}
}





function getUploadStatus(device)
{
	document.getElementById('uploadStatus'+device).innerHTML = "Uploading "+device;
}

function sendHeaderToConfirmDevice(device)
{
	if($("#selectFirmware"+device).val()=="RST")
	{
		device = device + "RST";
	}
	if($("#selectFirmware"+device).val() == "YES")
	{
		device = device + "FIR";
	}
	$.ajax({
		url: "/confirm_device_receive_firmware.json",
		dataType: 'json',
		method: 'POST',
		cache: false,
		headers: {'Device': "device"+device},
		//data: {'timestamp': Date.now()},
	});
}

function updateStatus(device)
{
	if(device == 1)
	{
		if(dev2 == "Downloading")
		{
			document.getElementById("device"+device).innerHTML = "Waiting connection";
		}
		else
		{
			dev1 = "Downloading";
			document.getElementById("device"+device).innerHTML = "Downloading Firmware";
		}
	}
	else
	{
		if(dev1 == "Downloading")
		{
			document.getElementById("device"+device).innerHTML = "Waiting connection";
		}
		else
		{
			dev2= "Downloading";
			document.getElementById("device"+device).innerHTML = "Downloading Firmware";
		}
	}
}


function startUploadFirmw(device)
{
	//send confirm device receive new firmware
	////if(device == 2)
	////{
	////	var x = document.getElementById('uploadFirmWare1');

	////	if(x.style.display === "none")
	////	{
	////		x.style.display = "inline";
	////	}
	////	else
	////	{
	////		x.style.display = "none";
	////	}
	////}
	////document.getElementById("uploadStatus"+device).innerHTML = "device"+device + " is choosen";
	//sendHeaderToConfirmDevice(device);



	//prepair
	var formData = new FormData();
	var file1 = document.getElementById('fileExplorer'+device);
	if(file1.files && file1.files.length == 1)
	{
		var file = file1.files[0];  //files is var of getElementById function
		formData.set("file", file, file.name);
		//formData.Content-Type: multipart/form-data;
		//HTTP Request
		var request = new XMLHttpRequest();
		//request.upload.addEventListener("progress", updateProgress);

		updateStatus(device);
		request.open('POST', "/OTAUpdate");
		request.setRequestHeader('Content-Type', '.textcontrol');
		request.responeType = 'blob';
		request.send(formData);
	}
	else
	{
		window.alert("Select A File Before");
	}
}




//function(e) {
  //return "undefined" != typeof S && S.event.triggered !== e.type ? S.event.dispatch.apply(t, arguments) : void 0
//}

//function A() {
//  var n = e("targetSelect").val();
//  window.location.href = function(e) {
//    let n = T + "/" + r,
//      i = I.find(e => e.name === t);
//    return i ? (v(i, e) ? n += "/" + i.name : (i = I.find(t => v(t, e)), n += "/" + (i ? i.name : t)), i.has_targets && (n += "/" + e)) : n += "/" + t + "/" + e, n += "/" + d, n
//  }(n)
//}
