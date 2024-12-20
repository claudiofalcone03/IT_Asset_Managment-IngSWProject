-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: localhost    Database: it_asset_manager2
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accessori`
--

DROP TABLE IF EXISTS `accessori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accessori` (
  `seriale` varchar(255) NOT NULL,
  `nome_prodotto` varchar(100) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `modello` varchar(100) DEFAULT NULL,
  `immagine` longblob,
  `id_dipendente` int DEFAULT NULL,
  `costo_acquisto` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`seriale`),
  KEY `id_dipendente` (`id_dipendente`),
  CONSTRAINT `accessori_ibfk_1` FOREIGN KEY (`id_dipendente`) REFERENCES `dipendente` (`ID_dipendente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accessori`
--

LOCK TABLES `accessori` WRITE;
/*!40000 ALTER TABLE `accessori` DISABLE KEYS */;
/*!40000 ALTER TABLE `accessori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset` (
  `seriale` varchar(50) NOT NULL,
  `nome_asset` varchar(100) NOT NULL,
  `immagine` longblob,
  `modello` varchar(100) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `status` enum('attivo','inattivo','archiviato','richiedibili','in attesa') DEFAULT NULL,
  `costo_acquisto` decimal(10,2) DEFAULT NULL,
  `valore_corrente` decimal(10,2) DEFAULT NULL,
  `dipendente_ID` int DEFAULT NULL,
  PRIMARY KEY (`seriale`),
  KEY `dipendente_ID` (`dipendente_ID`),
  CONSTRAINT `asset_ibfk_1` FOREIGN KEY (`dipendente_ID`) REFERENCES `dipendente` (`ID_dipendente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dipartimento`
--

DROP TABLE IF EXISTS `dipartimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dipartimento` (
  `id_dipartimento` int NOT NULL AUTO_INCREMENT,
  `nome_dipartimento` varchar(100) NOT NULL,
  PRIMARY KEY (`id_dipartimento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dipartimento`
--

LOCK TABLES `dipartimento` WRITE;
/*!40000 ALTER TABLE `dipartimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `dipartimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dipartimento_sede`
--

DROP TABLE IF EXISTS `dipartimento_sede`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dipartimento_sede` (
  `id_dipartimento` int NOT NULL,
  `id_sede` int NOT NULL,
  PRIMARY KEY (`id_dipartimento`,`id_sede`),
  KEY `id_sede` (`id_sede`),
  CONSTRAINT `dipartimento_sede_ibfk_1` FOREIGN KEY (`id_dipartimento`) REFERENCES `dipartimento` (`id_dipartimento`),
  CONSTRAINT `dipartimento_sede_ibfk_2` FOREIGN KEY (`id_sede`) REFERENCES `sedi` (`id_sede`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dipartimento_sede`
--

LOCK TABLES `dipartimento_sede` WRITE;
/*!40000 ALTER TABLE `dipartimento_sede` DISABLE KEYS */;
/*!40000 ALTER TABLE `dipartimento_sede` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dipendente`
--

DROP TABLE IF EXISTS `dipendente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dipendente` (
  `ID_dipendente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `grado` varchar(50) DEFAULT NULL,
  `sede` varchar(50) DEFAULT NULL,
  `id_dipartimento` int DEFAULT NULL,
  `id_sede` int DEFAULT NULL,
  PRIMARY KEY (`ID_dipendente`),
  UNIQUE KEY `email` (`email`),
  KEY `id_dipartimento` (`id_dipartimento`),
  KEY `id_sede` (`id_sede`),
  CONSTRAINT `dipendente_ibfk_1` FOREIGN KEY (`id_dipartimento`) REFERENCES `dipartimento` (`id_dipartimento`),
  CONSTRAINT `dipendente_ibfk_2` FOREIGN KEY (`id_sede`) REFERENCES `sedi` (`id_sede`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dipendente`
--

LOCK TABLES `dipendente` WRITE;
/*!40000 ALTER TABLE `dipendente` DISABLE KEYS */;
/*!40000 ALTER TABLE `dipendente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licenze`
--

DROP TABLE IF EXISTS `licenze`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licenze` (
  `product_key` varchar(255) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `data_acquisto` date NOT NULL,
  `data_scadenza` date NOT NULL,
  `id_dipartimento` int DEFAULT NULL,
  `prezzo` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`product_key`),
  KEY `id_dipartimento` (`id_dipartimento`),
  CONSTRAINT `licenze_ibfk_1` FOREIGN KEY (`id_dipartimento`) REFERENCES `dipartimento` (`id_dipartimento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licenze`
--

LOCK TABLES `licenze` WRITE;
/*!40000 ALTER TABLE `licenze` DISABLE KEYS */;
/*!40000 ALTER TABLE `licenze` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sedi`
--

DROP TABLE IF EXISTS `sedi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sedi` (
  `id_sede` int NOT NULL AUTO_INCREMENT,
  `nome_sede` varchar(100) NOT NULL,
  `località` varchar(100) NOT NULL,
  `posti_totali` int NOT NULL,
  `posti_ocupati` int DEFAULT '0',
  `posti_rimanenti` int DEFAULT '0',
  PRIMARY KEY (`id_sede`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sedi`
--

LOCK TABLES `sedi` WRITE;
/*!40000 ALTER TABLE `sedi` DISABLE KEYS */;
/*!40000 ALTER TABLE `sedi` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-24 10:43:31
