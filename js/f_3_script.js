/**
 * This is the specific script file for the FLEXION 3 POINTS tool
 *
 * Here we basically define constants and fiels according to HTML ids.
 * (If ever some constants need to be reset, please do it here)
 *
 * All the calculation functions match the original Google sheet charts.
 * A global calcChart() function calls them all IN THE RIGHT ORDER.
 *
 * After the calculation section, where the script starts,
 * we initialize an olt object to be manipulated when loading the page
 * and inside our Event Listener  :
 * every time we validate the inputs in HTML :
 *    data is fetched,
 *    calculations are called,
 *    updated data is displayed
 *
 */

// ===== We define our local storage key =====
const userStorage = "oltF3PUserData";

// ===== Numerical defined constants =====
const numConstants = {};

// ===== Data fields in flexion_3_points tool =====
const fields = [
  "base",
  "haut",
  "l2app",
  "ltot",
  "mcen",
  "dep",
  "mpou",
  "dboi",
  "vol",
  "volcm3",
  "momq",
  "fapp",
  "myouc",
  "mspec",
];

// (no conflict mode in jQuery loaded in olt_functions.js)

// don't do anything until page is loaded :
$j(document).ready(function () {
  //************************
  //***** Calculations *****
  //************************
  // ( !!! RESPECT CALCULATION FUNCTION ORDER CALLING !!!...)

  function calcVol(data) {
    data.vol = data.ltot * data.base * data.haut;
  }

  function calcVolcm3(data) {
    data.volcm3 = 1000000 * data.ltot * data.base * data.haut;
  }

  function calcDBois(data) {
    data.dboi = data.mpou / data.vol / 1000;
  }

  function calcMomq(data) {
    data.momq = (data.base * Math.pow(data.haut, 3)) / 12;
  }

  function calcFapp(data) {
    data.fapp = data.mcen * 9.81;
  }

  function calcMyouc(data) {
    // =(C17*C8*C8*C8)/(48*C11*C16)/1000000000
    data.myouc =
      (data.fapp * Math.pow(data.l2app, 3)) /
      (48 * data.dep * data.momq) /
      1000000000;
  }

  function calcMspec(data) {
    data.mspec = data.myouc / data.dboi;
  }

  // global
  function calcChart(data) {
    calcVol(data);
    calcVolcm3(data);
    calcDBois(data);
    calcMomq(data);
    calcFapp(data);
    calcMyouc(data);
    calcMspec(data);
  }

  //************************************
  //***** starting point of script *****
  //************************************

  // script call debug check
  console.log("it's working !");

  // we create a new olt object for our tool
  const f3points = new olt(numConstants, fields, userStorage);

  // and we load our page
  f3points.loadPage();

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
    console.log("f3points.domElements : ", f3points.domElements);

    // warning messages cleanup in page
    f3points.removeBadInputWarnings();

    // we retrieve user data input from page while checking it is correct;
    if (f3points.retrieveData()) {
      // debug check
      console.log("f3points.data", f3points.data);

      // we do the calulations
      calcChart(f3points.data);

      // we try to render our calculations on page
      f3points.render();
    }
  });
});
