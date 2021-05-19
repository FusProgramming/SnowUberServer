CREATE TABLE users(
  userId SERIAL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  emailAddress VARCHAR(255) NOT NULL,
  emailAddress2 VARCHAR(255) NOT NULL,
  userPassword VARCHAR(255) NOT NULL,
  userPassword2 VARCHAR(255) NOT NULL,
  PRIMARY KEY(userId)
);