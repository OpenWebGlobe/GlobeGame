-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gg_highscore`
--

CREATE TABLE IF NOT EXISTS `gg_highscore` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `hash` varchar(32) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `score` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Daten für Tabelle `gg_highscore`
--