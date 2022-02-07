const express = require("express");
const fs = require("fs");
var fsPath = require("fs-path");
const app = express();
const https = require("https");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var bodyParser = require("body-parser");
var XBLTicket = require("./wdf/ticket.json");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());
var prodwsurl = "https://prod.just-dance.com";
var room = "HardMainJD2021";
var sessions = require("./files/sessions.json");
var entities = require("./files/entities.json");
var entitiesphone = require("./files/entities-phone.json");
var configuration = require("./files/configuration.json");
var party = require("./files/party.json");
var upsellvideos = require("./files/upsellvideos.json");
var skuconstants = require("./files/skuconstants.json");
var items = require("./files/items.json");
var blocks = require("./files/blocks.json");
var mine = require("./files/mine.json");
var skupackages = require("./files/skupackages.json");
var profiles = require("./files/profiles.json");
var quests = require("./files/quests.json");
var songs = require("./files/songs.json");
var news = require("./files/news.json");
var sweat = require("./files/sweat.json");
var onlinequest = require("./files/onlinequest.json");
var playlist = require("./files/playlist.json");
var coop = require("./files/coop.json");
var bosses = require("./files/bosses.json");
var indexhtml = require("./index.html");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.post("/carousel/v2/pages/partycoop", (req, res) => {
  res.send(coop);
});

app.post("/carousel/v2/pages/quests", (req, res) => {
  res.send(onlinequest);
});

app.post("/carousel/v2/pages/create-playlist", (req, res) => {
  res.send(playlist);
});

app.post("/carousel/v2/pages/sweat", (req, res) => {
  res.send(sweat);
});

app.post("/v3/profiles/sessions", (req, res) => {
  var xhr = new XMLHttpRequest();
  var ticket = req.header("Authorization");
  var appid = req.header("Ubi-AppId");
  xhr.open(
    "POST",
    "https://public-ubiservices.ubi.com/v3/profiles/sessions",
    false
  );
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Ubi-AppId", appid);
  xhr.setRequestHeader("Authorization", ticket);
  xhr.send();
  res.send(xhr.responseText);
});

app.get(
  "/v2/spaces/f1ae5b84-db7c-481e-9867-861cf1852dc8/entities",
  (req, res) => {
    res.send(entities);
  }
);

app.get(
  "/v2/spaces/e9116be2-587b-4c95-8eb7-ef8a1908b8fc/entities",
  (req, res) => {
    res.send(entitiesphone);
  }
);

app.get(
  "/v1/applications/341789d4-b41f-4f40-ac79-e2bc4c94ead4/configuration",
  (req, res) => {
    res.send(configuration);
  }
);

app.get(
  "/v1/applications/210da0fb-d6a5-4ed1-9808-01e86f0de7fb/configuration",
  (req, res) => {
    res.send(configuration);
  }
);

app.post("/carousel/v2/packages", (req, res) => {
  res.send({
    __class: "PackageIds",
    packageIds: ["bannerOverride", "transitionOverride"]
  });
});

app.post("/subscription/v1/refresh", (req, res) => {
  res.send({
    validity: true,
    errorCode: "",
    timeLeft: 99999999,
    expiryTimeStamp: "1701005135000",
    platformId: "eba79f49-64e7-468a-9d15-d34ffe68e1ff",
    trialActivated: false,
    consoleHasTrial: true,
	"soppurtpupo": "fuck",
    trialTimeLeft: 99999999,
    trialDuration: "930",
    trialIsActive: false,
    needEshopLink: false,
    autoRefresh: true
  });
});

app.post("/carousel/v2/pages/party", (req, res) => {
  res.send(party);
});

app.post("/carousel/v2/pages/upsell-videos", (req, res) => {
  res.send(upsellvideos);
});

app.get("/com-video/v1/com-videos-fullscreen", (req, res) => {
  res.send([]);
});

app.get("/community-remix/v1/active-contest", (req, res) => {
  res.send([]);
});

app.get("/constant-provider/v1/sku-constants", (req, res) => {
  res.send(skuconstants);
});

app.get("/customizable-itemdb/v1/items", (req, res) => {
  res.send(items);
});

app.get("/dance-machine/v1/blocks", (req, res) => {
  res.send(blocks);
});

app.get("/leaderboard/v1/coop_points/mine", (req, res) => {
  res.send(mine);
});

