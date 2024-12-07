-- MySQL dump 10.13  Distrib 8.0.33, for macos13 (arm64)
--
-- Host: localhost    Database: login_db
-- ------------------------------------------------------
-- Server version	8.0.33

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
  `id_accessori` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `seriale` varchar(255) DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `modello` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_accessori`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accessori`
--

LOCK TABLES `accessori` WRITE;
/*!40000 ALTER TABLE `accessori` DISABLE KEYS */;
INSERT INTO `accessori` VALUES (1,'ipad','ABC123','tablet','iPad Pro 12.9'),(2,'computer','XYZ709','laptop','Dell XPS 13'),(3,'Smartphone','DEF789','Phone','iPhone 14'),(4,'Monitor','GHI012','Display','Samsung Odyssey G7'),(5,'Mouse','JKL345','Peripherals','Logitech MX Master 3'),(6,'Keyboard','MNO678','Peripherals','Apple Magic Keyboard');
/*!40000 ALTER TABLE `accessori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL,
  `collaboration` varchar(255) DEFAULT NULL,
  `device` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actions`
--

LOCK TABLES `actions` WRITE;
/*!40000 ALTER TABLE `actions` DISABLE KEYS */;
INSERT INTO `actions` VALUES (1,'2024-10-15 10:30:00','Mario Rossi','Installazione Software','IT Support','PC Desktop'),(2,'2024-10-14 09:00:00','Giulia Bianchi','Aggiornamento Firmware','Networking','Router'),(3,'2024-10-13 14:00:00','Luca Verdi','Riparazione Hardware','Tech Support','Laptop'),(4,'2024-10-12 10:30:00','Luca Donghia','Aggiornamento Firmware','Networking','Router'),(5,'2024-10-10 09:00:00','Sara Petrelli','Installazione Software','IT Support','PC Desktop'),(6,'2024-10-08 14:00:00','Gianluca Pignatelli','Riparazione Hardware','Tech Support','Computer'),(7,'2024-10-06 08:30:00','Alice Verdi','Configurazione Rete','Assistenza Tecnica','Laptop'),(8,'2024-10-05 13:45:00','Marco Bianchi','Upgrade Software','Supporto Clienti','Switch'),(9,'2024-10-04 16:00:00','Paolo Russo','Sostituzione Componente','Assistenza Hardware','PC Desktop');
/*!40000 ALTER TABLE `actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('Attivi','Inattivi','Archiviati','Richiedibili','In Attesa') NOT NULL DEFAULT 'Attivi',
  `data_inserimento` date DEFAULT NULL,
  `sede` varchar(255) DEFAULT NULL,
  `data_acquisto` date DEFAULT NULL,
  `costo` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'Computer','In Attesa','2024-10-01','Sede centrale','2024-09-29',500),(2,'Ipad','Richiedibili','2024-09-13','Sede filiale','2024-09-06',359),(3,'Tablet','Attivi','2024-02-29','Sede filiale','2024-02-24',233),(4,'Laptop','Inattivi','2024-11-15','Sede secondaria','2024-11-02',649),(5,'Tablet','Archiviati','2024-12-11','Sede principale','2024-12-07',429),(6,'Iphone','Attivi','2024-12-28','Sede principale','2024-12-27',1199),(7,'Laptop','Richiedibili','2024-07-12','Sede secondaria','2024-07-11',239.99);
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dipartimento`
--

DROP TABLE IF EXISTS `dipartimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dipartimento` (
  `id_dip` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_dip`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dipartimento`
--

LOCK TABLES `dipartimento` WRITE;
/*!40000 ALTER TABLE `dipartimento` DISABLE KEYS */;
INSERT INTO `dipartimento` VALUES (1,'Dipartimento A'),(2,'Dipartimento B'),(3,'Dipartimento C'),(4,'Dipartimento D');
/*!40000 ALTER TABLE `dipartimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dipendenti`
--

DROP TABLE IF EXISTS `dipendenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dipendenti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cognome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `grado` varchar(255) DEFAULT NULL,
  `costo_acquisto` float DEFAULT NULL,
  `id_accessori` int DEFAULT NULL,
  `id_sede` int DEFAULT NULL,
  `id_dip` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_accessori` (`id_accessori`),
  KEY `fk_id_sede` (`id_sede`),
  KEY `fk_id_dip` (`id_dip`),
  CONSTRAINT `fk_id_accessori` FOREIGN KEY (`id_accessori`) REFERENCES `accessori` (`id_accessori`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_id_dip` FOREIGN KEY (`id_dip`) REFERENCES `dipartimento` (`id_dip`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_id_sede` FOREIGN KEY (`id_sede`) REFERENCES `sedi` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dipendenti`
--

LOCK TABLES `dipendenti` WRITE;
/*!40000 ALTER TABLE `dipendenti` DISABLE KEYS */;
INSERT INTO `dipendenti` VALUES (1,'Anna','Bianchi','anna.bianchi@email.com','Junior',1500,2,1,1),(2,'Lucia','Rossi','lucia.rossi@email.com','Senior',2500,3,6,2),(3,'Mario','Verdi','mario.verdi@email.com','Junior',2000,1,1,3),(4,'Francesca','Neri','francesca.neri@email.com','Mid-Level',2200,4,3,4),(5,'Antonio','Gialli','antonio.gialli@email.com','Senior',3000,5,1,3),(6,'Giuseppe','Blu','giuseppe.blu@email.com','Junior',1700,2,9,3);
/*!40000 ALTER TABLE `dipendenti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lic`
--

DROP TABLE IF EXISTS `lic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `prezzo` float DEFAULT NULL,
  `id_dip` int DEFAULT NULL,
  `productkey` varchar(255) DEFAULT NULL,
  `data_acquisto` date DEFAULT NULL,
  `data_scadenza` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_lic` (`id_dip`),
  CONSTRAINT `fk_id_lic` FOREIGN KEY (`id_dip`) REFERENCES `dipartimento` (`id_dip`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lic`
--

LOCK TABLES `lic` WRITE;
/*!40000 ALTER TABLE `lic` DISABLE KEYS */;
INSERT INTO `lic` VALUES (1,'GNU General Public License (GPL)',100,1,'GPL12345','2023-01-01','2025-01-01'),(2,'MIT License',50,2,'MIT98765','2023-03-15','2025-03-15'),(3,'Microsoft Office 365',149.99,3,'MSO365ABCD','2024-05-10','2026-05-10'),(4,'Apache License 2.0',49.99,4,'APACHE123','2022-06-30','2024-06-30'),(5,'Adobe Photoshop CC',19.99,1,'CC4000XYZ','2023-11-01','2025-11-01'),(6,'Creative Commons Attribution 4.0',35.99,2,'ADOBEPS456','2024-02-20','2026-02-20');
/*!40000 ALTER TABLE `lic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sedi`
--

DROP TABLE IF EXISTS `sedi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sedi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `localita` varchar(100) NOT NULL,
  `numero_persone` int NOT NULL,
  `posti_disponibili` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sedi`
--

LOCK TABLES `sedi` WRITE;
/*!40000 ALTER TABLE `sedi` DISABLE KEYS */;
INSERT INTO `sedi` VALUES (1,'Sede centrale','Bari',82,12),(3,'Sede Filiale','Milano',105,15),(6,'Sede Secondaria','Torino',180,25),(9,'Sede Principale','Poliba',300,50);
/*!40000 ALTER TABLE `sedi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Azienda1','$2b$10$.XMW8JeytjSIK6pkH4enM.oaI3C9CaeGxpjlGK/Evr0ce/nnOM/62'),(3,'Azienda2','$2b$10$7guidRMnkbupkfutoVrhs.ItTBCy.9tzD9T8t6Zp0GaE2vbc6ELM.');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-02 14:36:32
