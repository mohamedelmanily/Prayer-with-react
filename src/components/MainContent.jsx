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
import moment from "moment";
import "moment/dist/locale/ar";

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
  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
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
  const [prayerIndex, setPrayerIndex] = useState(0);
  const [remainTime, setRemainTime] = useState("");
  function handleCityChange(event) {
    setCity(AvailableCities.find((e) => e.apiName == event.target.value));
  }
  async function getTiming() {
    try {
      let response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity/10-05-2024?country=egypt&city=${city.apiName}`
      );
      setTiming(response.data.data.timings);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching prayer timings:", error);
      // Handle error gracefully, e.g., display an error message
    }
  }

  useEffect(() => {
    getTiming();

    const updateDate = () => {
      setCurrentDate(moment().format(" Do MMMM YYYY || h:mm:ss a"));
    };

    setInterval(updateDate, 1000);
    const intervalId = setInterval(() => {
      CalcRemainingTime();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [city]);

  function CalcRemainingTime() {
    const currentTime = moment();
    const fajrTime = moment(timing["Fajr"], " hh:mm");
    const duhrTime = moment(timing["Dhuhr"], " hh:mm");
    const asrTime = moment(timing["Asr"], " hh:mm");
    const maghribTime = moment(timing["Maghrib"], " hh:mm");
    const ishaTime = moment(timing["Isha"], " hh:mm");

    let nextPrayerIndex = null;
    if (moment(currentTime).isBetween(fajrTime, duhrTime)) {
      console.log("duhr is next");
      nextPrayerIndex = 1;
    } else if (moment(currentTime).isBetween(duhrTime, asrTime)) {
      console.log("asr is next");
      nextPrayerIndex = 2;
    } else if (moment(currentTime).isBetween(asrTime, maghribTime)) {
      console.log("maghrib is next");
      nextPrayerIndex = 3;
    } else if (moment(currentTime).isBetween(maghribTime, ishaTime)) {
      console.log("isha is next");
      nextPrayerIndex = 4;
    } else {
      console.log("fajr is next");
      nextPrayerIndex = 0;
    }
    setPrayerIndex(nextPrayerIndex);
    //handling remaining time by prayer index
    const nextPrayerObject = prayersArray[nextPrayerIndex];
    const nextPrayerTime = timing[nextPrayerObject.key];

    let remaingTime = moment(nextPrayerTime, "hh:mm").diff(currentTime);

    if(remaingTime<0){
      const midNightDiff=moment('23:59:59','hh:mm:ss').diff(currentTime)
      const fajrMidDiff=moment(nextPrayerTime,'hh:mm:ss').diff(moment('00:00:00','hh:mm:ss'))
    remaingTime=midNightDiff+fajrMidDiff
    }

    const ReadableRemaingTime = moment.duration(remaingTime);
    const x = `${
      ReadableRemaingTime.hours() < 10 ? "0" : ""
    }${ReadableRemaingTime.hours()}:${
      ReadableRemaingTime.minutes() < 10 ? "0" : ""
    }${ReadableRemaingTime.minutes()}:${
      ReadableRemaingTime.seconds() < 10 ? "0" : ""
    }${ReadableRemaingTime.seconds()}`;

    console.log(
      ReadableRemaingTime.hours(),
      ReadableRemaingTime.minutes(),
      ReadableRemaingTime.seconds()
    );
    setRemainTime(x)
  }

  return (
    <>
      <Box
        sx={{
          fontSize: "24px",
          fontWeight: "500",
          marginBottom: "40px",
          textShadow: "0 0 10px white",
        }}
      >
        ﴿وَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِنَ اللَّيْلِ إِنَّ
        الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ ذَلِكَ ذِكْرَى لِلذَّاكِرِينَ﴾
      </Box>
      <StyledDivider width="40%" />
      <StyledDivider width="20%" marginTop="5px" />
      <StyledDivider width="10%" marginTop="5px" />
      <Grid container spacing={2} style={{ fontWeight: "900" }}>
        <Grid xs={6}>
          <h2> {currentDate}</h2>
          <h1>{city.displayName}</h1>
        </Grid>
        <Grid xs={6}>
          <h2>متبقي حتي صلاة {prayersArray[prayerIndex].displayName}</h2>
          <h1>{remainTime}</h1>
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
