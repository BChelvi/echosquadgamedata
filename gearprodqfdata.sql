-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 12 déc. 2022 à 17:21
-- Version du serveur : 10.4.24-MariaDB
-- Version de PHP : 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gearprodqfdata`
--

-- --------------------------------------------------------

--
-- Structure de la table `gameevent`
--

CREATE TABLE `gameevent` (
  `gameeventId` int(11) NOT NULL,
  `GameSessionId` int(11) NOT NULL,
  `DateTime` datetime NOT NULL,
  `WorldPosition` text NOT NULL,
  `Category` text NOT NULL,
  `Value_1` text DEFAULT NULL,
  `Value_2` text DEFAULT NULL,
  `Value_3` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `gameevent`
--

INSERT INTO `gameevent` (`gameeventId`, `GameSessionId`, `DateTime`, `WorldPosition`, `Category`, `Value_1`, `Value_2`, `Value_3`) VALUES
(1, 108, '2022-12-06 10:31:58', '123.5888,78.51,55.738', '1', '', '', ''),
(2, 108, '2022-12-06 10:31:58', '123.5888,78.51,55.738', '1', '', '', ''),
(3, 108, '2022-12-06 10:31:58', '123.5888,78.51,55.738', '1', '3000', '250', '0'),
(5, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '1', '3000', '250', '0'),
(6, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '2', '3000', '250', '0'),
(7, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '2', '3000', '250', '0'),
(8, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '2', '3000', '250', '0'),
(9, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '3', '3000', '250', '0'),
(10, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '3', '3000', '250', '0'),
(11, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '2', '3000', '250', '0'),
(12, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '2', '3000', '250', '0'),
(17, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '1', '3000', '250', '0'),
(18, 109, '2022-12-06 10:51:58', '123.5888,78.51,55.738', '1', '3000', '250', '0'),
(21, 110, '2022-12-08 08:57:32', '123.5888,78.51,55.738', '0', 'mine', '0', '0'),
(22, 111, '2022-12-08 13:28:53', '10,10,55.738', '2', '1', '0', '0'),
(23, 111, '2022-12-08 13:28:53', '15,10,51,55.738', '2', '1', '0', '0'),
(24, 111, '2022-12-08 13:28:53', '20,20,55.738', '2', '1', '0', '0'),
(25, 111, '2022-12-08 13:28:53', '25,20,55.738', '2', '1', '0', '0'),
(27, 115, '2022-12-13 10:02:44', '100,0,100', '2', 'south', '0', '0'),
(28, 115, '2022-12-13 10:08:44', '100,0,100', '1', '0', '0', '0'),
(29, 115, '2022-12-13 10:14:44', '100,0,100', '0', 'mine', '0', '0'),
(30, 115, '2022-12-13 10:25:44', '100,0,100', '0', 'grospoisson', '0', '0'),
(31, 115, '2022-12-13 10:25:44', '0,0,0', '2', 'south', '0', '0'),
(32, 115, '2022-12-13 10:25:44', '10,0,10', '2', 'south', '0', '0'),
(33, 115, '2022-12-13 10:25:44', '15,0,15', '2', 'south', '0', '0'),
(34, 115, '2022-12-13 10:25:44', '20,0,20', '2', 'south', '0', '0'),
(43, 115, '2022-12-13 10:25:44', '20,0,30', '2', 'south', '0', '0'),
(44, 115, '2022-12-13 10:25:44', '20,0,30', '2', 'south', '0', '0'),
(45, 115, '2022-12-13 10:25:44', '25,0,35', '2', 'south', '0', '0'),
(46, 115, '2022-12-13 10:25:44', '25,0,50', '2', 'south', '0', '0'),
(47, 115, '2022-12-13 10:25:44', '40,0,70', '2', 'south', '0', '0'),
(48, 115, '2022-12-13 10:25:44', '90,0,70', '2', 'south', '0', '0'),
(49, 115, '2022-12-13 10:25:44', '120,0,100', '2', 'south', '0', '0'),
(50, 115, '2022-12-13 10:25:44', '120,0,150', '2', 'south', '0', '0');

-- --------------------------------------------------------

--
-- Structure de la table `gamesession`
--

CREATE TABLE `gamesession` (
  `gamesessionId` int(11) NOT NULL,
  `RoomSessionId` int(11) NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime DEFAULT NULL,
  `Duration` int(11) NOT NULL,
  `MissionId` int(11) NOT NULL,
  `Succes` int(11) DEFAULT NULL,
  `Language` text NOT NULL,
  `IsActive` int(11) NOT NULL,
  `Deaths` int(11) DEFAULT NULL,
  `Redbuttons` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `gamesession`
--

INSERT INTO `gamesession` (`gamesessionId`, `RoomSessionId`, `StartDate`, `EndDate`, `Duration`, `MissionId`, `Succes`, `Language`, `IsActive`, `Deaths`, `Redbuttons`) VALUES
(71, 43, '2022-10-26 14:05:40', '2022-10-26 14:15:40', 640, 4, 1, 'French', 0, NULL, NULL),
(72, 44, '2022-10-26 15:05:13', NULL, 0, 3, 0, 'French', 1, NULL, NULL),
(73, 45, '2022-10-26 15:07:29', NULL, 0, 3, 0, 'French', 1, NULL, NULL),
(74, 46, '2022-10-27 11:01:11', '2022-10-27 11:09:39', 480, 4, 0, 'French', 0, NULL, NULL),
(75, 46, '2022-10-27 11:09:55', '2022-10-27 11:13:03', 240, 4, 0, 'French', 0, NULL, NULL),
(76, 46, '2022-10-27 11:13:22', '2022-10-27 11:17:06', 160, 4, 0, 'French', 0, NULL, NULL),
(77, 46, '2022-10-27 11:17:35', '2022-10-27 11:20:17', 180, 1, 0, 'French', 0, NULL, NULL),
(78, 47, '2022-10-27 16:18:23', '2022-10-27 17:21:50', 180, 1, 0, 'French', 0, NULL, NULL),
(79, 48, '2022-10-28 09:54:21', '2022-10-28 10:21:48', 1300, 4, 3, 'English', 0, NULL, NULL),
(80, 48, '2022-10-28 10:29:03', '2022-10-28 10:37:51', 480, 3, 0, 'English', 0, NULL, NULL),
(81, 48, '2022-10-28 10:40:58', NULL, 0, 2, 0, 'English', 1, NULL, NULL),
(82, 49, '2022-10-28 10:41:01', NULL, 0, 2, 0, 'French', 1, NULL, NULL),
(83, 50, '2022-10-28 10:49:25', '2022-10-28 13:52:28', 180, 2, 0, 'English', 0, NULL, NULL),
(84, 51, '2022-10-28 13:53:03', '2022-10-28 13:55:36', 120, 4, 0, 'English', 0, NULL, NULL),
(85, 52, '2022-10-28 15:55:38', '2022-10-28 15:56:36', 60, 4, 0, 'English', 0, NULL, NULL),
(86, 52, '2022-10-28 15:57:07', NULL, 0, 3, 0, 'English', 1, NULL, NULL),
(87, 53, '2022-10-31 15:41:40', NULL, 0, 3, 0, 'English', 1, NULL, NULL),
(88, 53, '2022-10-31 15:41:40', NULL, 0, 3, 0, 'English', 1, NULL, NULL),
(90, 57, '2022-11-03 13:59:25', '2022-11-03 14:00:00', 0, 4, 0, 'English', 0, NULL, NULL),
(91, 57, '2022-11-03 14:00:26', '2022-11-03 14:00:56', 0, 2, 0, 'English', 0, NULL, NULL),
(92, 57, '2022-11-03 14:01:07', '2022-11-03 14:01:10', 0, 4, 0, 'French', 0, NULL, NULL),
(93, 58, '2022-11-03 14:34:00', '2022-11-03 15:37:49', 3600, 4, 4, 'French', 0, NULL, NULL),
(94, 58, '2022-11-03 15:39:05', '2022-11-03 16:01:30', 2400, 2, 3, 'French', 0, NULL, NULL),
(95, 59, '2022-11-03 15:40:06', '2022-11-03 16:01:39', 2400, 1, 2, 'French', 0, NULL, NULL),
(96, 58, '2022-11-03 16:07:56', '2022-11-03 16:50:45', 4000, 2, 1, 'French', 0, NULL, NULL),
(97, 59, '2022-11-03 16:07:59', '2022-11-03 16:12:56', 300, 2, 0, 'French', 0, NULL, NULL),
(98, 59, '2022-11-03 16:13:04', '2022-11-03 16:17:39', 300, 2, 0, 'French', 0, NULL, NULL),
(99, 58, '2022-11-03 16:13:07', '2022-11-03 16:17:03', 300, 2, 0, 'French', 0, NULL, NULL),
(100, 61, '2022-11-14 14:06:42', NULL, 0, 3, 0, 'French', 1, NULL, NULL),
(101, 65, '2022-12-22 16:20:10', '2022-11-22 16:40:10', 1200, 1, 1, '', 0, NULL, NULL),
(102, 66, '2023-01-02 16:20:10', '2023-01-02 16:50:10', 1800, 1, 2, '', 0, NULL, NULL),
(103, 68, '2022-12-01 10:55:02', '2022-12-01 11:25:03', 2000, 1, 0, '', 0, NULL, NULL),
(104, 68, '2022-12-01 10:55:02', '2022-12-01 11:00:03', 300, 2, 4, '', 1, NULL, NULL),
(108, 97, '2022-12-06 10:31:56', '2022-12-06 10:33:59', 0, 1, 0, 'French', 0, NULL, NULL),
(109, 97, '2022-12-06 10:49:43', '2022-12-06 14:47:36', 14273, 1, 2, 'French', 0, 5, 2),
(110, 98, '2022-12-08 08:57:32', '2022-12-08 09:20:23', 1371, 4, 2, 'French', 0, 1, 0),
(111, 99, '2022-12-08 13:28:53', '2022-12-08 14:53:16', 5063, 2, 2, 'French', 0, 0, 0),
(115, 102, '2022-12-13 10:02:44', '2022-12-13 10:40:44', 2280, 4, 4, 'French', 0, 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `mission`
--

CREATE TABLE `mission` (
  `missionId` int(11) NOT NULL,
  `Name` text NOT NULL,
  `CodeName` varchar(255) NOT NULL,
  `MinDuration` int(11) NOT NULL,
  `DisplayInCalendar` int(11) NOT NULL,
  `Dimension` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `mission`
--

INSERT INTO `mission` (`missionId`, `Name`, `CodeName`, `MinDuration`, `DisplayInCalendar`, `Dimension`) VALUES
(0, 'BasePlayable', 'BasePlay', 600, 0, ''),
(1, 'En eaux troubles (60min)', 'EauxTrouble60', 600, 1, '500,500'),
(2, 'Battle Mission', 'Battle', 600, 1, '500,500'),
(3, 'Teaser', 'Teaser', 600, 0, ''),
(4, 'En eaux troubles (45min)', 'EauxTrouble45', 600, 1, '300,300');

-- --------------------------------------------------------

--
-- Structure de la table `room`
--

CREATE TABLE `room` (
  `roomId` int(11) NOT NULL,
  `SiteId` int(11) NOT NULL,
  `Name` text NOT NULL,
  `Color` varchar(255) NOT NULL,
  `Verbosity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `room`
