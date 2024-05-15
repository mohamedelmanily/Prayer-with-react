 // تحويل الوقت من الصيغة HH:MM إلى دقائق
 function timeToMinutes(time) {
    const [hours, minutes] = time.split(":");
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
  }

  // تحويل الدقائق إلى الصيغة HH:MM
  function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours < 10 ? "0" : ""}${hours}:${mins < 10 ? "0" : ""}${mins}:00`;
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
  const [pray, setnextpray] = useState("");
  const [pTime, setPtime] = useState("");
  let nextPrayerTime = null;
  // العثور على الصلاة القادمة
  function getNextPray() {
    for (const [prayer, time] of Object.entries(prayerTimesInMinutes)) {
      if (time > currentTimeInMinutes) {
        if (prayer == "fajr") {
          console.log("ok");
        }
        setnextpray(prayer);
        nextPrayerTime = time;
        break;
      }
    }

    // حساب الوقت المتبقي حتى الصلاة القادمة
    const remainingTime = nextPrayerTime - currentTimeInMinutes;

    // تحويل الوقت المتبقي إلى الصيغة HH:MM
    const remainingTimeInHHMM = minutesToTime(remainingTime);
    setPtime(remainingTimeInHHMM);
    // console.log(`الوقت المتبقي حتى صلاة ${pray}: ${pTime}`);
    setTimeout(getNextPray, 60000);
  }
