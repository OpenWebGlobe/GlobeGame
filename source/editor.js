/*******************************************************************************
 #      ____               __          __  _      _____ _       _               #
 #     / __ \              \ \        / / | |    / ____| |     | |              #
 #    | |  | |_ __   ___ _ __ \  /\  / /__| |__ | |  __| | ___ | |__   ___      #
 #    | |  | | '_ \ / _ \ '_ \ \/  \/ / _ \ '_ \| | |_ | |/ _ \| '_ \ / _ \     #
 #    | |__| | |_) |  __/ | | \  /\  /  __/ |_) | |__| | | (_) | |_) |  __/     #
 #     \____/| .__/ \___|_| |_|\/  \/ \___|_.__/ \_____|_|\___/|_.__/ \___|     #
 #           | |                                                                #
 #           |_|                 _____ _____  _  __                             #
 #                              / ____|  __ \| |/ /                             #
 #                             | (___ | |  | | ' /                              #
 #                              \___ \| |  | |  <                               #
 #                              ____) | |__| | . \                              #
 #                             |_____/|_____/|_|\_\                             #
 #                                                                              #
 #                              (c) 2011-2012 by                                #
 #           University of Applied Sciences Northwestern Switzerland            #
 #                     Institute of Geomatics Engineering                       #
 #                          Author:robert.wst@gmail.com                         #
 ********************************************************************************
 *     Licensed under MIT License. Read the file LICENSE for more information   *
 *******************************************************************************/
goog.provide('owg.gg.Editor');
/* Members */
var gge = {};
gge["images"] = {};
gge["loadedImages"] = 0;
gge["numImages"] = 0;
gge["context"];
gge["globe"];
gge["stage"];
gge["scene"];
gge["camera"];
gge["ui"] = new Kinetic.Layer();
gge["static"] = new Kinetic.Layer();
gge["centerX"] = (window.innerWidth - 350) / 2;
gge["centerY"] = window.innerHeight / 2;
gge["challenge"] = null;
gge["cType"] = 0;
gge["pin"];
gge["pick"] = [false, 0, 0, 0];
gge["zoom"] = false;
gge["pickOverlay"];
gge["trLayer"] = null;
gge["elev"];
gge["views"] = [];
gge["soundenabled"] = false;
gge["datahost"] = "http://localhost";
gge["callbacks"] = [];
gge["resizeCallbacks"] = [];
gge["minimode"] = false;

//-----------------------------------------------------------------------------
/**
 * @description Select all text inside input element
 * @param {string} id
 */
function SelectAllText(id) {
   document.getElementById(id).focus();
   document.getElementById(id).select();
}
//-----------------------------------------------------------------------------
/**
 * @description preload art
 * @param {Object.<string>} sources
 */
function LoadImages(sources) {
   // get num of sources
   for (var src in sources) {
      gge["numImages"]++;
   }
   for (var src in sources) {
      gge["images"][src] = new Image();
      gge["images"][src].src = sources[src];
   }
}
//-----------------------------------------------------------------------------
/**
 * @description init editor
 * @param {(string|null)} datapath
 * @param {number} renderquality
 */
