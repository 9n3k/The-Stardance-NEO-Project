const CRTICIALAPI_TOKEN = "JWHcdmNX4BmlDhnKtyZhz4dsctCAKPNumAhNHEIb";

const calendarDateStamp = new Date().toISOString().split('T')[0];
const targetAPIEndpoint = `https://nasa.gov{calendarDateStamp}&end_date=${calendarDateStamp}&api_key=${CRTICIALAPI_TOKEN}`;

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
        comparisonText = `Estimated size: $(sizeMeters.toFixed(1)} meters.). Roughly comparable to a **standard commercial passenger plane**. Highly unlikely to puncture our atmosphere.`;
    } else if (sizeMeters >= 50 && sizeMeters < 200) {
        comparisonText = `Estimated size: ${sizeMeters.toFixed(1)} meters. Comparable to the **Big Ben Clock Tower** or an entire sports stadium block. Structural planetary hazard vector.`;
    } else {
        comparisonText = `Estimated size: ${sizeMeters.toFixed(1)} meters. Massive Scale! This object is matching or scalling past the **Eiffel Tower**. Severe planetary tracking footprint.`;
    }

    document.getElementById("modal-size-text").innerHTML = comparisonText;
    popup.classList.remove("hidden");

}

// Filtering for input and sorting control (logic)

function attachControlEventHandlers() {
    const searchField = document.getElementById("search-input");
    const sortField = document.getElementById("sort-select");

    function executeFilterProcessing() {
        let textQuery = searchField.value.toLowerCase().trim();
        let activeSortRule = sortField.value;

     // ffa
    if (activeSortRule === "size") {
        modifiedSet.sort((a,b) => b.estimated_diameter.meters.estimated_diameter_max - a.estimated_diameter.meters.estimated_diameter_max);
    } else if (activeSortRule === "speed") {
        modifiedSet.sort((a,b) => parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour) - parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour));
    }else if (activeSortRule === "distance") {
        modifiedSet.sort((a,b) => parseFloat(a.close_approach_data[0].miss_distance.kilometers) - parseFloat(b.close_approach_data[0].miss_distance.kilometers));
    }

    refreshInterfaceDisplay(modifiedSet);

    }
    searchField.addEventListener('input', executeFilterProcessing);
    sortField.addEventListener('change', executeFilterProcessing);

    document.getElementById("close-modal-btn").addEventListener('click', () => {
        document.getElementById("scale-modal").classList.add("hidden");
    })
}

function launchSpaceGame() {
    alert("Initializing Asteroid Defense Game System...");
}

document.addEventListener("DOMContentLoaded", () => {
    const gameBtn = document.getElementById("launch-game-btn");
    if (gameBtn) {
        gameBtn.addEventListener("click", launchSpaceGame);
    }
});
