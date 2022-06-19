/* current weather - Built-in API request by city name
let weather = {
    "apiKey": "be5feda7db54ea851ca9f1b5fd0e39d3",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q="
            + city
            + "&units=metric&appid="
            + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { country } = data.sys;
        const { icon, description } = data.weather[0];
        const { temp, humidity, feels_like } = data.main;
        const { speed, deg } = data.wind;
        const { lat, lon } = data.coord;
        //document.querySelector(".city").innerText = "Weather in " + name + ", " + country;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind: " + speed + " km/h";
        document.querySelector(".wind_icon2").style.transform = 'rotate(' + deg + 'deg)';
        document.querySelector(".weather").classList.remove("loading");
        console.log(data);

        //mapbox
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXlvdWIyMjExIiwiYSI6ImNsM3o2N3U2dzBreHkza3F3dm8yMnRkaTgifQ.QcyJ9B6_e5S93W3EgInZyQ';
        const mapap = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [lon, lat], // starting position [lng, lat]
            zoom: 10 // starting zoom
        });

        
                document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?"
                    + name
                    + " "
                    + description + "')"
        
    },
search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
}
};

*/
// current weather - an API call by lat long
let weatherlatlong = {
    "apiKey": "be5feda7db54ea851ca9f1b5fd0e39d3",
    "unit": "metric",
    fetchWeatherlatlong: function (lati, long) {
        fetch("https://api.openweathermap.org/data/2.5/weather?lat="
            + lati
            + "&lon="
            + long
            + "&units="
            + this.unit
            + "&appid="
            + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.displayWeatherlatlong(data));
        document.querySelector(".city").innerText = "Weather in " + lotlattocity.fetchreversegeo(long, lati);

        //mapbox: https://www.mapbox.com/install/js/cdn-install/
        //https://docs.mapbox.com/mapbox-gl-js/example/
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXlvdWIyMjExIiwiYSI6ImNsM3o2N3U2dzBreHkza3F3dm8yMnRkaTgifQ.QcyJ9B6_e5S93W3EgInZyQ';

        /* Add support for right-to-left scripts
         Use the mapbox-gl-rtl-text plugin to support right-to-left languages such as Arabic and Hebrew.
        By setting the lazy parameter to true, the plugin is only loaded when the map first encounters Hebrew or Arabic text.
         Mapbox Studio loads this plugin by default.
        */
        /*
                if (mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
                    mapboxgl.setRTLTextPlugin(
                        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
                        (): void => { },
                        true // Lazy load the plugin only when text is in arabic
                    )
                }
        */


        const mapap = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [long, lati], // starting position [lng, lat]
            zoom: 10 // starting zoom
        });
        // Add zoom and rotation controls to the map.
        // https://docs.mapbox.com/mapbox-gl-js/example/navigation/
        mapap.addControl(new mapboxgl.NavigationControl());
    },
    displayWeatherlatlong: function (data) {
        const { name } = data;
        //const { country } = data.sys;
        const { icon, description } = data.weather[0];
        const { temp, humidity, feels_like } = data.main;
        const { speed, deg } = data.wind;
        //document.querySelector(".city").innerText = "Weather in " + name + ", " + country;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png"
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind: " + speed + " km/h";
        document.querySelector(".wind_icon2").style.transform = 'rotate(' + deg + 'deg)';
        document.querySelector(".weather").classList.remove("loading");
        //console.log(data);




        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?"
            + name
            + " "
            + description + "')"

    },

};


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        ipgeo.fetchip();
    }
}

function showPosition(position) {
    weatherlatlong.fetchWeatherlatlong(position.coords.latitude, position.coords.longitude);
}

function showError(error) {

    ipgeo.fetchip();
}

let ipgeo = {
    "apiKey_ipgeo": "0043fb7323ed4ebda6c4a96250d5b3c3",
    fetchip: function () {
        fetch('https://api.ipgeolocation.io/ipgeo?apiKey='
            + this.apiKey_ipgeo
            + '&fields=geo&excludes=continent_code,continent_name'
        )
            .then(response => {
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                return response.json();
            })
            .then((data) => this.displayLocationIP(data))
            .catch(error => {
                weatherlatlong.fetchWeatherlatlong(32.735687, -97.1080656);
            });
    },
    displayLocationIP: function (data) {
        const { city, state_prov, country_code2, latitude, longitude } = data;
        weatherlatlong.fetchWeatherlatlong(latitude, longitude);
        document.querySelector(".city").innerText = "Weather in " + city + ", " + state_prov + ", " + country_code2;
        //console.log(data);
    }
};

getLocation();

