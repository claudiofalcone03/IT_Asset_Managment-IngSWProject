-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: localhost    Database: it_asset_manager1
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
-- Table structure for table `Accessori`
--

DROP TABLE IF EXISTS `Accessori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Accessori` (
  `id` int NOT NULL AUTO_INCREMENT,
  `immagine` varchar(255) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `modello` varchar(100) DEFAULT NULL,
  `quantita_totale` int NOT NULL,
  `quantita_disponibile` int NOT NULL,
  `dipendente_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dipendente_id` (`dipendente_id`),
  CONSTRAINT `accessori_ibfk_1` FOREIGN KEY (`dipendente_id`) REFERENCES `Dipendente` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Accessori`
--

LOCK TABLES `Accessori` WRITE;
/*!40000 ALTER TABLE `Accessori` DISABLE KEYS */;
/*!40000 ALTER TABLE `Accessori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Asset`
--

DROP TABLE IF EXISTS `Asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Asset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_asset` varchar(100) NOT NULL,
  `device_image` varchar(255) DEFAULT NULL,
  `seriale` varchar(50) NOT NULL,
  `modello` varchar(100) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `status` enum('disponibile','assegnato','in manutenzione','disattivato') DEFAULT 'disponibile',
  `dipendente_id` int DEFAULT NULL,
  `costo_acquisto` decimal(10,2) DEFAULT NULL,
  `valore_attuale` decimal(10,2) DEFAULT NULL,
  `data_acquisto` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seriale` (`seriale`),
  KEY `dipendente_id` (`dipendente_id`),
  CONSTRAINT `asset_ibfk_1` FOREIGN KEY (`dipendente_id`) REFERENCES `Dipendente` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Asset`
--

LOCK TABLES `Asset` WRITE;
/*!40000 ALTER TABLE `Asset` DISABLE KEYS */;
/*!40000 ALTER TABLE `Asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Componenti`
--

DROP TABLE IF EXISTS `Componenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Componenti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `seriale` varchar(100) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `modello` varchar(100) DEFAULT NULL,
  `quantita_totale` int NOT NULL,
  `quantita_disponibile` int NOT NULL,
  `data_acquisto` date DEFAULT NULL,
  `costo_acquisto` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seriale` (`seriale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Componenti`
--

LOCK TABLES `Componenti` WRITE;
/*!40000 ALTER TABLE `Componenti` DISABLE KEYS */;
/*!40000 ALTER TABLE `Componenti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Consumabili`
--

DROP TABLE IF EXISTS `Consumabili`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Consumabili` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `modello` varchar(100) DEFAULT NULL,
  `quantita_totale` int NOT NULL,
  `quantita_rimanenti` int NOT NULL,
  `numero_ordine` varchar(100) DEFAULT NULL,
  `data_acquisto` date DEFAULT NULL,
  `costo_acquisto` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Consumabili`
--

LOCK TABLES `Consumabili` WRITE;
/*!40000 ALTER TABLE `Consumabili` DISABLE KEYS */;
/*!40000 ALTER TABLE `Consumabili` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dipendente`
--

DROP TABLE IF EXISTS `Dipendente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Dipendente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cognome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `reparto` varchar(100) DEFAULT NULL,
  `ruolo` varchar(100) DEFAULT NULL,
  `grado` enum('capo','co-capo','dipendente') DEFAULT 'dipendente',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dipendente`
--

LOCK TABLES `Dipendente` WRITE;
/*!40000 ALTER TABLE `Dipendente` DISABLE KEYS */;
/*!40000 ALTER TABLE `Dipendente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Licenze`
--

DROP TABLE IF EXISTS `Licenze`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Licenze` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_licenza` varchar(100) NOT NULL,
  `product_key` varchar(255) NOT NULL,
  `data_scadenza` date NOT NULL,
  `data_acquisto` date NOT NULL,
  `email_legata` varchar(100) DEFAULT NULL,
  `azienda` varchar(100) DEFAULT NULL,
  `quantita_totale` int NOT NULL,
  `quantita_disponibile` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_key` (`product_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Licenze`
--

LOCK TABLES `Licenze` WRITE;
/*!40000 ALTER TABLE `Licenze` DISABLE KEYS */;
/*!40000 ALTER TABLE `Licenze` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-10 12:42:32
