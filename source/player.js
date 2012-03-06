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
//-----------------------------------------------------------------------------
goog.provide('owg.gg.Player');

goog.require('owg.gg.FlyingText');
/**
 * @class Player
 * @constructor
 *
 * @description player object
 *
 * @author Robert Wüest robert.wst@gmail.ch
 *
 * @param {(string|null)} name
 */
function Player(name)
{
    this.playerName = name;
    this.playerScore = 0;
};
//-----------------------------------------------------------------------------
/**
 * @description score points for the player
 * @param {number} amount
 * @param {string} description
 */
Player.prototype.ScorePoints = function(amount, description)
{
    var text = new FlyingText(m_static, "+"+amount+" "+m_locale["points"]+" "+ description, "#00FF00");
    this.playerScore += amount;
};

goog.exportSymbol('Player', Player);
goog.exportProperty(Player.prototype, 'ScorePoints', Player.prototype.ScorePoints);