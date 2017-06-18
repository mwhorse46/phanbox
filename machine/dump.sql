CREATE TABLE IF NOT EXISTS drop_me
(
  `what` VARCHAR(100) NOT NULL,
  `when` DATETIME NOT NULL PRIMARY KEY
);

INSERT INTO `drop_me`(`what`, `when`) VALUES('The dump has been imported', NOW());