app.get("/packages/v1/sku-packages", (req, res) => {
  const skuId = req.header("x-skuid");
  var ticket = req.header("Authorization");
  if (
    req.header("User-Agent") ===
    "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static"
  ) {
    if (req.header("Authorization") === ticket) {
      if (skuId === "jd2017-pc-ww") {
        res.send(skupackages);
      }
      if (skuId === "jd2020-pc-ww") {
        res.send(skupackages);
      }
    } else {
      res.send("Forbidden");
    }
  } else {
    res.send("Forbidden");
  }
});

app.get("/profile/*/profiles", (req, res) => {
  var profileid = req.url.split("=").pop();
  var ticket = req.header("Authorization");
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    prodwsurl + "/profile/v2/profiles?profileIds=" + profileid,
    false
  );
  xhr.setRequestHeader("X-SkuId", req.header("X-SkuId"));
  xhr.setRequestHeader("Authorization", req.header("Authorization"));
  xhr.setRequestHeader("Ubi-AppId", req.header("Ubi-AppId"));
  xhr.send();
  res.send(xhr.responseText);
});

app.post("/profile/*/profiles", (req, res) => {
  var xskuid = req.header("X-SkuId");
  var ticket = req.header("Authorization");
  var xhr = new XMLHttpRequest();
  xhr.open("POST", prodwsurl + "/profile/v2/profiles", true);
  xhr.setRequestHeader("X-SkuId", xskuid);
  xhr.setRequestHeader("Authorization", ticket);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  res.send(xhr.responseText);
});

app.get("/questdb/v1/quests", (req, res) => {
  res.send(quests);
});

app.get("/songdb/v1/songs", (req, res) => {
  const skuId = req.header("x-skuid");
  var ticket = req.header("Authorization");
  songdb = {}
  if (
    req.header("User-Agent") ===
    "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static"
  ) {
    if (req.header("Authorization") === ticket) {
      if (skuId === "jd2017-pc-ww") {
        res.send(require("./files/songs.json"))
    } else {
      res.send("Forbidden");
    }
  } else {
    res.send("Forbidden");
  }
});

app.get("/status/v1/ping", (req, res) => {
  res.send("");
});

app.post("/subscription/v1/refresh", (req, res) => {
  res.send([]);
});

app.post("/wdf/v1/assign-room", (req, res) => {
  res.send({
    room: room
  });
});
app.get(`/wdf/v1/rooms/${room}/notification`, (req, res) => {
  res.send(JSON.parse("{}"));
});

app.get(
  "/wdf/v1/rooms/" + room + "/themes/tournament/score-recap",
  (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    var result = req.url.substr(0);
    xhr.open("GET", prodwsurl + result, false);
    xhr.setRequestHeader("X-SkuId", "jd2017-pc-ww");
    xhr.setRequestHeader("Authorization", "application");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);
    res.send(JSON.parse(xhr.responseText));
  }
);

app.post("/wdf/v1/rooms/" + room + "/session", (req, res) => {
  var ticket = req.header("Authorization");
  var xhr = new XMLHttpRequest();
  var result = req.url.substr(0);
  xhr.open("POST", prodwsurl + result, false);
  xhr.setRequestHeader("X-SkuId", "jd2017-pc-ww");
  xhr.setRequestHeader("Authorization", "application");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(req.body), null, 2);
  res.sendStatus(200);
});

app.delete("/wdf/v1/rooms/" + room + "/session", (req, res) => {
  var ticket = req.header("Authorization");
  var xhr = new XMLHttpRequest();
  var result = req.url.substr(0);
  xhr.open("DELETE", prodwsurl + result, false);
  xhr.setRequestHeader("X-SkuId", "jd2017-pc-ww");
  xhr.setRequestHeader("Authorization", "application");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(req.body), null, 2);
  res.sendStatus(200);
});

