// import {GetuiGy} from "./dist/src";
const GetuiGy = require('./dist/src').GetuiGy;

const APP_ID = '';
const APP_SECRET = '';
const APP_KEY = '';
const MASTER_SECRET = '';
const option = {
  appId: APP_ID,
  appSecret: APP_SECRET,
  appKey: APP_KEY,
  masterSecret: MASTER_SECRET,
};

const getuiGy = new GetuiGy(option);

(async function () {
  try {
    const result = await getuiGy.verifyQuery("0e10cc6ec7e544e7abd5e81cbffac9f030", "GY-20190702-0-FDkD1eLf3DA8ZVQLgOh4A4");
    result;
  } catch (e) {
    console.error(e);
  }
})();
