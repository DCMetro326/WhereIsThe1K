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

                    const formattedTime = formatLocalTime(item.LocalTime);

                    resultDiv.innerHTML = `
                        🚆 Car <b>1000</b> found!<br><br>
                        Location Name: <b>${locationName}</b><br>
                        Location ID: <b>${locationID}</b><br>
                        Last Moved: <b>${formattedTime}</b>
                    `;

                    return;
                }
            }
        }

        resultDiv.textContent = "Car 1000 not currently reported.";

    } catch (error) {

        console.error(error);
        resultDiv.textContent = "Error loading WMATA data.";

    }
}


/* Convert WMATA LocalTime to readable format */
function formatLocalTime(timeString) {

    if (!timeString) return "Unknown";

    const date = new Date(timeString);

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    const monthNames = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const daySuffix = getOrdinalSuffix(day);

    return `${hour12}:${minutes} ${ampm}, ${month} ${day}${daySuffix}, ${year}`;
}


/* Add st / nd / rd / th */
function getOrdinalSuffix(day) {

    if (day > 3 && day < 21) return "th";

    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}


// Run when page loads
find1K();

// Refresh every 30 seconds
setInterval(find1K, 30000);
