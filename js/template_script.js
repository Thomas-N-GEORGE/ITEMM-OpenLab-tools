/**
 * This is the specific script file for the TEMPLATE tool
 *
 * Here we basically define constants and fiels according to HTML ids.
 * (If ever some constants need to be reset, please do it here)
 *
 * All the calculation functions match the original Google sheet charts.
 * A global calcChart() function calls them all IN THE RIGHT ORDER.
 * 
 * Under the calculation section, at the end of this script, we have our
 * Event Listener  : 
 * every time we validate the inputs in HTML : 
 *    data is fetched, 
 *    calculations are called,
 *    updated data is displayed
 *   
 */

// ===== Numerical defined constants =====
const numConstants = {};

// ===== Data fields in flexion_3_points tool =====
const fields = [
    "edge",
    "volm4",
    "volcm4"
];

// (no conflict mode in jQuery loaded in olt_functions.js)

// don't do anything until page is loaded :
$j(document).ready(function () {
  //************************
  //***** Calculations *****
  //************************
  // ( !!! RESPECT CALCULATION FUNCTION ORDER CALLING !!!...)

  function calcVolm4(data) {
    data.volm4 = Math.pow(data.edge, 4);
  }

  function calcVolcm4(data) {
    data.volcm4 = Math.pow(data.edge * 100, 4);
  }

  // global
  function calcChart(data) {
    calcVolm4(data);
    calcVolcm4(data);
  }

  //************************************
  //***** starting point of script *****
  //************************************

  // script call debug check
  console.log("it's working !");

  // create a new olt object for our tool
  const template = new olt(numConstants, fields);

  // We fetch default values
  template.retrieveData();

  //****************************
  //***** EVENT LISTENER *******
  //***** tool interaction *****
  //****************************

  // Form submission in HTML :
  // We refresh I/O data, do calculations
  $j("form").submit((e) => {
    // prevent the refreshing of page by browser
    e.preventDefault();

    // debug check
    console.log("template.domElements : ", template.domElements);

    // warning messages cleanup in page
    template.removeBadInputWarnings();

    // we retrieve user data input from page;
    template.retrieveData();
    // debug check
    console.log("template.data", template.data);

    // we do the calulations
    calcChart(template.data);

    // we display the output data
    template.displayOutput();
  });
});
