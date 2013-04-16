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
goog.provide('owg.gg.Challenge');

//-----------------------------------------------------------------------------
/**
 * @class Challenge
 *
 * @description challenge base class
 * @constructor
 *
 * @author Robert Wüest robert.wst@gmail.ch
 * @param {number} type
 */
function Challenge(type) {
   /*
    0: Landmark question
    1: Picking question
    */
   this.type = type;
   this.baseScore = 0;
   this.destroyed = false;
   this.draftmode = false;
   var that = this;
   this.eventDestroyed = function () {
   };
   this.callback = function () {
   };
   this.Prepare = function () {
   };
   this.Activate = function () {
   };
   this.Destroy = function (event) {
   };
   this.OnDestroy = function () {
   };
   this.RegisterCallback = function (func) {
      that.callback = func;
   };
}
goog.exportSymbol('Challenge', Challenge);
