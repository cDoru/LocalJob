/* JS per la gestione della Mappa */
/* https://developers.google.com/maps/documentation/javascript/controls */
/* TOP_RIGHT RIGHT_TOP LEFT_BOTTOM BOTTOM_LEFT */

var map;
var bologna = new google.maps.LatLng(44.499184,11.353726);
var infowindow = new google.maps.InfoWindow({ content: " "});  

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
    //history.back();
    location.href = 'interventi-attivi.html';
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
      success: searchSuccess,
      error: errorLogout
      });   
}

function errorLogout(xhr, textStatus, thrownError)    
{
  alert('&#10006; '+xhr.status+" "+thrownError);
}

function searchSuccess(xml) {
  var xmlString = $(xml);
  
  $(xmlString).find("worker").each(function () {    
    var $worker = $(this);
        var lati = $worker.find('latitudine').text();
        var longi = $worker.find('longitude').text();
        var ragione_sociale = $worker.find('ragioneSociale').text();
        var avt = $worker.find('avatarPath').text();
        var costService = $worker.find('costService').text();
        var costPerHour = $worker.find('costPerHour').text();
        var rating = $worker.find('rating').text();
        var nickname = $worker.find('nickname').text();
        var professionType="";
       
        $worker.find('professionType').each(function( index ) {
    		  professionType = professionType+$(this).text()+" ";
    	}); 
     
        
        createMarker(lati,longi,ragione_sociale,avt, costService, costPerHour, rating, nickname, professionType);
  });
}

function createMarker(lt,ln, ragione_sociale, avatar, costService, costPerHour, rating, nickname, professionType) {
  
  var poi = new google.maps.LatLng(lt,ln);
  
  var marker = new google.maps.Marker({
            position: poi,
            map: map,
            ragione: ragione_sociale,
            avatar: avatar,
            costService: costService,
            costPerHour: costPerHour,
            rating: rating,
            nickname: nickname,
            professionType: professionType
   });    
   
  google.maps.event.addListener(marker, 'click', function () {
			ragioneSociale = marker.ragione;
			avatar = marker.avatar;
			costoServizio = marker.costService;
			costoPerOra = marker.costPerHour;
			rating = marker.rating;
			nickname = marker.nickname;
			professione = marker.professionType;

      // Set dei dati per andare sul profilo utente
      sessionStorage.nick = nickname;

      if (avatar == 'photo') {
        avatar = 'img/missingAvatar.png';
      } else {
        avatar = "http://95.141.45.174/" + avatar;
      }



      // Avatar + ragioneSociale + professione = prima riga della tabella
      firstRow = "<tr><td style='height:100px;width:100px;'><img src='" + avatar + "' style='max-width:100px;padding:1px;"+
      "border:1px solid #000;background-color:#fff;' /></td>"
      + "<td colspan='2'><strong>" 
      + ragioneSociale + "</strong><br />" + professione + "<br />";

      // Indicatori di prezzo = seconda riga della tabella (tabella annidata)
      secondRow = "<table style='width:100%;'><tr><td style='width:50%;text-align:center;'>" 
      + costoServizio + "<img src='img/euro.png'><img style='margin-top:20px;' src='img/call.png'></td>"+
      "<td style='width:50%;'>" + costoPerOra + "<img src='img/euro.png'><img style='margin-top:20px;' src='img/clock.png'>" 
      +"</td></tr></table></td></tr>";

      // Normalizzazione rating
      starOn = "<img src='img/starOn.png'>";
      starOff = "<img src='img/starOff.png'>";
      switch(Math.round(rating)) {
        case 0: stelle =  starOff + starOff + starOff + starOff + starOff; break;
        case 1: stelle =  starOn + starOff + starOff + starOff + starOff; break;
        case 2: stelle =  starOn + starOn + starOff + starOff + starOff; break;
        case 3: stelle =  starOn + starOn + starOn + starOff + starOff; break;
        case 4: stelle =  starOn + starOn + starOn + starOn + starOff; break;
        case 5: stelle =  starOn + starOn + starOn + starOn + starOn; break;
      }

      // Rating + link al profilo (tabella annidata)
      thirdRow = "<tr><td colspan='3' style='text-align:center;'>" + stelle 
      + "<br /><a href='profilo-professionista.html'>Vai al profilo utente</a></td></tr>";  

			infowindow.setContent(
        "<table style='vertical-align:text-top;font-family:Helvetica,Verdana,sans-serif;'>" + firstRow + secondRow + thirdRow + "</table>");
			infowindow.open(map, this);

  
	});
   
}