--

INSERT INTO `room` (`roomId`, `SiteId`, `Name`, `Color`, `Verbosity`) VALUES
(348300, 1, 'SM', '#b1c3ff', NULL),
(348301, 1, 'Valentin (GP)', '#f9ffa7', 0),
(348307, 1, 'Valentin (Remote)', '#ffa7a7', NULL),
(3483012, 1, 'Prototype', '#b5ffa7', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `roomsession`
--

CREATE TABLE `roomsession` (
  `roomsessionId` int(11) NOT NULL,
  `RoomId` int(11) NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `roomsession`
--

INSERT INTO `roomsession` (`roomsessionId`, `RoomId`, `StartDate`, `EndDate`, `IsActive`) VALUES
(43, 348300, '2022-10-26 14:02:55', '2022-10-26 14:20:09', 0),
(44, 348300, '2022-10-26 15:04:11', '2022-10-26 15:06:22', 0),
(45, 348300, '2022-10-26 15:06:28', '2022-10-26 15:10:59', 0),
(46, 348300, '2022-10-27 10:59:22', '2022-10-27 11:21:09', 0),
(47, 348300, '2022-10-27 16:12:29', '2022-10-27 17:30:51', 0),
(48, 348300, '2022-10-27 18:06:07', NULL, 1),
(49, 3483012, '2022-10-28 10:38:13', '2022-10-28 10:47:17', 0),
(50, 348300, '2022-10-28 10:48:16', '2022-10-28 10:52:21', 0),
(51, 348300, '2022-10-28 13:51:40', '2022-10-28 15:25:09', 0),
(52, 348300, '2022-10-28 15:50:41', '2022-10-28 16:03:01', 0),
(53, 348300, '2022-10-31 15:38:59', '2022-10-31 15:41:53', 0),
(54, 348300, '2022-10-31 15:38:59', NULL, 1),
(55, 348300, '2022-11-03 13:52:21', NULL, 1),
(56, 348300, '2022-11-03 13:56:03', NULL, 1),
(57, 348300, '2022-11-03 13:57:32', '2022-11-03 14:01:16', 0),
(58, 348300, '2022-11-03 14:06:02', NULL, 1),
(59, 3483012, '2022-11-03 15:38:29', '2022-11-03 16:17:50', 0),
(60, 348300, '2022-11-14 11:37:57', '2022-11-14 14:04:26', 0),
(61, 348300, '2022-11-14 14:05:59', NULL, 1),
(63, 348300, '2022-11-22 16:18:10', '2022-12-31 16:48:10', 0),
(64, 348300, '2023-01-02 16:18:10', '2023-01-03 16:18:10', 0),
(65, 348300, '2022-12-22 16:18:10', '2022-12-31 16:48:10', 0),
(66, 348300, '2023-01-02 16:18:10', '2023-01-03 16:18:10', 0),
(67, 348301, '2022-12-01 10:54:02', '2022-12-01 14:20:02', 0),
(68, 348301, '2022-12-01 10:54:02', '2022-12-01 14:20:02', 1),
(69, 348300, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0),
(70, 348301, '0000-00-00 00:00:00', NULL, 1),
(71, 348301, '0000-00-00 00:00:00', NULL, 1),
(72, 348300, '2022-12-06 09:49:23', NULL, 1),
(73, 348300, '2022-12-06 09:49:23', NULL, 1),
(74, 348300, '2022-12-06 09:49:23', NULL, 1),
(75, 348300, '2022-12-06 09:49:23', NULL, 1),
(76, 348300, '2022-12-06 09:49:23', NULL, 1),
(77, 348300, '2022-12-06 09:49:23', NULL, 1),
(78, 348300, '2022-12-06 09:49:23', NULL, 1),
(79, 348300, '2022-12-06 09:49:23', NULL, 1),
(80, 348300, '0000-00-00 00:00:00', NULL, 1),
(85, 348301, '2022-12-06 10:06:16', NULL, 1),
(86, 348301, '2022-12-06 10:06:16', NULL, 1),
(87, 348301, '2022-12-06 10:06:16', NULL, 1),
(88, 348301, '2022-12-06 10:06:16', NULL, 1),
(89, 348301, '2022-12-06 10:06:16', NULL, 1),
(90, 348301, '2022-12-06 10:06:16', NULL, 1),
(91, 348301, '2022-12-06 10:06:16', NULL, 1),
(92, 348301, '2022-12-06 10:06:16', NULL, 1),
(93, 348301, '2022-12-06 10:06:16', NULL, 1),
(94, 348301, '2022-12-06 10:06:16', NULL, 1),
(95, 348307, '2022-12-06 10:21:28', NULL, 1),
(96, 348307, '2022-12-06 10:21:28', NULL, 1),
(97, 348307, '2022-12-06 10:21:28', '2022-12-06 10:31:28', 0),
(98, 3483012, '2022-12-08 08:57:32', NULL, 1),
(99, 348301, '2022-12-08 13:28:53', NULL, 1),
(100, 348300, '2022-12-09 09:15:45', '2022-12-09 19:30:48', 0),
(102, 348300, '2022-12-13 09:02:44', '2022-12-13 17:02:44', 0);

-- --------------------------------------------------------

--
-- Structure de la table `site`
--

CREATE TABLE `site` (
  `siteId` int(11) NOT NULL,
  `Name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `site`
--

INSERT INTO `site` (`siteId`, `Name`) VALUES
(1, 'GearProd');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `gameevent`
--
ALTER TABLE `gameevent`
  ADD PRIMARY KEY (`gameeventId`),
  ADD KEY `GameSessionId` (`GameSessionId`);

--
-- Index pour la table `gamesession`
--
ALTER TABLE `gamesession`
  ADD PRIMARY KEY (`gamesessionId`),
  ADD KEY `RoomSessionId` (`RoomSessionId`),
  ADD KEY `MissionId` (`MissionId`);

--
-- Index pour la table `mission`
--
ALTER TABLE `mission`
  ADD PRIMARY KEY (`missionId`);

--
-- Index pour la table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`roomId`),
  ADD KEY `SiteId` (`SiteId`);

--
-- Index pour la table `roomsession`
--
ALTER TABLE `roomsession`
  ADD PRIMARY KEY (`roomsessionId`),
  ADD KEY `RoomId` (`RoomId`);

--
-- Index pour la table `site`
--
ALTER TABLE `site`
  ADD PRIMARY KEY (`siteId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `gameevent`
--
ALTER TABLE `gameevent`
  MODIFY `gameeventId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT pour la table `gamesession`
--
ALTER TABLE `gamesession`
  MODIFY `gamesessionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT pour la table `roomsession`
--
ALTER TABLE `roomsession`
  MODIFY `roomsessionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT pour la table `site`
--
ALTER TABLE `site`
  MODIFY `siteId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `gameevent`
--
ALTER TABLE `gameevent`
  ADD CONSTRAINT `GameSessionId` FOREIGN KEY (`GameSessionId`) REFERENCES `gamesession` (`gamesessionId`);

--
-- Contraintes pour la table `gamesession`
--
ALTER TABLE `gamesession`
  ADD CONSTRAINT `MissionId` FOREIGN KEY (`MissionId`) REFERENCES `mission` (`missionId`),
  ADD CONSTRAINT `RoomSessionId` FOREIGN KEY (`RoomSessionId`) REFERENCES `roomsession` (`roomsessionId`);

--
-- Contraintes pour la table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `SiteId` FOREIGN KEY (`SiteId`) REFERENCES `site` (`siteId`);

--
-- Contraintes pour la table `roomsession`
--
ALTER TABLE `roomsession`
  ADD CONSTRAINT `RoomId` FOREIGN KEY (`RoomId`) REFERENCES `room` (`roomId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
