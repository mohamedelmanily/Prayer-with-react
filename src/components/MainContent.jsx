import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import MenuItem from "@mui/material/MenuItem";
import img1 from "../images/fajr-prayer.png";
import img2 from "../images/dhhr-prayer-mosque.png";
import img3 from "../images/asr-prayer-mosque.png";
import img4 from "../images/sunset-prayer-mosque.png";
import img5 from "../images/night-prayer-mosque.png";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useEffect, useState } from "react";
import StyledDivider from "./divider";

export default function MainContent() {
  const AvailableCities = [
    {
      displayName: "القاهرة",
      apiName: "cairo",
    },
    {
      displayName: "الاسكندرية",
      apiName: "alexandria",
    },
    {
      displayName: "المنصورة",
      apiName: "mansoura",
    },
    {
      displayName: "المحلة",
      apiName: "mahlla",
    },
    {
      displayName: "قنا",
      apiName: "qena",
    },
    {
      displayName: "أسوان",
      apiName: "aswan",
    },
  ];
  const [currentDate, setCurrentDate] = useState("");

  const [timing, setTiming] = useState({
    Asr: "16:28",
    Dhuhr: "12:51",
    Fajr: "04:26",
    Isha: "21:05",
    Maghrib: "19:38",
  });
  const [city, setCity] = useState({
    displayName: "القاهرة",
    apiName: "cairo",
  });
  function handleCityChange(event) {
    setCity(AvailableCities.find((e) => e.apiName == event.target.value));
  }
  async function getTiming() {
    try {
      let response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity/10-05-2024?country=egypt&city=${city.apiName}`
      );
      setTiming(response.data.data.timings);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching prayer timings:", error);
      // Handle error gracefully, e.g., display an error message
    }
  }


// تحويل الوقت من الصيغة HH:MM إلى دقائق
function timeToMinutes(time) {
  const [hours, minutes] = time.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

// تحويل الدقائق إلى الصيغة HH:MM
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours < 10 ? "0" : ""}${hours}:${mins < 10 ? "0" : ""}${mins}`;
}

// الحصول على الوقت الحالي بالدقائق
const now = new Date();
const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

// أوقات الصلاة بالدقائق
const prayerTimesInMinutes = {
  Fajr: timeToMinutes(timing.Fajr),
  Dhuhr: timeToMinutes(timing.Dhuhr),
  Asr: timeToMinutes(timing.Asr),
  Maghrib: timeToMinutes(timing.Maghrib),
  Isha: timeToMinutes(timing.Isha),
};

// العثور على الصلاة القادمة
const [pray,setnextpray]=useState('')
const [pTime,setPtime]=useState('')
let nextPrayerTime = null;
function getNextPray(){

  
  for (const [prayer, time] of Object.entries(prayerTimesInMinutes)) {
    if (time > currentTimeInMinutes) {
      setnextpray ( prayer)
      nextPrayerTime = time;
      break;
    }
  }
  
  // حساب الوقت المتبقي حتى الصلاة القادمة
  const remainingTime = nextPrayerTime - currentTimeInMinutes;
  
  // تحويل الوقت المتبقي إلى الصيغة HH:MM
  const remainingTimeInHHMM = minutesToTime(remainingTime);
  setPtime(remainingTimeInHHMM)
  console.log(`الوقت المتبقي حتى صلاة ${pray}: ${pTime}`);
  setTimeout(getNextPray, 60000)
  
}

  useEffect(() => {

    const updateDate = () => {
      const date = new Date();
      const formattedDate = `${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()} | ${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
      setCurrentDate(formattedDate);
      setTimeout(updateDate, 60000); // Update the date every minute (60000 milliseconds)
    };
    getNextPray()
    getTiming();
    updateDate(); // Initial update
  }, [city, currentDate,pTime]);

  function returning(p){
    if(p=='Fajr'){
      return 'الفجر'
    }
    if(p=='Dhuhr'){
      return 'الظهر'
    }
    if(p=='Asr'){
      return 'العصر'
    }
    if(p=='Maghrib'){
      return 'المغرب'
    }
    if(p=='Isha'){
      return 'العشاء'
    }
  }
  return (
    <>
      <Box sx={{ fontSize: "24px", fontWeight: "500", marginBottom: "40px" }}>
        ﴿وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِنَ اللَّيْلِ إِنَّ
        الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ ذَلِكَ ذِكْرَى لِلذَّاكِرِينَ﴾
      </Box>
      <StyledDivider width="40%" />
      <StyledDivider width="20%" marginTop="5px" />
      <StyledDivider width="10%" marginTop="5px" />
      <Grid container spacing={2} style={{ fontWeight: "900" }}>
        <Grid xs={6}>
          <h2 > {currentDate}</h2>
          <h1>{city.displayName}</h1>
        </Grid>
        <Grid xs={6}>
          <h2> متبقي حتي صلاة {returning(pray)}</h2>
          <h1>{pTime}</h1>
        </Grid>
      </Grid>
      <Divider
        style={{
          borderColor: "white",
          opacity: ".1",
        }}
      />

      <Stack
        direction="row"
        gap={"15px"}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        <Prayer name={"الفجر"} time={timing.Fajr} src={img1} />
        <Prayer name={"الظهر"} time={timing.Dhuhr} src={img2} />
        <Prayer name={"العصر"} time={timing.Asr} src={img3} />
        <Prayer name={"المغرب"} time={timing.Maghrib} src={img4} />
        <Prayer name={"العشاء"} time={timing.Isha} src={img5} />
      </Stack>

      <Stack>
        <Box sx={{ minWidth: 120, color: "white" }}>
          <FormControl
            sx={{
              width: "200px",
              marginTop: "20px",
              backgroundColor: "#fff",
              borderRadius: "5px",
            }}
          >
            <InputLabel
              style={{ color: "white", fontWeight: "600", fontSize: "22px" }}
              id="demo-simple-select-label"
            >
              المدينة
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="المدينة"
              style={{ color: "white", fontSize: "22px", fontWeight: "700" }}
              onChange={handleCityChange}
            >
              {AvailableCities.map((city) => {
                return (
                  <MenuItem value={city.apiName} key={city.apiName}>
                    {city.displayName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </>
  );
}