function Init(datapath,renderquality) {
   if (datapath) {
      gge["datahost"] = datapath;
   }
   ogSetArtworkDirectory("../WebViewer/art/");
   gge["context"] = ogCreateContext({canvas: "canvas",
         fullscreen: true
      }
   );
   gge["scene"] = ogCreateScene(gge["context"], OG_SCENE_3D_ELLIPSOID_WGS84, {
         rendertotexture: false
      }
   );
   gge["globe"] = ogCreateWorld(gge["scene"]);
   gge["camera"] = ogGetActiveCamera(gge["scene"]);
   gge["stage"] = new Kinetic.Stage({
      container: "main_ui",
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0
   });
   // Preload images
   var sources = {
      btn_01: "art/btn_01.png",
      btn_01_c: "art/btn_01_c.png",
      btn_01_h: "art/btn_01_h.png",
      btn_01_d: "art/btn_01_d.png",
      btn_01_f: "art/btn_01_f.png",
      btn_01_t: "art/btn_01_t.png",
      btn_01_o: "art/btn_01_o.png",
      clock: "art/clock.png",
      dial: "art/dial.png",
      pin_blue: "art/pin_blue.png",
      pin_red: "art/pin_red.png",
      pin_green: "art/pin_green.png",
      pin_yellow: "art/pin_yellow.png"
   };
   LoadImages(sources);

   // Add OWG Data
   ogAddImageLayer(gge["globe"], {
      url: [gge["datahost"]],
      layer: "bluemarble",
      service: "owg"
   });
   ogAddImageLayer(gge["globe"], {
      url: [gge["datahost"]],
      layer: "swissimage",
      service: "owg"
   });
   gge["elev"] = ogAddElevationLayer(gge["globe"], {
      url: [gge["datahost"]],
      layer: "DHM25",
      service: "owg"
   });
   ogSetRenderQuality(gge["globe"], 3);
   ogSetRenderFunction(gge["context"], OnRender);
   ogSetResizeFunction(gge["context"], OnResize);

   var camId = ogGetActiveCamera(gge["scene"]);
   ogSetPosition(camId, 8.225578, 46.8248707, 280000.0);
   ogSetOrientation(camId, 0.0, -90.0, 0.0);
   ogSetCanvasSizeOffset(gge["scene"], 360, 1);
   ogSetRenderQuality(gge["globe"], renderquality);
   gge["pin"] = new Pin(gge["static"], gge["images"]["pin_red"], 0, 0);
   gge["pickOverlay"] = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight
   });
   gge["static"].add(gge["pickOverlay"]);
   gge["pickOverlay"].on("mousedown", PickMouseDown);
   gge["pickOverlay"].on("mouseup", PickMouseUp);
   gge["pickOverlay"].on("mousemove", PickMouseMove);
   gge["stage"].add(gge["ui"]);
}
//-----------------------------------------------------------------------------
/**
 * @description mouse move on pick overlay
 */
function PickMouseMove() {
   if (gge["zoom"]) {
      var pos = gge["stage"].getMousePosition();
      var scene = ogGetScene(gge["context"]);
      gge["pin"].SetPos(pos.x, pos.y);
   }

}
//-----------------------------------------------------------------------------
/**
 * @description mouse down on pick overlay
 */
function PickMouseDown() {
   var pos = gge["stage"].getMousePosition();
   var scene = ogGetScene(gge["context"]);
   var camId = ogGetActiveCamera(scene);
   var pick = ogPickGlobe(scene, pos.x, pos.y);
   ogSetPosition(camId, pick[1], pick[2], 50000.0);
   gge["zoom"] = true;
}
//-----------------------------------------------------------------------------
/**
 * @description mouse up on pick overlay
 */
function PickMouseUp() {
   var scene = ogGetScene(gge["context"]);
   var camId = ogGetActiveCamera(scene);
   gge["zoom"] = false;
   var pos = gge["stage"].getMousePosition();
   var pick = ogPickGlobe(scene, pos.x, pos.y);
   gge["pick"] = pick;
   ogSetPosition(camId, 8.225578, 46.8248707, 280000.0);
   setTimeout(function () {
      var newPos = ogWorldToWindow(scene, gge["pick"][4], gge["pick"][5], gge["pick"][6]);
      gge["pin"].SetPos(newPos[0], newPos[1]);
   }, 100);
}
//-----------------------------------------------------------------------------
/**
 * @description Challenge type changed
 */
function TypeChanged(type) {
   if (type == "landmark") {
      ClearViews();
      jQuery('#picking_div').css("visibility", "hidden");
      jQuery('#landmark_div').css("visibility", "visible");
      jQuery('#main_ui').css("visibility", "hidden");
      gge["cType"] = 0;
      gge["static"].remove();
      gge["elev"] = ogAddElevationLayer(gge["globe"], {
         url: [gge["datahost"]],
         layer: "DHM25",
         service: "owg"
      });
   }
   else if (type == "picking") {
      jQuery('#picking_div').css("visibility", "visible");
      jQuery('#landmark_div').css("visibility", "hidden");
      jQuery('#main_ui').css("visibility", "visible");
      gge["cType"] = 1;
      var scene = ogGetScene(gge["context"]);
      var camId = ogGetActiveCamera(scene);
      ogSetPosition(camId, 8.225578, 46.8248707, 280000.0);
      ogSetOrientation(camId, 0.0, -90.0, 0.0);
      gge["stage"].add(gge["static"]);
      ogRemoveImageLayer(gge["elev"]);
   }
}
//-----------------------------------------------------------------------------
/**
 * @description toggele OSM traffic layer
 */
