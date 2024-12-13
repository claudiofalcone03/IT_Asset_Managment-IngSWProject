-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: localhost    Database: database30nov
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
  `id_accessori` int NOT NULL AUTO_INCREMENT,
  `nome_accessori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `seriale_accessori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `categoria_accessori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `modello_accessori` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `costo_accessori` float NOT NULL,
  PRIMARY KEY (`id_accessori`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accessori`
--

LOCK TABLES `accessori` WRITE;
/*!40000 ALTER TABLE `accessori` DISABLE KEYS */;
INSERT INTO `accessori` VALUES (2,'computer','XYZ709','laptop','Dell XPS 13',0),(5,'Topolino','JKL345','Periferica','Logich GM master',45),(10,'Peppe','rakjafsnj','giocattolo','cars',25253);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (2,'Ipad','Richiedibili','2024-09-13','Sede filiale','2024-09-06',359),(4,'Laptop','Inattivi','2024-11-15','Sede secondaria','2024-11-02',649),(5,'Tablet','Archiviati','2024-12-11','Sede principale','2024-12-07',429),(6,'Iphone','Attivi','2024-12-28','Sede principale','2024-12-27',1199),(7,'Laptop','Richiedibili','2024-07-12','Sede secondaria','2024-07-11',239.99),(12,'Telefono','Attivi','2023-12-05','Sede principale','2034-05-12',456);
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dipartimento`
--

DROP TABLE IF EXISTS `dipartimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dipartimento` (
  `id_dipartimento` int NOT NULL AUTO_INCREMENT,
  `nome_dipartimento` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id_dipartimento`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dipartimento`
--

LOCK TABLES `dipartimento` WRITE;
/*!40000 ALTER TABLE `dipartimento` DISABLE KEYS */;
INSERT INTO `dipartimento` VALUES (1,'Dipartimento A'),(2,'Dipartimento B'),(3,'Dipartimento C'),(4,'Dipartimento D'),(6,'Dipartimento gatto');
/*!40000 ALTER TABLE `dipartimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dipendenti`
--

DROP TABLE IF EXISTS `dipendenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dipendenti` (
  `id_dipPK` int NOT NULL AUTO_INCREMENT,
  `nome_dip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cognome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `grado` varchar(255) DEFAULT NULL,
  `id_sede_dip` int DEFAULT NULL,
  `id_dipart_dip` int DEFAULT NULL,
  PRIMARY KEY (`id_dipPK`),
  KEY `fk_id_sede` (`id_sede_dip`),
  KEY `fk_id_dip` (`id_dipart_dip`),
  CONSTRAINT `fk_id_dip` FOREIGN KEY (`id_dipart_dip`) REFERENCES `dipartimento` (`id_dipartimento`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_id_sede` FOREIGN KEY (`id_sede_dip`) REFERENCES `sedi` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dipendenti`
--

LOCK TABLES `dipendenti` WRITE;
/*!40000 ALTER TABLE `dipendenti` DISABLE KEYS */;
INSERT INTO `dipendenti` VALUES (1,'Annamaria','Rossi','anna.bianchi@email.it','JR',10,3),(2,'Lucia','Rossi','lucia.rossi@email.com','Senior',6,2),(8,'Claudio ','Falcone','c.falcone1@studenti.poliba.it','Studente',NULL,NULL),(9,'Federico ','Falcone','fedefalkone','fggs',NULL,NULL),(13,'Pier','Paolo','giuseppe','Napoletana',NULL,NULL),(16,'asf','sdaf','das','da',NULL,NULL),(17,'r12','rq','qr','rq',NULL,NULL),(18,'vasd','avds','fvd','vas',6,NULL),(19,'Francesco','Pappa','email pappa','Pappa',3,4),(21,'Francesco','Di Tanno','emailfrancesco','Capo',1,1),(22,'Vittorio','Di donna','nkfakfnak','Bari',3,6);
/*!40000 ALTER TABLE `dipendenti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licenze`
--

DROP TABLE IF EXISTS `licenze`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licenze` (
  `id_lic` int NOT NULL AUTO_INCREMENT,
  `nome_lic` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `prezzo_lic` float DEFAULT NULL,
  `id_dipart_lic` int DEFAULT NULL,
  `productkey` varchar(255) DEFAULT NULL,
  `data_acquisto_lic` date DEFAULT NULL,
  `data_scadenza_lic` date DEFAULT NULL,
  PRIMARY KEY (`id_lic`),
  KEY `fk_id_lic` (`id_dipart_lic`),
  CONSTRAINT `fk_id_lic` FOREIGN KEY (`id_dipart_lic`) REFERENCES `dipartimento` (`id_dipartimento`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licenze`
--

LOCK TABLES `licenze` WRITE;
/*!40000 ALTER TABLE `licenze` DISABLE KEYS */;
INSERT INTO `licenze` VALUES (1,'GNU General Public License (GPL)',100,NULL,'GPL12345','2023-01-01','2025-01-01'),(2,'MIT License',50,2,'MIT98765','2023-03-15','2025-03-15'),(3,'Microsoft Office 365',149.99,3,'MSO365ABCD','2024-05-10','2026-05-10'),(4,'Apache License 2.0',49.99,4,'APACHE123','2022-06-30','2024-06-30'),(5,'Adobe Photoshop CC',19.99,NULL,'CC4000XYZ','2023-11-01','2025-11-01'),(6,'Creative Commons Attribution 4.0',35.99,2,'ADOBEPS456','2024-02-20','2026-02-20'),(16,'Windows 7 Sabrina',1490,NULL,'DEF456-XYZ789-1011SKjKSJ','2024-12-28','2024-12-15'),(17,'Macos',531,3,'eqqr','2024-12-27','2024-12-28'),(18,'android',32,3,'eeq89','2024-12-15','2024-12-24');
/*!40000 ALTER TABLE `licenze` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sedi`
--

LOCK TABLES `sedi` WRITE;
/*!40000 ALTER TABLE `sedi` DISABLE KEYS */;
INSERT INTO `sedi` VALUES (1,'Sede centrale','Bari',82,12),(3,'Sede Filiale','Milano',105,15),(6,'Sede Secondaria','Torino',180,25),(9,'Sede Principale','Poliba',300,50),(10,'Sede pippo','Uniba',45,42);
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

-- Dump completed on 2024-12-13 10:02:05
