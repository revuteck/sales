-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: ls-b9e1fff8ae66188406492f1b8709a5557d98a493.cvq4mo8ooiu8.ap-south-1.rds.amazonaws.com    Database: sales
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `candidate_id` int NOT NULL AUTO_INCREMENT,
  `comp_domain` varchar(150) DEFAULT NULL,
  `comp_name` varchar(255) DEFAULT NULL,
  `website` text,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `date_of_register` date DEFAULT (curdate()),
  `initial_status` varchar(255) DEFAULT 'DONE',
  `first_f_date` date DEFAULT NULL,
  `first_f_status` varchar(20) DEFAULT 'PENDING',
  `first_done_dt` date DEFAULT NULL,
  `second_f_date` date DEFAULT NULL,
  `second_f_status` varchar(20) DEFAULT 'PENDING',
  `second_done_dt` date DEFAULT NULL,
  `third_f_date` date DEFAULT NULL,
  `third_f_status` varchar(20) DEFAULT 'PENDING',
  `third_done_dt` date DEFAULT NULL,
  `fourth_f_date` date DEFAULT NULL,
  `fourth_f_status` varchar(20) DEFAULT 'PENDING',
  `fourth_done_dt` date DEFAULT NULL,
  `final_status` varchar(20) DEFAULT 'PENDING',
  `assigned_emp_id` int DEFAULT NULL,
  `emp_name` varchar(100) DEFAULT NULL,
  `country_id` int DEFAULT NULL,
  `country_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`candidate_id`),
  KEY `fk_candidate_emp` (`assigned_emp_id`),
  KEY `fk_candidate_country` (`country_id`),
  CONSTRAINT `fk_candidate_emp` FOREIGN KEY (`assigned_emp_id`) REFERENCES `emp` (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=466 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'Restaurant','Margarita\'s','https://www.margaritasrestaurante.com/','margaritas.dempsey@gmail.com',NULL,'2025-12-01','DONE','2025-12-03','DONE','2025-12-29','2026-01-01','DONE','2025-12-29','2026-01-02','DONE','2025-12-29','2026-01-03','PENDING','2025-12-29','COMPLETED',3,'Joshitha',3,'SINGAPORE'),(2,'Restaurant and Catering','Casuarina Curry','https://www.casuarinacurry.com/','enquiry@casuarinacurry.com',NULL,'2025-12-01','DONE','2025-12-03','DONE',NULL,'2025-12-06','DONE',NULL,'2025-12-10','PENDING',NULL,'2025-12-15','PENDING',NULL,'PENDING',3,'Joshitha',3,'SINGAPORE'),(3,'Luxury Bar/Hotel Bar','Raffles/Long Bar','https://raffles.com/singapore/dining/long-bar','dining.singapore@raffles.com',NULL,'2025-12-01','DONE','2025-12-03','DONE',NULL,'2025-12-06','DONE',NULL,'2025-12-10','PENDING',NULL,'2025-12-15','PENDING',NULL,'PENDING',3,'Joshitha',3,'SINGAPORE'),(4,'Fine Dining Restaurant','Marguerite','https://marguerite.com.sg/','info@marguerite.com.sg',NULL,'2025-12-01','DONE','2025-12-03','DONE',NULL,'2025-12-06','DONE',NULL,'2025-12-10','PENDING',NULL,'2025-12-15','PENDING',NULL,'PENDING',3,'Joshitha',3,'SINGAPORE');
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbmasteruser`@`%`*/ /*!50003 TRIGGER `all_follow_ups` BEFORE INSERT ON `candidates` FOR EACH ROW BEGIN
  IF NEW.date_of_register IS NULL THEN
    SET NEW.date_of_register = CURRENT_DATE;
  END IF;

  SET NEW.first_f_date  = DATE_ADD(NEW.date_of_register, INTERVAL 2 DAY);
  SET NEW.second_f_date = DATE_ADD(NEW.first_f_date,  INTERVAL 3 DAY);
  SET NEW.third_f_date  = DATE_ADD(NEW.second_f_date, INTERVAL 4 DAY);
  SET NEW.fourth_f_date = DATE_ADD(NEW.third_f_date,  INTERVAL 5 DAY);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbmasteruser`@`%`*/ /*!50003 TRIGGER `update_final_status` BEFORE UPDATE ON `candidates` FOR EACH ROW BEGIN
  IF NEW.first_f_status  = 'DONE'
     AND NEW.second_f_status = 'DONE'
     AND NEW.third_f_status  = 'DONE'
     AND NEW.fourth_f_status = 'DONE' THEN
    SET NEW.final_status = 'COMPLETED';
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbmasteruser`@`%`*/ /*!50003 TRIGGER `fourth_f_date` BEFORE UPDATE ON `candidates` FOR EACH ROW BEGIN
    -- When third follow-up is completed
    IF NEW.third_f_status = 'DONE' AND OLD.third_f_status <> 'DONE' THEN
       
        -- Set DONE date = today
        SET NEW.third_done_dt = CURRENT_DATE();
        
        -- Set next follow-up date = +5 days
        SET NEW.fourth_f_date = DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbmasteruser`@`%`*/ /*!50003 TRIGGER `second_f_date` BEFORE UPDATE ON `candidates` FOR EACH ROW BEGIN
    -- When FIRST follow-up is completed
    IF NEW.first_f_status = 'DONE' 
       AND OLD.first_f_status <> 'DONE' THEN
       
        -- Set FIRST done date = today
        SET NEW.first_done_dt = CURRENT_DATE();
        
        -- Set SECOND follow-up date = +3 days
        SET NEW.second_f_date = DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbmasteruser`@`%`*/ /*!50003 TRIGGER `third_f_date` BEFORE UPDATE ON `candidates` FOR EACH ROW BEGIN
    -- When FIRST follow-up is completed
    IF NEW.second_f_status = 'DONE' 
       AND OLD.second_f_status <> 'DONE' THEN
       
        -- Set FIRST done date = today
        SET NEW.second_done_dt = CURRENT_DATE();
        
        -- Set SECOND follow-up date = +3 days
        SET NEW.third_f_date = DATE_ADD(CURRENT_DATE(), INTERVAL 4 DAY);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`dbmasteruser`@`%`*/ /*!50003 TRIGGER `final_done_date` BEFORE UPDATE ON `candidates` FOR EACH ROW BEGIN
    -- When FIRST follow-up is completed
    IF NEW.fourth_f_status = 'DONE' 
       AND OLD.fourth_f_status <> 'DONE' THEN
       
        -- Set FIRST done date = today
        SET NEW.fourth_done_dt = CURRENT_DATE();

    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-06 10:45:45
