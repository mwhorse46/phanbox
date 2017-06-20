CREATE TABLE IF NOT EXISTS `phanbox_example`
(
  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL,

  `what` VARCHAR(100) NOT NULL,
  `when` DATETIME NOT NULL,
  `where` VARCHAR(100) NULL DEFAULT NULL,

  PRIMARY KEY(`id`)
);

INSERT INTO `phanbox_example`(`what`, `when`, `where`) VALUES
  ('The dump has been imported', NOW(), CONCAT(@@version_comment, ' - ', @@version)),
  ('You may remove this table - it is just an example one', NOW(), NULL);
