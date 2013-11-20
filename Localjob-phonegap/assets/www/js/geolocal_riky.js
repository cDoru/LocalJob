var map;

myLat = 44.494991; //Centro della mappa, vicino pazza maggiore
myLng = 11.342299;

cloudmadeAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';
	 

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	
	getMap();		
	piazzaPOI();	
			
	$('#geome').click(function()
	{	 navigator.notification.activityStart("Attendi un attimo...", "Ti sto localizzando...");
		 navigator.geolocation.getCurrentPosition(onSuccess, onError);
	});		
       
}

function getMap() {	
	map = L.map('map', {
    center: [myLat, myLng],
    zoom: 16
	});
	
	L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
			maxZoom: 19, attribution: cloudmadeAttrib
	}).addTo(map);	
}

function creaPOI(lat,lng, testo) {	
	punto = L.marker([lat, lng]).addTo(map).bindPopup(testo);
	return punto
}


function onSuccess(position) {
	navigator.notification.activityStop();
	latitudine = position.coords.latitude;
	longitudine = position.coords.longitude;
	
	localMe = creaPOI(latitudine,longitudine,"<b>Eccoti!</b><br />Ti ho trovato.");
	localMe.openPopup();
	
	map.panTo(new L.LatLng(latitudine, longitudine));
}

function onError(error) {
		
		navigator.notification.activityStop();
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }


function piazzaPOI() {
	data = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom"><Document>	<name>colonnine elettriche.kml</name>	<StyleMap id="m_ylw-pushpin">		<Pair>			<key>normal</key>			<styleUrl>#s_ylw-pushpin</styleUrl>		</Pair>		<Pair>			<key>highlight</key>			<styleUrl>#s_ylw-pushpin_hl</styleUrl>		</Pair>	</StyleMap>	<Style id="s_ylw-pushpin_hl">		<IconStyle>			<scale>1.3</scale>			<Icon><href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>			</Icon>			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>		</IconStyle>	</Style>	<Style id="s_ylw-pushpin">		<IconStyle>			<scale>1.1</scale>			<Icon><href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>			</Icon>			<hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>		</IconStyle>	</Style>	<Folder>		<name>colonnine elettriche</name>		<open>1</open>		<Placemark>			<name>Piazza San Francesco </name>			<description>Piazza San Francesco una colonnina in fregio al civico 8, sul marciapiede a fianco del posto auto in linea </description>			<LookAt><longitude>11.33596036299067</longitude><latitude>44.49547266648178</latitude><altitude>0</altitude><heading>0.0002500168811551066</heading><tilt>21.30715247291622</tilt><range>364.2992056911833</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.33537084722421,44.4952373303718,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>via di Saliceto </name>			<description>via di Saliceto all&apos;interno del parcheggio adiacente il giardino Guido Rossa,una colonnina  su area verde a metà del terzo stallo sosta, quello dopo gli stalli adibiti a persone con ridotte capacità motorie </description>			<LookAt><longitude>11.35074859647203</longitude><latitude>44.51271495967399</latitude><altitude>0</altitude><heading>0.002164115921894435</heading><tilt>30.000330984651</tilt><range>242.2449395040682</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.34966855817975,44.51265939145816,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>via Boldrini </name>			<description>via Boldrini in fregio al civico 12 di via Gramsci, due colonnine sul marciapiede rispettivamente a metà dei due stalli auto a lisca di pesce dopo gli stalli auto riservati a mezzi USL </description>			<LookAt><longitude>11.34307070512477</longitude><latitude>44.50450064496138</latitude><altitude>0</altitude><heading>-12.20711559617421</heading><tilt>25.71379746092991</tilt><range>224.5703696311453</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.34311980918672,44.50413471123644,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>Viale XII Giugno</name>			<description>Viale XII Giugno, una colonnina fronte al civico 2 di via Vascelli, su marciapiede a fianco del primo posto in linea tra alberature dopo fermata ATC </description>			<LookAt><longitude>11.34479392036519</longitude><latitude>44.48884974380476</latitude><altitude>0</altitude><heading>-19.42354028749693</heading><tilt>17.16374320599599</tilt><range>350.9731863645172</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.3438992174431,44.48805856697548,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>via Augusto Righi </name>			<description>via Augusto Righi in fregio al civico 14, in mezzo a stallo auto tra alberature a lisca di pesce, su marciapiede </description>			<LookAt><longitude>11.34507399853059</longitude><latitude>44.49917924912781</latitude><altitude>0</altitude><heading>-19.42305323343686</heading><tilt>30.00097798830738</tilt><range>217.7914697895238</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.34502342983312,44.49903686749236,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>Piazza di Porta Mascarella </name>			<description>Piazza di Porta Mascarella (via Pichat angolo via Mascarella) in fregio al civico 7, su sede stradale a fianco del primo posto auto a pettine </description>			<LookAt><longitude>11.35294455761224</longitude><latitude>44.50202089024373</latitude><altitude>0</altitude><heading>-3.849205219497704</heading><tilt>30.00050379204764</tilt><range>112.5441596987162</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.35299168684417,44.50186133797261,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>via Pietro Mainoldi</name>			<description>via Pietro Mainoldi, una colonnina a lato del posto auto in linea che rimane sul lato sx all&apos;ingresso del parcheggio coperto del centro commerciale (ex Dima) a fianco dello stallo riservato alle persone con ridotte capacità motorie </description>			<LookAt><longitude>11.37620362070276</longitude><latitude>44.48448721287739</latitude><altitude>0</altitude><heading>-15.52076654101244</heading><tilt>28.2770191415071</tilt><range>189.5345857942488</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.37579244966279,44.48443114217957,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>Piazza dei Martiri</name>			<description>Piazza dei Martiri, su marciapiede a fianco del primo stallo sosta in linea </description>			<LookAt><longitude>11.34065298008546</longitude><latitude>44.50294918681181</latitude><altitude>0</altitude><heading>-29.95310684318871</heading><tilt>24.51105114857429</tilt><range>207.1518108563693</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.34002033043311,44.50265750317885,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>Piazza F.D. Roosvelt </name>			<description>Piazza F.D. Roosvelt in prossimità all&apos;intersezione con via IV Novembre, una colonnina in sostituzione ad un dissuasore esistente che delimita l&apos;area di sosta dal percorso pedonale, su sede stradale a fianco del posto auto a pettine </description>			<LookAt><longitude>11.34037622491915</longitude><latitude>44.49430554291733</latitude><altitude>0</altitude><heading>-27.12702406821983</heading><tilt>30.00011248404522</tilt><range>142.2669291789007</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.34002358262838,44.49411334023635,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>via S. Giacomo </name>			<description>via S. Giacomo in fregio al civico 9/2, una colonnina sul marciapiede a fianco del primo stallo auto in linea dopo gli stalli riservati motocicli </description>			<LookAt><longitude>11.35583995293306</longitude><latitude>44.49656905148265</latitude><altitude>0</altitude><heading>-27.11604704731426</heading><tilt>29.86585466111722</tilt><range>141.9875288869687</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.35551253165387,44.49638058444428,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>via Ugo Foscolo</name>			<description>via Ugo Foscolo, sul marciapiede a fianco dello stallo sosta in linea precedente l&apos;accesso al civico 7 </description>			<LookAt><longitude>11.33026116949649</longitude><latitude>44.4917984216591</latitude><altitude>0</altitude><heading>-0.01432397502570771</heading><tilt>24.27877495831114</tilt><range>53.4509551604821</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.33010292773114,44.49185734669858,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>Piazza della Pace</name>			<description>Piazza della Pace, lato parco i primi due posti auto a pettine all&apos;intersezione con via XXI Aprile 1945, due colonnine su area verde</description>			<LookAt><longitude>11.31204773034211</longitude><latitude>44.49204411190212</latitude><altitude>0</altitude><heading>-0.02816052144623002</heading><tilt>30.00007020781353</tilt><range>132.5998904904932</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.31192445342959,44.49195948641058,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>via Dante Alighieri </name>			<description>via Dante Alighieri in prossimità al civico 14, due colonnine sul marciapiede, i primi stalli auto in linea in prossimità di Piazza Giosuè Carducci dopo quelli di &quot;car scering</description>			<LookAt><longitude>11.35686038133645</longitude><latitude>44.48744698980025</latitude><altitude>0</altitude><heading>0.005422047865976995</heading><tilt>30.00003873209145</tilt><range>125.2753349216316</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.35665108642559,44.48729005589541,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>via Riva Reno </name>			<description>via Riva Reno in prossimità del civico 60, sul marciapiede fronte lo stallo sosta in linea precedente l&apos;intersezione con via Brugnoli </description>			<LookAt><longitude>11.33848906842775</longitude><latitude>44.4993898334828</latitude><altitude>0</altitude><heading>-0.007496405982072088</heading><tilt>30.00103696677761</tilt><range>231.0227397826862</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.33872958592153,44.4990463943891,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>Via Fioravanti</name>			<description>Via Fioravanti all&apos;intersezione con via Tiarini dopo posto Handicap</description>			<LookAt><longitude>11.34064091703056</longitude><latitude>44.50934235779333</latitude><altitude>0</altitude><heading>-0.00598843455136725</heading><tilt>30.00024449027344</tilt><range>171.2498839087366</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.34046638127769,44.50904608638985,0</coordinates>			</Point>		</Placemark>		<Placemark>			<name>Via Aldo Moro</name>			<description>Via Aldo Moro 18</description>			<LookAt><longitude>11.36285982957413</longitude><latitude>44.50980588555527</latitude><altitude>0</altitude><heading>0.009605994556051455</heading><tilt>30.00082746943516</tilt><range>184.1508848198644</range><gx:altitudeMode>relativeToSeaFloor</gx:altitudeMode>			</LookAt>			<styleUrl>#m_ylw-pushpin</styleUrl>			<Point><gx:drawOrder>1</gx:drawOrder><coordinates>11.36244719135954,44.50938807842285,0</coordinates>			</Point>		</Placemark>	</Folder></Document></kml>';
	jQuery(data).find("Placemark").each(function() {
		var place = jQuery(this);
		name = place.find("name").text();
		description = place.find("description").text();
		longitudine2 = place.find("LookAt").find("longitude").text();		
		latitudine2 = place.find("LookAt").find("latitude").text();
		
		creaPOI(latitudine2,longitudine2,"<b>"+name+"</b><br />"+description);
		
	});
}
