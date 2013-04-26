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
var m_images = {};
var m_loadedImages = 0;
var m_numImages = 0;
var m_context;
var m_globe;
var m_stage;
var m_scene;
var m_camera;
var m_ui = new Kinetic.Layer();
var m_static = new Kinetic.Layer();
var m_centerX = (window.innerWidth - 350) / 2;
var m_centerY = window.innerHeight / 2;
var m_challenge = null;
var m_cType = 0;
var m_pin;
var m_pick = [false, 0, 0, 0];
var m_zoom = false;
var m_pickOverlay;
var trLayer = null;
var m_elev;
var m_views = [];
var m_soundenabled = false;
var m_datahost = "http://localhost";
var m_callbacks = [];
var m_resizeCallbacks = [];
var m_minimode = false;

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
      m_numImages++;
   }
   for (var src in sources) {
      m_images[src] = new Image();
      m_images[src].src = sources[src];
   }
}
//-----------------------------------------------------------------------------
/**
 * @description init editor
 * @param {(string|null)} datapath
 */
function Init(datapath) {
   if (datapath) {
      m_datahost = datapath;
   }
   ogSetArtworkDirectory("../WebViewer/art/");
   m_context = ogCreateContext({canvas: "canvas",
         fullscreen: true
      }
   );
   m_scene = ogCreateScene(m_context, OG_SCENE_3D_ELLIPSOID_WGS84, {
         rendertotexture: false
      }
   );
   m_globe = ogCreateWorld(m_scene);
   m_camera = ogGetActiveCamera(m_scene);
   m_stage = new Kinetic.Stage({
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
   ogAddImageLayer(m_globe, {
      url: [m_datahost],
      layer: "bluemarble",
      service: "owg"
   });
   ogAddImageLayer(m_globe, {
      url: [m_datahost],
      layer: "swissimage",
      service: "owg"
   });
   m_elev = ogAddElevationLayer(m_globe, {
      url: [m_datahost],
      layer: "DHM25",
      service: "owg"
   });
   ogSetRenderQuality(m_globe, 3);
   ogSetRenderFunction(m_context, OnRender);
   ogSetResizeFunction(m_context, OnResize);

   var camId = ogGetActiveCamera(m_scene);
   ogSetPosition(camId, 8.225578, 46.8248707, 280000.0);
   ogSetOrientation(camId, 0.0, -90.0, 0.0);
   ogSetCanvasSizeOffset(m_scene, 360, 1);
   m_pin = new Pin(m_static, m_images["pin_red"], 0, 0);
   m_pickOverlay = new Kinetic.Rect({
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight
   });
   m_static.add(m_pickOverlay);
   m_pickOverlay.on("mousedown", PickMouseDown);
   m_pickOverlay.on("mouseup", PickMouseUp);
   m_pickOverlay.on("mousemove", PickMouseMove);
   m_stage.add(m_ui);
}
//-----------------------------------------------------------------------------
/**
 * @description mouse move on pick overlay
 */
function PickMouseMove() {
   if (m_zoom) {
      var pos = m_stage.getMousePosition();
      var scene = ogGetScene(m_context);
      m_pin.SetPos(pos.x, pos.y);
   }

}
//-----------------------------------------------------------------------------
/**
 * @description mouse down on pick overlay
 */
function PickMouseDown() {
   var pos = m_stage.getMousePosition();
   var scene = ogGetScene(m_context);
   var camId = ogGetActiveCamera(scene);
   var pick = ogPickGlobe(scene, pos.x, pos.y);
   ogSetPosition(camId, pick[1], pick[2], 50000.0);
   m_zoom = true;
}
//-----------------------------------------------------------------------------
/**
 * @description mouse up on pick overlay
 */
function PickMouseUp() {
   var scene = ogGetScene(m_context);
   var camId = ogGetActiveCamera(scene);
   m_zoom = false;
   var pos = m_stage.getMousePosition();
   var pick = ogPickGlobe(scene, pos.x, pos.y);
   m_pick = pick;
   ogSetPosition(camId, 8.225578, 46.8248707, 280000.0);
   setTimeout(function () {
      var newPos = ogWorldToWindow(scene, m_pick[4], m_pick[5], m_pick[6]);
      m_pin.SetPos(newPos[0], newPos[1]);
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
      m_cType = 0;
      m_static.remove();
      m_elev = ogAddElevationLayer(m_globe, {
         url: [m_datahost],
         layer: "DHM25",
         service: "owg"
      });
   }
   else if (type == "picking") {
      jQuery('#picking_div').css("visibility", "visible");
      jQuery('#landmark_div').css("visibility", "hidden");
      jQuery('#main_ui').css("visibility", "visible");
      m_cType = 1;
      var scene = ogGetScene(m_context);
      var camId = ogGetActiveCamera(scene);
      ogSetPosition(camId, 8.225578, 46.8248707, 280000.0);
      ogSetOrientation(camId, 0.0, -90.0, 0.0);
      m_stage.add(m_static);
      ogRemoveImageLayer(m_elev);
   }
}
//-----------------------------------------------------------------------------
/**
 * @description toggle OSM traffic layer
 */
function TrafficLayer(enabled) {
   if (enabled) {
      trLayer = ogAddImageLayer(m_globe, {
         url: [m_datahost],
         layer: "osm_transparent",
         service: "owg"
      });
   }
   else {
      ogRemoveImageLayer(trLayer);
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
   var scene = ogGetScene(m_context);
   var ori = ogGetOrientation(scene);
   var pos = ogGetPosition(scene);
   var view = new ViewObj(pos["longitude"], pos["latitude"], pos["elevation"], ori["yaw"], ori["pitch"], ori["roll"]);
   m_views.push(view);

}
//-----------------------------------------------------------------------------
/**
 * @description update and start test mode
 */
function Update() {
   var val = jQuery.parseJSON(document.getElementById('output').innerHTML);
   if (m_cType == 0) {
      m_challenge = new LandmarkChallenge(val["BaseScore"], val["Options"], val["CorrectOption"], val["Views"], val["Title"]);
      m_challenge.draftmode = true;
      m_challenge.Prepare(0);
      m_challenge.Activate();
   } else {
      m_static.remove();
      var pos = [ val["Longitude"], val["Latitude"], val["Elevation"] ];
      m_challenge = new PickingChallenge(val["BaseScore"], val["Title"], pos);
      m_challenge.draftmode = true;
      m_challenge.Prepare(0);
      m_challenge.Activate();
   }
}
//-----------------------------------------------------------------------------
/**
 * @description clear views for landmark challenge
 */
function ClearViews() {
   m_views = [];
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
   if (m_challenge) {
      m_challenge.Destroy(OnChallengeReset);
   }
   jQuery('#testbtn').css("visibility", "visible");
   jQuery('#resetbtn').css("visibility", "hidden");
   jQuery('#details').css("visibility", "visible");
   if (m_cType == 0) {
      jQuery('#landmark_div').css("visibility", "visible");
   }
   else if (m_cType == 1) {
      jQuery('#picking_div').css("visibility", "visible");
   }
}
//-----------------------------------------------------------------------------
/**
 * @description callback function for resetting the test mode challenge
 */
function OnChallengeReset() {
   var scene = ogGetScene(m_context);
   var camId = ogGetActiveCamera(scene);

   if (m_cType == 0) {
      jQuery('#main_ui').css("visibility", "hidden");
   }
   else if (m_cType == 1) {
      ogSetPosition(camId, 8.225578, 46.8248707, 280000.0);
      ogSetOrientation(camId, 0.0, -90.0, 0.0);
      m_stage.add(m_static);
   }
}

//-----------------------------------------------------------------------------
/**
 * @description hook in functions to the game cycle if needed
 * @param {string} id
 * @param {function()} callback
 */
function RegisterCycleCallback(id, callback) {
   m_callbacks.push([id, callback]);
}

//-----------------------------------------------------------------------------
/**
 * @description remove callback functions from game cycle
 * @param {string} id
 */
function UnregisterCycleCallback(id) {
   for (var i = 0; i < m_callbacks.length; i++) {
      if (m_callbacks[i][0] == id) {
         m_callbacks.splice(i, 1);
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
   m_resizeCallbacks.push([id, callback]);
}
//-----------------------------------------------------------------------------
/**
 * @description remove callback functions from window resize
 * @param {string} id
 */
function UnregisterResizeCallback(id) {
   for (var i = 0; i < m_resizeCallbacks.length; i++) {
      if (m_resizeCallbacks[i][0] == id) {
         m_resizeCallbacks.splice(i, 1);
      }
   }
}

//-----------------------------------------------------------------------------
/**
 * @description render callback openwebglobe
 * @param {number} context
 */
function OnRender(context) {
   var scene = ogGetScene(m_context);
   var ori = ogGetOrientation(scene);
   var pos = ogGetPosition(scene);
   document.getElementById('current').innerText = "yaw=" + ori["yaw"] + " pitch=" + ori["pitch"] + " roll=" + ori["roll"] +
      "lng=" + pos["longitude"] + " lat=" + pos["latitude"] + " elev=" + pos["elevation"];
   if (m_cType == 0) {
      var out = "{\n" +
         "   \"Type\": 0,\n" +
         "   \"BaseScore\": " + document.getElementById('basescore').value + ",\n" +
         "   \"Title\": \"" + document.getElementById('title').value + "\",\n" +
         "   \"CorrectOption\": " + document.getElementById('correctoption').value + ",\n" +
         "   \"Options\": [\"" + document.getElementById('option1').value + "\", \"" + document.getElementById('option2').value + "\", \"" + document.getElementById('option3').value + "\", \"" + document.getElementById('option4').value + "\"],\n" +
         "   \"Views\": [\n";
      for (var i = 0; i < m_views.length; i++) {
         out = out + "       { \"longitude\": " + m_views[i].longitude + ",\n        \"latitude\": " + m_views[i].latitude + ",\n        \"elevation\": " + m_views[i].elevation + ",\n " +
            "       \"yaw\": " + m_views[i].yaw + ",\n        \"pitch\": " + m_views[i].pitch + ",\n        \"roll\": " + m_views[i].roll + "\n       }";
         if (i < m_views.length - 1) {
            out = out + ",\n";
         }
      }
      out = out + "   \n]\n}";
   }
   else if (m_cType == 1) {
      var out = "{\n" +
         "   \"Type\": 1,\n" +
         "   \"BaseScore\": " + document.getElementById('qscore').value + ",\n" +
         "   \"Title\": \"" + document.getElementById('location').value + "\",\n" +
         "   \"Longitude\": " + m_pick[1] + ",\n" +
         "   \"Latitude\": " + m_pick[2] + ",\n" +
         "   \"Elevation\": " + m_pick[3] + "\n" +
         "\n}";
   }


   document.getElementById('output').innerHTML = out;
   m_stage.draw();
   for (var i = 0; i < m_callbacks.length; i++) {
      m_callbacks[i][1]();
   }
}
//-----------------------------------------------------------------------------
/**
 * @description on resize callback
 * @param {number} context
 */
function OnResize(context) {
   m_centerX = (window.innerWidth - 350) / 2;
   m_centerY = window.innerHeight / 2;
   m_stage.setSize(window.innerWidth - 350, window.innerHeight);
   for (var i = 0; i < m_resizeCallbacks.length; i++) {
      m_resizeCallbacks[i][1]();
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