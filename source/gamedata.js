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
goog.provide('owg.gg.GameData');

goog.require('owg.gg.Challenge');
goog.require('owg.gg.LandmarkChallenge');
goog.require('owg.gg.PickingChallenge');
goog.require('owg.gg.DistrictChallenge');
//-----------------------------------------------------------------------------
/**
 * @class GameData
 * @constructor
 *
 * @description game data I/O handler
 *
 * @author Robert Wüest robert.wst@gmail.ch
 * @param {(function()|null)} callback
 */
function GameData(callback) {
   // load question array
   this.questions = [];
   this.baseData = {};
   var that = this
   jQuery.get('getData.php', function (data) {
      that.baseData = jQuery.parseJSON(data);

      jQuery.get('getChallenges.php?lang=' + m_lang, function (data) {
         var jsonData = jQuery.parseJSON(data);
         var items = [];
         /** @type {{Type:number}} */
         jQuery.each(jsonData, function (key, val) {
            if (val.Type == 0) {
               var baseScore = /** @type {number} */val.BaseScore;
               var options = /** @type {Array} */val.Options;
               var correctOption = /** @type {number} */val.CorrectOption;
               var views = /** @type {Array} */val.Views;
               var title = /** @type {string} */val.Title;
               var landmarkchallenge = new LandmarkChallenge(baseScore, options, correctOption, views, title);
               items.push(landmarkchallenge);
            } else if (val.Type == 1) {
               var lng = /** @type {number} */val.Longitude;
               var lat = /** @type {number} */val.Latitude;
               var elv = /** @type {number} */val.Elevation;
               var baseScore = /** @type {number} */val.BaseScore;
               var title = /** @type {string} */val.Title;
               var pos = [ lng, lat, elv];
               var pickingchallenge = new PickingChallenge(baseScore, title, pos);
               items.push(pickingchallenge);
            }
            else if (val.Type == 2) {
               var lng = /** @type {number} */val.Longitude;
               var lat = /** @type {number} */val.Latitude;
               var elv = /** @type {number} */val.Elevation;
               var yaw = /** @type {number} */val.Yaw;
               var pitch = /** @type {number} */val.Pitch;
               var roll = /** @type {number} */val.Roll;
               var baseScore = /** @type {number} */val.BaseScore;
               var correctPick = /** @type {string} */val.CorrectPick;
               var title = /** @type {string} */val.Title;
               var dataFile = /** @type {string} */val.DataFile;
               var extent = /** @type {Array.<number>} */val.SceneExtent;
               var offset = [0,0];
               if(goog.isDef(val.Offset))
               {
                  offset = /** @type {Array.<number>} */val.Offset;
               }
               var view = { "longitude": lng, "latitude": lat, "elevation": elv, "yaw": yaw, "pitch": pitch, "roll": roll};
               var districtchallenge = new DistrictChallenge(baseScore, correctPick, that.baseData[dataFile], view, title, extent, offset);
               items.push(districtchallenge);
            }
         });
         that.questions = items;
         if (callback) {
            callback();
         }
      });

   });
}
//-----------------------------------------------------------------------------
/**
 * @description pop random challenge from available game data
 */
GameData.prototype.PickChallenge = function () {
   // Random pick a challenge
   var index = Math.floor(Math.random() * this.questions.length);
   var challenge = this.questions[index];
   this.questions.splice(index, 1);
   return challenge;
};
goog.exportSymbol('GameData', GameData);
goog.exportProperty(GameData.prototype, 'PickChallenge', GameData.prototype.PickChallenge);