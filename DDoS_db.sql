-- MySQL dump 10.13  Distrib 5.6.20, for Linux (x86_64)
--
-- Host: localhost    Database: DDoS_db
-- ------------------------------------------------------
-- Server version	5.6.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Create database name
--
CREATE DATABASE DDoS_db

--
-- Selecting database
--
USE DDoS_db;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `datetime` DATETIME NOT NULL,
  `name` varchar(100) NOT NULL,
  `desc` varchar(200) NOT NULL,
  `status` varchar (20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES
    (1, '2014/12/30 9:7:53','Update Failed','ERROR: has no usb lib','new'),
    (2, '2014/12/20 10:7:53','Update Success','ERROR: has no usb lib','new'),
    (3, '2014/12/30 9:6:53','Update Failed','ERROR: has no usb lib','dismiss'),
    (4, '2015/2/28 9:6:53','Update Success','Success','dismiss'),
    (5, '2016/3/2 9:5:53','Update Success','Success','dismiss');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `datetime` DATETIME NOT NULL,
  `name` varchar(100) NOT NULL,
  `desc` varchar(200) NOT NULL,
  `status` varchar (20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES
    (1, '2016/08/01 9:7:53','Attack','from: 1','new'),
    (2, '2016/08/02 10:7:53','Attack','from: 2','new'),
    (3, '2016/08/03 9:7:53','Attack','from: 3','dismiss'),
    (4, '2016/08/04 9:6:53','Attack','from: 4','dismiss'),
    (5, '2016/08/05 9:5:53','Attack','from: 5','dismiss');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `history` (
  `datetime` DATETIME NOT NULL,
  `nf_interface` TINYINT NOT NULL,
  `packet_per_second` BIGINT NOT NULL,
  `packet_drop_per_second` BIGINT NOT NULL,

  PRIMARY KEY (`datetime`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `history` WRITE;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` VALUES
    ('2015/1/1 9:7:53',   0, 10, 5),
    ('2015/2/2 10:7:53',  1, 20, 4),
    ('2015/3/3 9:8:53',   2, 30,3),
    ('2015/4/4 9:6:53',   3, 100,0),
    ('2015/5/5 9:5:53',   0, 343,5),
    ('2015/6/6 9:7:53',   1, 10, 5),
    ('2015/7/7 10:7:53',  2, 20, 4),
    ('2015/8/8 9:8:53',   3, 30,3),
    ('2015/9/9 9:6:53',   0, 100,0),
    ('2016/10/10 9:5:53', 1, 343,5),
    ('2016/11/11 9:7:53', 2, 10, 5),
    ('2016/12/12 10:7:53',3, 20, 4),
    ('2016/1/13 9:8:53',  0, 30,3),
    ('2016/2/14 9:6:53',  1, 100,0),
    ('2016/3/15 9:5:53',  2, 343,5),
    ('2016/1/1 9:7:53',   3, 10, 5),
    ('2016/2/2 10:7:53',  0, 20, 4),
    ('2016/3/3 9:8:53',   1, 30,3),
    ('2016/4/4 9:6:53',   2, 100,0),
    ('2016/5/5 9:5:53',   3, 343,5),
    ('2016/6/6 9:7:53',   0, 10, 5),
    ('2016/7/7 10:7:53',  1, 20, 4),
    ('2016/8/8 9:8:53',   2, 30,3),
    ('2016/9/9 9:6:53',   3, 100,0),
    ('2016/10/11 9:5:53', 0, 343,5),
    ('2016/11/10 9:7:53', 1, 10, 5),
    ('2016/12/11 10:7:53',2, 20, 4),
    ('2016/1/15 9:8:53',  3, 30,3),
    ('2016/2/18 9:6:53',  0, 100,0),
    ('2016/3/14 9:5:53',  1, 343,5);
/*!40000 ALTER TABLE `history` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `bitfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bitfile` (
  `version` FLOAT NOT NULL,
  `name` varchar(100) NOT NULL,
  `path` varchar(400) NOT NULL,
  `create_datetime` DATETIME NOT NULL,
  `last_Upload_datetime` DATETIME NOT NULL,
  `Description` varchar(100) NOT NULL,

  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `bitfile` WRITE;
/*!40000 ALTER TABLE `bitfile` DISABLE KEYS */;
INSERT INTO `bitfile` VALUES
    (1.1, "Full bitstream", "apps/bitfiles/Full_bitstream.bit", '2016/1/15 9:8:53','2016/1/15 9:8:53', "With HopCount and Port Ingess/Egress inside"),
    (1.2, "Partial IE 1", "apps/bitfiles/Partial_IE_1.bit", '2016/1/15 9:8:53', '2016/1/16 9:8:53', "IE filter 198.12.0.0, 192.168.0.0"),
    (1.3, "Partial IE 2", "apps/bitfiles/Partial_IE_2.bit", '2016/1/15 9:8:53','2016/1/17 9:8:53', "IE accept 192.168.0.0, 198.12.0.0");
/*!40000 ALTER TABLE `bitfile` ENABLE KEYS */;
UNLOCK TABLES;