function TrafficLayer(enabled) {
   if (enabled) {
      gge["trLayer"] = ogAddImageLayer(gge["globe"], {
         url: [gge["datahost"]],
         layer: "osm_transparent",
         service: "owg"
      });
   }
   else {
      ogRemoveImageLayer(gge["trLayer"]);
   }
}
//-----------------------------------------------------------------------------
/**
 * @class ViewObj
 * @constructor
 * @description view object
 *
 * @param {number} lng
 * @param {number} lat
 * @param {number} elev
 * @param {number} yaw
 * @param {number} pitch
 * @param {number} roll
 */
function ViewObj(lng, lat, elev, yaw, pitch, roll) {
   this.longitude = lng;
   this.latitude = lat;
   this.elevation = elev;
   this.yaw = yaw;
   this.pitch = pitch;
   this.roll = roll;
}
//-----------------------------------------------------------------------------
/**
 * @description append viewpos for landmark challenge
 */
function AddView() {
   var scene = ogGetScene(gge["context"]);
   var ori = ogGetOrientation(scene);
   var pos = ogGetPosition(scene);
   var view = new ViewObj(pos["longitude"], pos["latitude"], pos["elevation"], ori["yaw"], ori["pitch"], ori["roll"]);
   gge["views"].push(view);

}
//-----------------------------------------------------------------------------
/**
 * @description update and start test mode
 */
function Update() {
   var val = jQuery.parseJSON(document.getElementById('output').innerHTML);
   if (gge["cType"] == 0) {
      gge["challenge"] = new LandmarkChallenge(val["BaseScore"], val["Options"], val["CorrectOption"], val["Views"], val["Title"]);
      gge["challenge"].draftmode = true;
      gge["challenge"].Prepare(0);
      gge["challenge"].Activate();
   } else {
      gge["static"].remove();
      var pos = [ val["Longitude"], val["Latitude"], val["Elevation"] ];
      gge["challenge"] = new PickingChallenge(val["BaseScore"], val["Title"], pos);
      gge["challenge"].draftmode = true;
      gge["challenge"].Prepare(0);
      gge["challenge"].Activate();
   }
}
//-----------------------------------------------------------------------------
/**
 * @description clear views for landmark challenge
 */
function ClearViews() {
   gge["views"] = [];
}
//-----------------------------------------------------------------------------
/**
 * @description Start test mode
 */
function ShowChallenge() {
   jQuery('#main_ui').css("visibility", "visible");
   jQuery('#testbtn').css("visibility", "hidden");
   jQuery('#resetbtn').css("visibility", "visible");
   jQuery('#details').css("visibility", "hidden");
   jQuery('#landmark_div').css("visibility", "hidden");
   jQuery('#picking_div').css("visibility", "hidden");
   Update();
}
//-----------------------------------------------------------------------------
/**
 * @description stop test mode
 */
function HideChallenge() {
   if (gge["challenge"]) {
      gge["challenge"].Destroy(OnChallengeReset);
   }
   jQuery('#testbtn').css("visibility", "visible");
   jQuery('#resetbtn').css("visibility", "hidden");
   jQuery('#details').css("visibility", "visible");
   if (gge["cType"] == 0) {
      jQuery('#landmark_div').css("visibility", "visible");
   }
   else if (gge["cType"] == 1) {
      jQuery('#picking_div').css("visibility", "visible");
   }
}
//-----------------------------------------------------------------------------
/**
 * @description callback function for resetting the test mode challenge
 */
function OnChallengeReset() {
   var scene = ogGetScene(gge["context"]);
   var camId = ogGetActiveCamera(scene);

   if (gge["cType"] == 0) {
      jQuery('#main_ui').css("visibility", "hidden");
   }
   else if (gge["cType"] == 1) {
      ogSetPosition(camId, 8.225578, 46.8248707, 280000.0);
      ogSetOrientation(camId, 0.0, -90.0, 0.0);
      gge["stage"].add(gge["static"]);
   }
}

//-----------------------------------------------------------------------------
/**
 * @description hook in functions to the game cycle if needed
 * @param {string} id
 * @param {function()} callback
 */
function RegisterCycleCallback(id, callback) {
   gge["callbacks"].push([id, callback]);
}

//-----------------------------------------------------------------------------
/**
 * @description remove callback functions from game cycle
 * @param {string} id
 */
function UnregisterCycleCallback(id) {
   for (var i = 0; i < gge["callbacks"].length; i++) {
      if (gge["callbacks"][i][0] == id) {
         gge["callbacks"].splice(i, 1);
      }
   }
}

//-----------------------------------------------------------------------------
/**
 * @description hook in functions to the window resize event if needed
 * @param {string} id
 * @param {function()} callback
 */
