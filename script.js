async function find1K() {

    const resultDiv = document.getElementById("result");

    try {

        const response = await fetch(
            "https://gis.wmata.com/proxy/proxy.ashx?https://gispro.wmata.com/RpmSpecialTrains/api/SpcialTrain"
        );

        const raw = await response.text();
        const data = JSON.parse(raw);

        const consists =
            data?.DataTable?.["diffgr:diffgram"]?.DocumentElement?.CurrentConsists;

        if (!consists) {
            resultDiv.textContent = "No data found.";
            return;
        }

        for (const item of consists) {

            const cars = item.Cars?.trim();
            if (!cars) continue;

            const segments = cars.split(".");

            for (const seg of segments) {

                if (seg.includes("1000")) {

                    const locationName = item.LocationName || "Unknown";
                    const locationID = item.LocationID || "Unknown";
                    const trackNum = item.TrackName || "Unknown";

                    const formattedTime = formatLocalTime(item.LocalTime);

                    resultDiv.innerHTML = `
                        The 1K is currently at <b>${locationID} ${locationName}</b> on <b> Track ${trackNum}</b><br>
                        It was last moved at <b>${formattedTime}</b>
                    `;

                    return;
                }
            }
        }

        resultDiv.textContent = "1000-1001 has been Scrapped. (RIP)";

    } catch (error) {

        console.error(error);
        resultDiv.textContent = "Error";

    }
}


function formatLocalTime(timeString) {

    if (!timeString) return "Unknown";

    const date = new Date(timeString);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = (hours % 12 || 12) -1;

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const daySuffix = getOrdinalSuffix(day);

    return `${hour12}:${minutes} ${ampm} on ${month} ${day}${daySuffix}, ${year}`;
}

function getOrdinalSuffix(day) {
    
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}


find1K();
