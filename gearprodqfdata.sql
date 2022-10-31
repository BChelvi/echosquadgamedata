-- phpMyAdmin SQL Dump
-- version OVH
-- https://www.phpmyadmin.net/
--
-- Hôte : gearprodqfdata.mysql.db
-- Généré le : jeu. 27 oct. 2022 à 14:26
-- Version du serveur : 5.7.40-log
-- Version de PHP : 7.4.25

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
-- Structure de la table `GameEvent`
--

CREATE TABLE `GameEvent` (
  `Id` int(11) NOT NULL,
  `GameSessionId` int(11) NOT NULL,
  `DateTime` datetime NOT NULL,
  `WorldPosition` text NOT NULL,
  `Category` text NOT NULL,
  `Value_1` text,
  `Value_2` text,
  `Value_3` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `GameSession`
--

CREATE TABLE `GameSession` (
  `Id` int(11) NOT NULL,
  `RoomSessionId` int(11) NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime DEFAULT NULL,
  `MissionId` int(11) NOT NULL,
  `Language` text NOT NULL,
  `IsActive` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `GameSession`
--

INSERT INTO `GameSession` (`Id`, `RoomSessionId`, `StartDate`, `EndDate`, `MissionId`, `Language`, `IsActive`) VALUES
(71, 43, '2022-10-26 14:05:40', '2022-10-26 14:15:40', 3, 'French', 0),
(72, 44, '2022-10-26 15:05:13', NULL, 3, 'French', 1),
(73, 45, '2022-10-26 15:07:29', NULL, 3, 'French', 1),
(74, 46, '2022-10-27 11:01:11', '2022-10-27 11:09:39', 4, 'French', 0),
(75, 46, '2022-10-27 11:09:55', '2022-10-27 11:13:03', 4, 'French', 0),
(76, 46, '2022-10-27 11:13:22', '2022-10-27 11:17:06', 4, 'French', 0),
(77, 46, '2022-10-27 11:17:35', '2022-10-27 11:20:17', 1, 'French', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Mission`
--

CREATE TABLE `Mission` (
  `Id` int(11) NOT NULL,
  `Name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Mission`
--

INSERT INTO `Mission` (`Id`, `Name`) VALUES
(0, 'BasePlayable'),
(1, 'En eaux troubles (60min)'),
(2, 'Battle Mission'),
(3, 'Teaser'),
(4, 'En eaux troubles (45min)');

-- --------------------------------------------------------

--
-- Structure de la table `Room`
--

CREATE TABLE `Room` (
  `Id` int(11) NOT NULL,
  `SiteId` int(11) NOT NULL,
  `Name` text NOT NULL,
  `Verbosity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Room`
--

INSERT INTO `Room` (`Id`, `SiteId`, `Name`, `Verbosity`) VALUES
(348300, 1, 'SM', NULL),
(348301, 1, 'Valentin (GP)', 0),
(348307, 1, 'Valentin (Remote)', NULL),
(3483012, 1, 'Prototype', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `RoomSession`
--

CREATE TABLE `RoomSession` (
  `Id` int(11) NOT NULL,
  `RoomId` int(11) NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `RoomSession`
--

INSERT INTO `RoomSession` (`Id`, `RoomId`, `StartDate`, `EndDate`, `IsActive`) VALUES
(43, 348300, '2022-10-26 14:02:55', '2022-10-26 14:20:09', 0),
(44, 348300, '2022-10-26 15:04:11', '2022-10-26 15:06:22', 0),
(45, 348300, '2022-10-26 15:06:28', '2022-10-26 15:10:59', 0),
(46, 348300, '2022-10-27 10:59:22', '2022-10-27 11:21:09', 0);

-- --------------------------------------------------------

--
-- Structure de la table `Site`
--

CREATE TABLE `Site` (
  `Id` int(11) NOT NULL,
  `Name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `Site`
--

INSERT INTO `Site` (`Id`, `Name`) VALUES
(1, 'GearProd');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `GameEvent`
--
ALTER TABLE `GameEvent`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `GameSessionId` (`GameSessionId`);

--
-- Index pour la table `GameSession`
--
ALTER TABLE `GameSession`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `RoomSessionId` (`RoomSessionId`),
  ADD KEY `MissionId` (`MissionId`);

--
-- Index pour la table `Mission`
--
ALTER TABLE `Mission`
  ADD PRIMARY KEY (`Id`);

--
-- Index pour la table `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `SiteId` (`SiteId`);

--
-- Index pour la table `RoomSession`
--
ALTER TABLE `RoomSession`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `RoomId` (`RoomId`);

--
-- Index pour la table `Site`
--
ALTER TABLE `Site`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `GameEvent`
--
ALTER TABLE `GameEvent`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `GameSession`
--
ALTER TABLE `GameSession`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT pour la table `RoomSession`
--
ALTER TABLE `RoomSession`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT pour la table `Site`
--
ALTER TABLE `Site`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `GameEvent`
--
ALTER TABLE `GameEvent`
  ADD CONSTRAINT `GameSessionId` FOREIGN KEY (`GameSessionId`) REFERENCES `GameSession` (`Id`);

--
-- Contraintes pour la table `GameSession`
--
ALTER TABLE `GameSession`
  ADD CONSTRAINT `MissionId` FOREIGN KEY (`MissionId`) REFERENCES `Mission` (`Id`),
  ADD CONSTRAINT `RoomSessionId` FOREIGN KEY (`RoomSessionId`) REFERENCES `RoomSession` (`Id`);

--
-- Contraintes pour la table `Room`
--
ALTER TABLE `Room`
  ADD CONSTRAINT `SiteId` FOREIGN KEY (`SiteId`) REFERENCES `Site` (`Id`);

--
-- Contraintes pour la table `RoomSession`
--
ALTER TABLE `RoomSession`
  ADD CONSTRAINT `RoomId` FOREIGN KEY (`RoomId`) REFERENCES `Room` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
