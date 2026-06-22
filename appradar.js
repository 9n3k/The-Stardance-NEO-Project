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