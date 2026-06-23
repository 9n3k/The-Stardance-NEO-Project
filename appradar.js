const CRTICIALAPI_TOKEN = "JWHcdmNX4BmlDhnKtyZhz4dsctCAKPNumAhNHEIb";

const calendarDateStamp = new Date().toISOString().split('T')[0];
const targetAPIEndpoint = `https://nasa.gov{calendarDateStamp}}&end_date=${calendarDateStamp}&api_key=${CRTICIALAPI_TOKEN}`;

let Asteroidslist = [];

async function RadarScanner() {
    try {
        const streamData = await fetch (targetAPIEndpoint);
        const structurePayload = await streamData.json();

        masterAsteroidList = structurePayload.near_earth_objects[calendarDateStamp] || [];

        refreshInterfaceDisplay(Asteroidslist);
        calculateHighLevelThreats(Asteroidslist);
        attachControlEventHandlers();
    } catch (faultTrace) {
        console.error("Telemetry structural failure: ", faultTrace);
        document.getElementById("asteroid-rows"),innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">SCANNER OFFLINE: Connection timed out. </td></tr>`;
    }
}

// engine

function refreshInterfaceDisplay(worokingSet) {
    const dataContainerBody = document.getElementById("asteroid-rows");
    dataContainerBody.innerHTML = "";

    if (worokingSet.length == 0 ) {
        dataContainerBody.innerHTML = `<tr><td colspan="5" style = "text-align:center;">No tracking matrix matches filters.</td></tr>`;
        return;
    }

    worokingSet.forEach(rock => {
        const cleanTitle = rock.name.replace(/[\(/)]/g, '');
        const sizeMax = parseFloat (rock.estimated_diamter.meters.estimated_diameter_max);

        // Safely extract from first approach array index
        const speedKpH = parseFloat(rock.close_approach_data[0].relative_velocity.kilometers_per_hour);
        const missDistance = parseFloat(rock.close_approach_data[0].miss_distance.kilometers);
        const threatState = rock.is_potentially_hazardous_asteroid;

        const dynamicRow = document.createElement("tr");
        dynamicRoww.innerHTML = `
        <td><strong>$(cleanTitle)</strong></td>
        <td>${sizeMax.toFixed(1)} m</td>
        <td>${Math.floor(speedKpH).toLocaleString()} km/h</td>
        <td>${Math.floor(missDistance).toLocaleString()} km</td>
        <td class="${threatState ? 'danger-text' :'safe=text'}">${threatState ? '⚠️ HAZARDOUS' : '✅ SECURE'}</td> "
    `;

    dynamicRow.rowIndex.addEventListener('click', () => launchComparisonModal(cleanTitle, sizeMax));
    dataContainerBody.appendChild(dynamicRow);
    });
}

// Calcylate counters and emergy warnings

function calculateHighLevelThreats(fullList) {
    let  warningCount = 0;
    let  hazardNames= [];

    fullList.forEach(item => {
        if(item.is_potentially_hazardous_asteroid) {
            warningCount++;
            hazardNames.push(item.namae.replace(/[\(/)]/g, ''));
        }
    });

    document.getElementById("stat-total").innerText = fullList.length;
    document.getElementById("stat-hazards").innerText = warningCount;

    const alertBox = document.getElementById("hazard-alert-box");
    if (warningCount > 0) {
        alertBox.classList.remove("hidden");
        document.getElementById("hazard-text").innerText = `${warningCount} cosmic objects flagged as hazards inbound today. Target trajectories: ${hazardNames.join(',')}.`;
    } else {
        alertBox.classList.add("hidden");
    }
}

// customisation

function launchComparisonModal(name, sizeMeters) {
    const popup = document.getElementById("scale-modal");
    document.getElementById("modal-title").innerText = `Scale Profile: Object ${name}`;
    
    let comparisonText ="";
    if (sizeMeters < 50) {
        comparisonText = `Estimated size: $(sizeMeters.toFixed(1)} meters.)`
    }

}