function RegisterResizeCallback(id, callback) {
   gge["resizeCallbacks"].push([id, callback]);
}
//-----------------------------------------------------------------------------
/**
 * @description remove callback functions from window resize
 * @param {string} id
 */
function UnregisterResizeCallback(id) {
   for (var i = 0; i < gge["resizeCallbacks"].length; i++) {
      if (gge["resizeCallbacks"][i][0] == id) {
         gge["resizeCallbacks"].splice(i, 1);
      }
   }
}

//-----------------------------------------------------------------------------
/**
 * @description render callback openwebglobe
 * @param {number} context
 */
function OnRender(context) {
   var scene = ogGetScene(gge["context"]);
   var ori = ogGetOrientation(scene);
   var pos = ogGetPosition(scene);
   document.getElementById('current').innerText = "yaw=" + ori["yaw"] + " pitch=" + ori["pitch"] + " roll=" + ori["roll"] +
      "lng=" + pos["longitude"] + " lat=" + pos["latitude"] + " elev=" + pos["elevation"];
   if (gge["cType"] == 0) {
      var out = "{\n" +
         "   \"Type\": 0,\n" +
         "   \"BaseScore\": " + document.getElementById('basescore').value + ",\n" +
         "   \"Title\": \"" + document.getElementById('title').value + "\",\n" +
         "   \"CorrectOption\": " + document.getElementById('correctoption').value + ",\n" +
         "   \"Options\": [\"" + document.getElementById('option1').value + "\", \"" + document.getElementById('option2').value + "\", \"" + document.getElementById('option3').value + "\", \"" + document.getElementById('option4').value + "\"],\n" +
         "   \"Views\": [\n";
      for (var i = 0; i < gge["views"].length; i++) {
         out = out + "       { \"longitude\": " + gge["views"][i].longitude + ",\n        \"latitude\": " + gge["views"][i].latitude + ",\n        \"elevation\": " + gge["views"][i].elevation + ",\n " +
            "       \"yaw\": " + gge["views"][i].yaw + ",\n        \"pitch\": " + gge["views"][i].pitch + ",\n        \"roll\": " + gge["views"][i].roll + "\n       }";
         if (i < gge["views"].length - 1) {
            out = out + ",\n";
         }
      }
      out = out + "   \n]\n}";
   }
   else if (gge["cType"] == 1) {
      var out = "{\n" +
         "   \"Type\": 1,\n" +
         "   \"BaseScore\": " + document.getElementById('qscore').value + ",\n" +
         "   \"Title\": \"" + document.getElementById('location').value + "\",\n" +
         "   \"Longitude\": " + gge["pick"][1] + ",\n" +
         "   \"Latitude\": " + gge["pick"][2] + ",\n" +
         "   \"Elevation\": " + gge["pick"][3] + "\n" +
         "\n}";
   }


   document.getElementById('output').innerHTML = out;
   gge["stage"].draw();
   for (var i = 0; i < gge["callbacks"].length; i++) {
      gge["callbacks"][i][1]();
   }
}
//-----------------------------------------------------------------------------
/**
 * @description on resize callback
 * @param {number} context
 */
function OnResize(context) {
   gge["centerX"] = (window.innerWidth - 350) / 2;
   gge["centerY"] = window.innerHeight / 2;
   gge["stage"].setSize(window.innerWidth - 350, window.innerHeight);
   for (var i = 0; i < gge["resizeCallbacks"].length; i++) {
      gge["resizeCallbacks"][i][1]();
   }
}

goog.exportSymbol('SelectAllText', SelectAllText);
goog.exportSymbol('LoadImages', LoadImages);
goog.exportSymbol('Init', Init);
goog.exportSymbol('PickMouseMove', PickMouseMove);
goog.exportSymbol('PickMouseDown', PickMouseDown);
goog.exportSymbol('PickMouseUp', PickMouseUp);
goog.exportSymbol('TypeChanged', TypeChanged);
goog.exportSymbol('TrafficLayer', TrafficLayer);
goog.exportSymbol('ViewObj', ViewObj);
goog.exportSymbol('AddView', AddView);
goog.exportSymbol('Update', Update);
goog.exportSymbol('ClearViews', ClearViews);
goog.exportSymbol('ShowChallenge', ShowChallenge);
goog.exportSymbol('HideChallenge', HideChallenge);
goog.exportSymbol('OnChallengeReset', OnChallengeReset);

goog.exportSymbol('OnRender', OnRender);
goog.exportSymbol('OnResize', OnResize);