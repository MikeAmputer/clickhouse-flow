CREATE TABLE IF NOT EXISTS raw_input
(
    thing_id UInt32,
    thing_text String,
    thing_created DateTime('UTC') MATERIALIZED now('UTC')
)
ENGINE = MergeTree()
ORDER BY thing_id;

CREATE TABLE IF NOT EXISTS pipeline_output
(
    thing_id UInt32,
    thing_lower String
)
ENGINE = MergeTree()
ORDER BY thing_id;

CREATE MATERIALIZED VIEW IF NOT EXISTS pipeline_mat_view
TO pipeline_output
AS
SELECT
    thing_id,
    lower(thing_text) AS thing_lower
FROM raw_input
WHERE notEmpty(thing_text);
