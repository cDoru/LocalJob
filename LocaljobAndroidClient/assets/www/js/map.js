/* JS per la gestione della Mappa */
/* https://developers.google.com/maps/documentation/javascript/controls */
/* TOP_RIGHT RIGHT_TOP LEFT_BOTTOM BOTTOM_LEFT */

var map;
var bologna = new google.maps.LatLng(44.499184,11.353726);

function HomeControl(controlDiv, map) {

  controlDiv.style.padding = '2%';

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.borderStyle = 'none';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.innerHTML = '<img src=\"./img/rotate.png\" style=\"height:20%\">';
  controlUI.appendChild(controlText);

  // Handling eventi
  google.maps.event.addDomListener(controlUI, 'click', function() {
    // Ritorno alla pagina precedente prima dell'evento ORIZZONTALE
    history.back();
  });
}

function initialize() {
  var mapDiv = document.getElementById('map-canvas');
  var mapOptions = {
    zoom: 15,
    center: bologna,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI : true
  }
  map = new google.maps.Map(mapDiv, mapOptions);

  // REVERT
  var homeControlDiv = document.createElement('div');
  var homeControl = new HomeControl(homeControlDiv, map);

  homeControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(homeControlDiv);
  search();

}

google.maps.event.addDomListener(window, 'load', initialize);



/* ---------------- */


function search() {   
  $.ajax({
      async: false,
      type: 'GET',
      url: 'http://95.141.45.174/search?latitudine=44.499184&longitudine=11.353726',      
      crossDomain:true,   
      success: logoutSuccess,
      error: errorLogout
      });   
}

function errorLogout(xhr, textStatus, thrownError)    
{
  alert('&#10006; '+xhr.status+" "+thrownError);
}

function logoutSuccess(xml) {
  //alert(xml);
  var xmlString = $(xml);
  
  $(xmlString).find("worker").each(function () {    
    var $worker = $(this);
        var lati = $worker.find('latitudine').text();
        var longi = $worker.find('longitude').text();
        createMarker(lati,longi);
  });
}

function createMarker(lt,ln) {
  
  var poi = new google.maps.LatLng(lt,ln);
  
  var marker = new google.maps.Marker({
            position: poi,
            map: map
   });    
}