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

                    resultDiv.innerHTML = `
                        🚆 Car <b>1000</b> found!<br><br>
                        Location Name: <b>${locationName}</b><br>
                        Location ID: <b>${locationID}</b>
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

// Run immediately when page loads
find1K();

// Refresh every 30 seconds
setInterval(find1K, 30000);
