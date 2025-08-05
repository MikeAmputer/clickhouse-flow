CREATE TABLE IF NOT EXISTS refreshable_input_data
(
    input_id UInt32,
    input_text String,
    input_created DateTime('UTC') MATERIALIZED now('UTC')
)
ENGINE = MergeTree()
ORDER BY input_id;

CREATE TABLE IF NOT EXISTS refreshable_transformed_data
(
    input_id UInt32,
    input_text_lower String
)
ENGINE = MergeTree()
ORDER BY input_id;

CREATE MATERIALIZED VIEW IF NOT EXISTS refreshable_input_mv
REFRESH EVERY 1 HOUR 30 MINUTES
TO refreshable_transformed_data
AS
SELECT
    input_id,
    lower(input_text) AS input_text_lower
FROM refreshable_input_data
WHERE notEmpty(input_text);