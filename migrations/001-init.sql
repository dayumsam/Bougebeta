--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE PolyLines (
  id   SERIAL PRIMARY KEY,
  coordinates TEXT NOT NULL
);

--INSERT INTO PolyLines (id, coordinates) VALUES (1, '{"coordinates": [[2.335466,48.866902],[2.352595, 48.866169],[2.352074,48.851803], [2.333906, 48.851599],[2.335466,48.866902]]}');

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE PolyLines;
