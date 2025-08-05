CREATE TABLE IF NOT EXISTS view_base
(
    item_id UInt32,
    item_text String
)
ENGINE = MergeTree()
ORDER BY item_id;

CREATE VIEW IF NOT EXISTS view_only AS
SELECT
    item_id,
    upper(item_text) AS item_upper,
    length(item_text) AS item_len
FROM view_base;