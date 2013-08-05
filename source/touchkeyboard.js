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
/* GUI Elements */
goog.provide('owg.gg.TouchKeyboard');
goog.require('owg.gg.Button01');
goog.require('owg.gg.Button02');
//-----------------------------------------------------------------------------
/**
 * @class TouchKeyboard
 * @constructor
 *
 * @description touchkeyboard ui component
 *
 * @author Robert Wüest robert.wst@gmail.ch
 *
 * @param {Object} layer
 * @param {string} name
 * @param {number} x
 * @param {number} y
 * @param {string} caption
 * @param {(function({string})|null)} callback
 */
function TouchKeyboard(layer, name, x, y, caption, callback) {
   this.caption = caption;
   this.destroyed = false;
   this.callback = callback;
   this.layer = layer;
   this.x = x;
   this.y = y;
   this.oX = x + 8;
   this.oY = y + 38;
   this.input = "";
   var that = this;
   var height = 390;
   var width = 853;

   this.shape = new Kinetic.Shape({drawFunc: function (canvas) {
      var ctx = canvas.getContext();
      ctx.beginPath();
      ctx.rect(that.x, that.y, width, height);
      var grad = ctx.createLinearGradient(x, y, x, y + height);
      grad.addColorStop(0, "#555"); // light blue
      grad.addColorStop(1, "#CCC"); // dark blue
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#FFF";
      ctx.stroke();
      ctx.textAlign = "left";
      ctx.fillStyle = "#FFF";
      ctx.font = "16pt TitanOne";
      ctx.fillText(caption + that.input + "_", x + 20, y + 30);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000"; // stroke color
      ctx.strokeText(caption + that.input + "_", x + 20, y + 30);
      canvas.fillStroke(this);
   }});
   layer.add(this.shape);
   this.Append = function (sender) {
      that.input = that.input + sender.caption;
   };
   this.OnOkay = function (sender) {
      if (that.callback)
         that.callback(that.input);
   };
   this.Backspace = function () {
      that.input = that.input.substring(0, that.input.length - 1);
   };
   this.Space = function () {
      that.input = that.input + " ";
   };
   this.AppendKeyCode = function(key)
   {
      that.input = that.input + String.fromCharCode(key).toUpperCase();
   }
   /* buttons */
   this.spaceButton = new Button01(layer, "btn_space", this.oX + 267, this.oY + 276, 300, 69, " ", 15);
   this.spaceButton.onClickEvent = this.Space;
   this.buttonArray = [
      new Button02(layer, "btn_1", this.oX, this.oY, 76, 69, "1", 15, this.Append),
      new Button02(layer, "btn_2", this.oX + 76, this.oY, 76, 69, "2", 15, this.Append),
      new Button02(layer, "btn_3", this.oX + 152, this.oY, 76, 69, "3", 15, this.Append),
      new Button02(layer, "btn_4", this.oX + 228, this.oY, 76, 69, "4", 15, this.Append),
      new Button02(layer, "btn_5", this.oX + 304, this.oY, 76, 69, "5", 15, this.Append),
      new Button02(layer, "btn_6", this.oX + 380, this.oY, 76, 69, "6", 15, this.Append),
      new Button02(layer, "btn_7", this.oX + 456, this.oY, 76, 69, "7", 15, this.Append),
      new Button02(layer, "btn_8", this.oX + 532, this.oY, 76, 69, "8", 15, this.Append),
      new Button02(layer, "btn_9", this.oX + 608, this.oY, 76, 69, "9", 15, this.Append),
      new Button02(layer, "btn_0", this.oX + 684, this.oY, 76, 69, "0", 15, this.Append),
      new Button02(layer, "btn_back", this.oX + 760, this.oY, 76, 69, "<-", 15, this.Backspace),

      new Button02(layer, "btn_q", this.oX + 38, this.oY + 69, 76, 69, "Q", 15, this.Append),
      new Button02(layer, "btn_w", this.oX + 38 + 76, this.oY + 69, 76, 69, "W", 15, this.Append),
      new Button02(layer, "btn_e", this.oX + 38 + 152, this.oY + 69, 76, 69, "E", 15, this.Append),
      new Button02(layer, "btn_r", this.oX + 38 + 228, this.oY + 69, 76, 69, "R", 15, this.Append),
      new Button02(layer, "btn_t", this.oX + 38 + 304, this.oY + 69, 76, 69, "T", 15, this.Append),
      new Button02(layer, "btn_z", this.oX + 38 + 380, this.oY + 69, 76, 69, "Z", 15, this.Append),
      new Button02(layer, "btn_u", this.oX + 38 + 456, this.oY + 69, 76, 69, "U", 15, this.Append),
      new Button02(layer, "btn_i", this.oX + 38 + 532, this.oY + 69, 76, 69, "I", 15, this.Append),
      new Button02(layer, "btn_o", this.oX + 38 + 608, this.oY + 69, 76, 69, "O", 15, this.Append),
      new Button02(layer, "btn_p", this.oX + 38 + 684, this.oY + 69, 76, 69, "P", 15, this.Append),

      new Button02(layer, "btn_a", this.oX + 76, this.oY + 138, 76, 69, "A", 15, this.Append),
      new Button02(layer, "btn_s", this.oX + 76 + 76, this.oY + 138, 76, 69, "S", 15, this.Append),
      new Button02(layer, "btn_d", this.oX + 76 + 152, this.oY + 138, 76, 69, "D", 15, this.Append),
      new Button02(layer, "btn_f", this.oX + 76 + 228, this.oY + 138, 76, 69, "F", 15, this.Append),
      new Button02(layer, "btn_g", this.oX + 76 + 304, this.oY + 138, 76, 69, "G", 15, this.Append),
      new Button02(layer, "btn_h", this.oX + 76 + 380, this.oY + 138, 76, 69, "H", 15, this.Append),
      new Button02(layer, "btn_j", this.oX + 76 + 456, this.oY + 138, 76, 69, "J", 15, this.Append),
      new Button02(layer, "btn_k", this.oX + 76 + 532, this.oY + 138, 76, 69, "K", 15, this.Append),
      new Button02(layer, "btn_l", this.oX + 76 + 608, this.oY + 138, 76, 69, "L", 15, this.Append),

      new Button02(layer, "btn_y", this.oX + 38, this.oY + 207, 76, 69, "Y", 15, this.Append),
      new Button02(layer, "btn_x", this.oX + 38 + 76, this.oY + 207, 76, 69, "X", 15, this.Append),
      new Button02(layer, "btn_c", this.oX + 38 + 152, this.oY + 207, 76, 69, "C", 15, this.Append),
      new Button02(layer, "btn_v", this.oX + 38 + 228, this.oY + 207, 76, 69, "V", 15, this.Append),
      new Button02(layer, "btn_b", this.oX + 38 + 304, this.oY + 207, 76, 69, "B", 15, this.Append),
      new Button02(layer, "btn_n", this.oX + 38 + 380, this.oY + 207, 76, 69, "N", 15, this.Append),
      new Button02(layer, "btn_m", this.oX + 38 + 456, this.oY + 207, 76, 69, "M", 15, this.Append),
      new Button02(layer, "btn_ae", this.oX + 38 + 532, this.oY + 207, 76, 69, "Ä", 15, this.Append),
      new Button02(layer, "btn_oe", this.oX + 38 + 608, this.oY + 207, 76, 69, "Ö", 15, this.Append),
      new Button02(layer, "btn_ue", this.oX + 38 + 684, this.oY + 207, 76, 69, "Ü", 15, this.Append),

      new Button02(layer, "btn_ue", this.oX + 760, this.oY + 276, 76, 69, "OK", 15, this.OnOkay)
   ];
}

//-----------------------------------------------------------------------------
/**
 * @description destroy button
 */
TouchKeyboard.prototype.Destroy = function () {
   this.shape.remove();
   this.destroyed = true;
   for (var i = 0; i < this.buttonArray.length; i++) {
      this.buttonArray[i].Destroy();
   }
   this.spaceButton.Destroy();
};