app.post(
  "/wdf/v1/rooms/" + room + "/themes/tournament/update-scores",
  (req, res) => {
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    var result = req.url.substr(0);
    xhr.open("POST", prodwsurl + result, false);
    xhr.setRequestHeader("X-SkuId", "jd2017-pc-ww");
    xhr.setRequestHeader("Authorization", "application");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(req.body), null, 2);
    res.send(JSON.parse(xhr.responseText));
  }
);
app.get("/wdf/v1/server-time", (req, res) => {
  const httpsopts = {
    hostname: "public-ubiservices.ubi.com",
    port: 443,
    path: "/v2/profiles/sessions",
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19022",
      Authorization: XBLTicket["XBL3.0_Bezdrom_V1"],
      "Content-Type": "application/json",
      "Ubi-AppId": "application",
      Host: "public-ubiservices.ubi.com",
      "Content-Length": "0"
    }
  };
  redirect(httpsopts, "", function (redResponse) {
    var responsepar = JSON.parse(redResponse);
    var auth = "Ubi_v1 " + responsepar["ticket"];
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    var result = req.url.substr(0);
    xhr.open("GET", prodwsurl + result, false);
    xhr.setRequestHeader("X-SkuId", "jd2021-xone-all");
    xhr.setRequestHeader("Authorization", "application");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(JSON.stringify(req.body));
    res.send(xhr.responseText);
  });
});
app.get("/wdf/v1/rooms/" + room + "/*", (req, res) => {
  const httpsopts = {
    hostname: "public-ubiservices.ubi.com",
    port: 443,
    path: "/v2/profiles/sessions",
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19022",
      Authorization: XBLTicket["XBL3.0_Bezdrom_V1"],
      "Content-Type": "application/json",
      "Ubi-AppId": "application",
      Host: "public-ubiservices.ubi.com",
      "Content-Length": "0"
    }
  };
  redirect(httpsopts, "", function (redResponse) {
    var responsepar = JSON.parse(redResponse);
    var auth = "Ubi_v1 " + responsepar["ticket"];
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    var result = req.url.substr(0);
    xhr.open("GET", prodwsurl + result, false);
    xhr.setRequestHeader("X-SkuId", "jd2021-xone-all");
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(JSON.stringify(req.body));
    res.send(xhr.responseText);
    console.log(prodwsurl + result + " Method:GET" + " : " + xhr.responseText);
  });
});
var jduserversdata = `fuck you`
app.post("/wdf/v1/rooms/" + room + "/*", (req, res) => {
  const httpsopts = {
    hostname: "public-ubiservices.ubi.com",
    port: 443,
    path: "/v2/profiles/sessions",
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19022",
      "Content-Type": "application/json",
      "Ubi-AppId": "f78cbbdb-72eb-47f4-af54-91618c1eecd0",
      Host: "public-ubiservices.ubi.com",
      "Content-Length": "0"
    }
  };
  redirect(httpsopts, "", function (redResponse) {
    var responsepar = JSON.parse(redResponse);
    var auth = "Ubi_v1 " + responsepar["ticket"];
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    var result = req.url.substr(0);
    xhr.open("POST", prodwsurl + result, false);
    xhr.setRequestHeader("X-SkuId", "jd2021-xone-all");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(JSON.stringify(req.body));
    res.send(xhr.responseText);
    console.log(prodwsurl + result + " Method:POST" + " : " + xhr.responseText);
  });
});
app.delete("/wdf/v1/rooms/" + room + "/*", (req, res) => {
  const httpsopts = {
    hostname: "public-ubiservices.ubi.com",
    port: 443,
    path: "/v2/profiles/sessions",
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19022",
      "Content-Type": "application/json",
      "Ubi-AppId": "f78cbbdb-72eb-47f4-af54-91618c1eecd0",
      Host: "public-ubiservices.ubi.com",
      "Content-Length": "0"
    }
  };
  redirect(httpsopts, "", function (redResponse) {
    var responsepar = JSON.parse(redResponse);
    var auth = "Ubi_v1 " + responsepar["ticket"];
    var ticket = req.header("Authorization");
    var xhr = new XMLHttpRequest();
    var result = req.url.substr(0);
    xhr.open("DELETE", prodwsurl + result, false);
    xhr.setRequestHeader("X-SkuId", "jd2021-xone-all");
    xhr.setRequestHeader("Authorization", auth);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.send(JSON.stringify(req.body));
    res.send(xhr.responseText);
    console.log(
      prodwsurl + result + " Method:DELETE" + " : " + xhr.responseText
    );
  });
});

app.get("/wdf/v1/online-bosses", (req, res) => {
  res.send(bosses);
});

