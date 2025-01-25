 
INSERT into `User` (Id, Username, Password, Enabled, CreatedOn) VALUES (1, 'admin', 'admin', 1, '2018-10-26 00:00:00.000');
INSERT into `User` (Id, Username, Password, Enabled, CreatedOn) VALUES (2, 'user1', 'user1', 1, '2018-10-26 00:00:00.000');
INSERT into `User` (Id, Username, Password, Enabled, CreatedOn) VALUES (3, 'user2', 'user2', 1, '2018-10-26 00:00:00.000');
INSERT into `User` (Id, Username, Password, Enabled, CreatedOn) VALUES (4, 'user3', 'user3', 0, '2018-10-26 00:00:00.000');

INSERT into Team (Id, Name, Description, CreatedOn, Enabled) VALUES (1, 'Team1', 'description', '2018-10-26 00:00:00.000', 1);
INSERT into Team (Id, Name, Description, CreatedOn, Enabled) VALUES (2, 'Team2', 'description', '2018-10-26 00:00:00.000', 1);

INSERT into Room (Id, Name, Facilitator, Scorer, CreatedOn) VALUES (1, 'Room1', 2, 3, '2018-10-26 00:00:00.000');
INSERT into Room (Id, Name, Facilitator, Scorer, CreatedOn) VALUES (2, 'Room2', 3, 2, '2018-10-26 00:00:00.000');

INSERT into RoomTeam (Room, Team) VALUES (1, 1);
INSERT into RoomTeam (Room, Team) VALUES (1, 2);

INSERT into Session (Id, SessionKey, Room, Completed, StartDate, EndDate, SessionData, CreatedOn)
VALUES (1, '779d77f1-89f5-4bec-ac46-af289fcfce2f', 1, 0, '2018-10-26 00:00:00.000', '2018-10-26 00:00:00.000', NULL, '2018-10-26 00:00:00.000');
INSERT into Session (Id, SessionKey, Room, Completed, StartDate, EndDate, SessionData, CreatedOn)
VALUES (2, '543d3acd-0613-4d85-8fe5-3a8c8160c686', 2, 0,'2018-10-26 00:00:00.000', '2018-10-26 00:00:00.000', NULL, '2018-10-26 00:00:00.000');

INSERT into Role (Id, Name) VALUES (1, N'admin');
INSERT into Role (Id, Name) VALUES (2, N'facilitator');
INSERT into Role (Id, Name) VALUES (3, N'scorer');

INSERT into UserRole (`User`, Role) VALUES (1, 1);
INSERT into UserRole (`User`, Role) VALUES (2, 2);
INSERT into UserRole (`User`, Role) VALUES (2, 3);
INSERT into UserRole (`User`, Role) VALUES (3, 2);
INSERT into UserRole (`User`, Role) VALUES (3, 3);
INSERT into UserRole (`User`, Role) VALUES (4, 2);
INSERT into UserRole (`User`, Role) VALUES (4, 3);