CREATE TABLE IF NOT EXISTS join_source_items
(
    item_id UInt32,
    item_name String,
    created_at DateTime('UTC') MATERIALIZED now('UTC')
)
ENGINE = MergeTree()
ORDER BY item_id;

CREATE TABLE IF NOT EXISTS join_lookup_categories
(
    category_id UInt32,
    category_name String
)
ENGINE = MergeTree()
ORDER BY category_id;

CREATE TABLE IF NOT EXISTS join_output
(
    item_id UInt32,
    item_name String,
    category_name String
)
ENGINE = MergeTree()
ORDER BY item_id;

CREATE MATERIALIZED VIEW IF NOT EXISTS join_mat_view
TO join_output
AS
SELECT
    i.item_id,
    i.item_name,
    c.category_name
FROM join_source_items AS i
ANY LEFT JOIN join_lookup_categories AS c
    ON i.item_id = c.category_id
WHERE notEmpty(i.item_name);