app.get("/leaderboard/v1/maps/*", (req, res) => {
  var ticket = req.header("Authorization");
  var contentlen = req.header("Content-Length");
  var xhr = new XMLHttpRequest();
  var result = req.url.substr(0);
  xhr.open("GET", prodwsurl + result, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
  res.send(xhr.responseText);
});

app.get("/v3/users/*", (req, res) => {
  res.send({
    userId: "e94b3197-cde3-476e-905e-527110f47c89",
    username: "A",
    nameOnPlatform: "A",
    accountIssues: null,
    dateCreated: "2016-11-17T20:48:36.3530000Z",
    dateOfBirth: "2001-06-09T00:00:00.0000000Z",
    email: "test@gmail.com",
    firstName: "Alex",
    gender: "M",
    hasAcceptedLegalOptins: true,
    lastName: "Gasp",
    preferredLanguage: "en",
    status: {
      autoGeneratedUsername: false,
      dateOfBirthApproximated: false,
      invalidEmail: false,
      missingRequiredInformation: false,
      pendingDeactivation: false,
      targetDeactivationDate: null,
      recoveringPassword: true,
      passwordUpdateRequired: false,
      reserved: false,
      changeEmailPending: true,
      inactiveAccount: false,
      generalStatus: "activated",
      suspiciousActivity: false,
      locked: false,
      minor: false
    },
    phone: null,
    accountType: "Ubisoft"
  });
});

app.get("/content-authorization/v1/maps/*", (req, res) => {
  var ss = req.url.split("/").pop();
  const path = "./videos/" + ss + ".json";
  const skuId = req.header("x-skuid");
  var ticket = req.header("Authorization");
  if (
    req.header("User-Agent") ===
    "UbiServices_SDK_HTTP_Client_4.2.9_PC32_ansi_static"
  ) {
    if (req.header("Authorization") === ticket) {
      if (skuId === "jd2017-pc-ww") {
        try {
          if (fs.existsSync(path)) {
            console.log(path + " exists.");
            var fileurls = require("./videos/" + ss + ".json");
            res.send(fileurls);
          } else {
            console.log(path + " does not exist.");
            var ticket = req.header("Authorization");
            var contentlen = req.header("Content-Length");
            var xhr = new XMLHttpRequest();
            var n = req.url.lastIndexOf("/");
            var result = req.url.substr(0);
            xhr.open("GET", prodwsurl + result, false);
            xhr.setRequestHeader("X-SkuId", "jd2017-pc-ww");
            xhr.setRequestHeader("Authorization", ticket);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
            res.send(xhr.responseText);
          }
        } catch (err) {
          console.error(err);
        }
      }
      if (skuId === "jd2020-pc-ww") {
        try {
          if (fs.existsSync(path)) {
            console.log(path + " exists.");
            var fileurls = require("./videos/" + ss + ".json");
            res.send(fileurls);
          } else {
            console.log(path + " does not exist.");
            var ticket = req.header("Authorization");
            var contentlen = req.header("Content-Length");
            var xhr = new XMLHttpRequest();
            var n = req.url.lastIndexOf("/");
            var result = req.url.substr(0);
            xhr.open("GET", prodwsurl + result, false);
            xhr.setRequestHeader("X-SkuId", "jd2017-pc-ww");
            xhr.setRequestHeader("Authorization", ticket);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send();
            res.send(xhr.responseText);
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      res.send("Forbidden");
    }
  } else {
    res.send("Forbidden");
  }
});

//function checkHttps(req, res, next) {
//  if (req.get("X-Forwarded-Proto").indexOf("http") != -1) {
//    return next();
//  } else {
//    res.redirect("http://" + req.hostname + req.url);
//  }
//}

//app.all("*", checkHttps);
//app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.send(jduserversdata);
});

function redirect(options, write, callback) {
  var Redirect = https.request(options, response => {
    response.on("data", data => {
      callback(data);
    });
  });
  Redirect.on("error", e => {
    console.log(e);
  });
  Redirect.write(write);
  Redirect.end();
}

function get(options, write, callback) {
  var Redirect = https.request(options, response => {
    response.on("data", data => {
      callback(data);
    });
  });
  Redirect.on("error", e => {
    console.log(e);
  });
  Redirect.write(write);
  Redirect.end();
}

// listen for requests :)
const listener = app.listen(process.env.PORT = 80, function () {
  //console.log("Your app is listening on port " + listener.address().port);
});


console.log("SERVER ON");
