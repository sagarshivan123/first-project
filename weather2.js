const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantaccesscontainer=document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");


let oldTab = userTab;
const API_KEY= "da0aa4a41b4871637b58925446e802ef";
oldTab.classList.add("current-tab");
getfromSessionStorage();
// 

function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehle search wale tab pe tha,ab your weather tab pe jana hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab mai your weather tab pe hoon,to weather bhi display karna padega,so lets check local storage first
            //for coordinates,if we gave saved them there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
     switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
     switchTab(searchTab);
});

//check if coordinates are already present in session storage
//if not,then ask for permission to access location
//if yes,then fetch the weather info
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantaccesscontainer.classList.add("active");
    }
    else{
       const coordinates=JSON.parse(localCoordinates);
       fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    console.log("lat:",lat);
    console.log("lon:",lon);
    //makes grantcontainer invisible`1
    grantaccesscontainer.classList.remove("active");
    //makes loading screen visible
    loadingScreen.classList.add("active");

    //api call
    try{
      const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      console.log("res:",res);
      const data= await res.json();
      console.log("data:",data);
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
      
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log(err);
        alert("Unable to fetch weather data"); 
        grantaccesscontainer.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temperature]");
    const windSpeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);   
}

const grantaccessButton=document.querySelector("[data-grantAccess]");
grantaccessButton.addEventListener("click",getlocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="") return;
    else
    fetchSearchWeatherInfo(cityName);

})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        console.log("data:",data);
    } 
    catch (err) {
        //hw
    }
}