/* Geocoding
https://docs.mapbox.com/api/search/geocoding/
 
Forward Geocoding:
%%
The forward geocoding query type allows you to look up a single location by name
and returns its geographic coordinates.
 
https://api.mapbox.com/geocoding/v5/{endpoint}/{search_text}.json?access_token={Access_Token}
 
Required parameters:
{
endpoint: string- One of mapbox.places or mapbox.places-permanent, as described in the Endpoints section.
(
The Geocoding API includes two different endpoints: mapbox.places and mapbox.places-permanent.
mapbox.places:Requests to the mapbox.places endpoint must be triggered by user activity. Any results must be displayed on a Mapbox map and cannot be stored permanently, as described in Mapbox’s terms of service and included service terms.
mapbox.places-permanent: The mapbox.places-permanent endpoint gives you access to two services: permanent geocoding and batch geocoding. If you're interested in using the mapbox.places-permanent endpoint for these use cases, contact Mapbox sales. It's important to speak with an Account Manager on the Sales team prior to making requests to the mapbox.places-permanent endpoint, as unsuccessful requests made by an account that does not have access to the endpoint may be billable.
)
 
search_text: string- The feature you’re trying to look up. This could be an address, a point of interest name, a city name, etc. When searching for points of interest, it can also be a category name (for example, “coffee shop”).
}
 
Optional parameters:
{
autocomplete: boolean- Specify whether to return autocomplete results (true, default) or not (false). When autocomplete is enabled, results will be included that start with the requested string, rather than just responses that match it exactly. For example, a query for India might return both India and Indiana with autocomplete enabled, but only India if it’s disabled.
bbox: number- Limit results to only those contained within the supplied bounding box. Bounding boxes should be supplied as four numbers separated by commas, in minLon,minLat,maxLon,maxLat order. The bounding box cannot cross the 180th meridian.
country: string- Limit results to one or more countries. Permitted values are ISO 3166 alpha 2 country codes separated by commas.
fuzzyMatch: boolean- Specify whether the Geocoding API should attempt approximate, as well as exact, matching when performing searches (true, default), or whether it should opt out of this behavior and only attempt exact matching (false). For example, the default setting might return Washington, DC for a query of wahsington, even though the query was misspelled.
language: string- Specify the user’s language. This parameter controls the language of the text supplied in responses, and also affects result scoring, with results matching the user’s query in the requested language being preferred over results that match in another language. For example, an autocomplete query for things that start with Frank might return Frankfurt as the first result with an English (en) language parameter, but Frankreich (“France”) with a German (de) language parameter.
limit: integer- Specify the maximum number of results to return. The default is 5 and the maximum supported is 10.
types: string- Filter results to include only a subset (one or more) of the available feature types. Options are country, region, postcode, district, place, locality, neighborhood, address, and poi. Multiple options can be comma-separated. Note that poi.landmark is a deprecated type that, while still supported, returns the same data as is returned using the poi type. For more information on the available types, see the data types section.
}
 
 
%%
Response: Forward geocoding
%%
 
 
%% Reverse geocoding
 
The reverse geocoding query type allows you to look up a single pair of coordinates and returns the geographic feature 
or features that exist at that location.
 
https://api.mapbox.com/geocoding/v5/{endpoint}/{longitude},{latitude}.json
 
Required parameters:
{
endpoint: string- One of mapbox.places or mapbox.places-permanent, as described in the Endpoints section.
longitude,latitude: number- A longitude,latitude pair that specifies the location being queried.
}
 
Optional parameters:
{
country: string- Limit results to one or more countries. Permitted values are ISO 3166 alpha 2 country codes separated by commas.
language: string- Specify the user’s language. This parameter controls the language of the text supplied in responses. More than one value can also be specified, separated by commas, for applications that need to display labels in multiple languages.
limit: integer- Specify the maximum number of results to return. The default is 1 and the maximum supported is 5.
types: Filter results to include only a subset (one or more) of the available feature types. Options are country, region, postcode, district, place, locality, neighborhood, address, and poi. Multiple options can be comma-separated. Note that poi.landmark is a deprecated type that, while still supported, returns the same data as is returned using the poi type.
}
%%
 
%%
Response: Reverse geocoding
%%
 
%%
"https://api.mapbox.com/geocoding/v5/mapbox.places/dallas.json?limit=10&access_token=pk.eyJ1IjoiYXlvdWIyMjExIiwiYSI6ImNsM3o2ZW9zazBiM2QzanF5bTZjd28yOHUifQ.eACDmee3G8odpafGu-yi9Q"
*/

