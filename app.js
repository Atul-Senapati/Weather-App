const userTab = document.querySelector(" [data-userWeather]");
const searchTab = document.querySelector(" [data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();  //set initial to default location

 




function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //search form invisisble? make it visisble
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
       }
       else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage(); 
       }
    }
}

userTab.addEventListener("click",() =>{
    switchTab(userTab);
});

searchTab.addEventListener("click" ,() =>{
    switchTab(searchTab);
})

//ckeck if coordinates are already present in sessioin storage
function getfromSessionStorage(){
    const localCoord=sessionStorage.getItem("user-coordinates");

    if(!localCoord){
        //they are absent
        grantAccessContainer.classList.add("add");
    }
    else{
         const coordinates=JSON.parse(localCoord);
         fetchUserWheatherInfo(coordinates);
    }
}

async function fetchUserWheatherInfo(coordinates){
    const{lat,lon}=coordinates;
    //make grantcointainer invisibbe
    grantAccessContainer.classList.remove("active");
    //make loader visisble
    loadingScreen.classList.add("active");

    //api call
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` );

        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeather(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': '2f0df0ba92msh7e376fb723cc0a9p176ca5jsna483f9a6b1f9',
// 		'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
// 	}
// };

// fetch('https://open-weather13.p.rapidapi.com/city/landon', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));

function renderWeather(weatherInfo){
    //fetch from api
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const weatherDesc=document.querySelector("[data-temp]")
    const temp=document.querySelector("[data-temp]")
    const windSpeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innertext=weatherInfo?.name;
  // countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  countryIcon.src= ` https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/css/flag-icons.min.css`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windSpeed.innertext = weatherInfo?.wind?.speed;
    humidity.innertext = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
    // temp.innerText=weatherInfo?.main?.

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        x.innerHTML="geoloaction is not available";
    }
}
function showPosition(position){
   
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton =document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" ,getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e) =>{
    e.preventDefault();
    let cityNme=searchInput.value;
    if(cityNme=="")
    return;
    else 
     fetchUserWheatherInfo(cityNme);


});

async function fetchUserWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeather(data);

    }
    catch{
            x.innerText=" info not available to the desired location";
    }
}