let citytolotlat = {
    "access_token_geo": "pk.eyJ1IjoiYXlvdWIyMjExIiwiYSI6ImNsM3o2ZW9zazBiM2QzanF5bTZjd28yOHUifQ.eACDmee3G8odpafGu-yi9Q",
    "limitresult": "10",
    "language": "en,ar",
    fetchgeocoding: function (place) {
        fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"
            + place
            + ".json?limit="
            + this.limitresult
            + "&language="
            + this.language
            + "&access_token="
            + this.access_token_geo
        )
            .then((response) => response.json())
            //.then((data) => console.log(data))
            .then((data) => this.tolotlat(data));
    },

    tolotlat: function (data) {
        const { features } = data
        //const { place_name } = data.features[0];
        //
        //document.querySelector(".city").innerText = "Weather in " + place_name;
        //console.log(data, place_name, coordinates);

        var arrlon = [];
        var arrlat = [];
        var arrplace = [];
        i = 0;
        j = 0;
        k = 0;
        $.each(features, function (index, value) {
            let { place_name } = value
            let { coordinates } = value.geometry; //[longitude , lattitude]
            //console.log(/*place_name,*/ coordinates);
            arrlon[i++] = coordinates[0];
            //console.log(arrlon);
            arrlat[j++] = coordinates[1];
            //console.log(arrlat);
            arrplace[k++] = place_name;
            //console.log(arrplace);
            let new_a_el = document.createElement("a");
            new_a_el.className = "text_overlaysearch";
            new_a_el.innerText = place_name;
            aIdName = index;
            new_a_el.setAttribute("id", aIdName);
            $(".overlay_search").append(new_a_el);
            $(new_a_el).attr("href", "#");
            $(new_a_el).attr("onclick", "overlaysearch_onclick("
                + arrlat[$(new_a_el).attr('id')]
                + ","
                + arrlon[$(new_a_el).attr('id')]
                + "); return false");


            /*
                        weatherlatlong.fetchWeatherlatlong("
                            + arrlat[$(new_a_el).attr('id')]
                            + ","
                            + arrlon[$(new_a_el).attr('id')]
                            + "); return false");
 
                            $(new_a_el).attr("onclick", "overlaysearch_onclick_citytext("
                + arrplace[$(new_a_el).attr('id')]
                + "); return false");
 
                            */
        });

        //javascript forEach
        /*
       features.forEach((array, index) => {
           let { place_name } = array
           let { coordinates } = array.geometry; //[longitude , lattitude]
           //console.log(place_name, coordinates);
 
           newdiv = document.createElement("div");
           divIdName = 'search_item' + index;
           newdiv.setAttribute('id', divIdName);
           newdiv.innerHTML = '<div>Testing 123</div>';
           document.getElementsByClassName("overlay_search").appendChild(newdiv);
 
 
           //let node = document.createTextNode(place_name);
           //newdiv.appendChild(node);
           //newdiv.className = text_overlaysearch
 
           //over.appendChild(newdiv);
       });
       */
    }
}

function overlaysearch_onclick(lat, lon) {
    weatherlatlong.fetchWeatherlatlong(lat, lon);
}


//https://api.mapbox.com/geocoding/v5/{endpoint}/{longitude},{latitude}.json
let lotlattocity = {
    "access_token_geo": "pk.eyJ1IjoiYXlvdWIyMjExIiwiYSI6ImNsM3o2ZW9zazBiM2QzanF5bTZjd28yOHUifQ.eACDmee3G8odpafGu-yi9Q",
    "typeofresult": "place",
    fetchreversegeo: function (long, lat) {
        fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"
            + long
            + ","
            + lat
            + ".json?types="
            + this.typeofresult
            + "&access_token="
            + this.access_token_geo
        )
            .then((response) => response.json())
            //.then((data) => console.log(data))
            .then((data) => this.tocity(data));
    },

    tocity: function (data) {
        const { features } = data
        const { place_name } = data.features[0];
        //
        document.querySelector(".city").innerText = "Weather in " + place_name;
    }
}

// jQuery Event Handler
$(function () {
    $(".weather, .overlay_search, .search-bar").click(function () {
        $(".overlay_search").hide();
        $(".overlay_search").empty();
    });

    $(".search_button").click(function () {
        if ($(".overlay_search").css("display") == "none") {
            $(".overlay_search").css("display", "block");
            citytolotlat.fetchgeocoding(document.querySelector(".search-bar").value);
        }
        else {
            $(".overlay_search").css("display", "none");
            $(".overlay_search").empty();
        }
    });

    $(".search-bar").keyup(function (event) {
        if (event.key == "Enter") {
            $(".overlay_search").show();
            citytolotlat.fetchgeocoding(document.querySelector(".search-bar").value);
            //weather.search();
        };
    });
})

/* Reverse geocoding
https://openweathermap.org/api/geocoding-api

http://api.openweathermap.org/geo/1.0/reverse?lat=51.5098&lon=-0.1180&limit=5&appid={API key}
*/

/* JS Event Handler
document.querySelector(".weather").addEventListener("click", function () {
    overlay_off();
});

document.querySelector(".overlay_search").addEventListener("click", function () {
    overlay_off();
});

document.querySelector(".search_button").addEventListener("click", function () {
    overlay_on();
    weather.search();
    citytolotlat.fetchgeocoding(document.querySelector(".search-bar").value);
});


document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        overlay_on();
        weather.search();
        citytolotlat.fetchgeocoding(document.querySelector(".search-bar").value);
    }
});

function overlay_on() {
    document.querySelector(".overlay_search").style.display = "block";
}
function overlay_toggle() {
    document.querySelector(".overlay_search").classList.toggle("show");
}

function overlay_off() {
    document.querySelector(".overlay_search").style.display = "none";
}
*/
