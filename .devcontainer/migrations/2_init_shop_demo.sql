CREATE DATABASE IF NOT EXISTS shop_demo;

CREATE TABLE IF NOT EXISTS shop_demo.orders
(
    order_id UUID,
    user_id UUID,
    product_id UUID,
    quantity UInt32,
    price_per_unit Decimal(18, 6),
    currency_code LowCardinality(String),
    status LowCardinality(String),
    ordered_at DateTime64(3, 'UTC'),

    order_date Date MATERIALIZED toDate(ordered_at)
)
ENGINE = MergeTree
ORDER BY (ordered_at, user_id);

CREATE TABLE IF NOT EXISTS shop_demo.daily_revenue
(
    order_date Date,
    currency_code LowCardinality(String),
    total_revenue Decimal(18, 6)
)
ENGINE = SummingMergeTree
ORDER BY (order_date, currency_code);

CREATE MATERIALIZED VIEW IF NOT EXISTS shop_demo.mv_daily_revenue
TO shop_demo.daily_revenue
AS
SELECT
    order_date,
    currency_code,
    sum(quantity * price_per_unit) AS total_revenue
FROM shop_demo.orders
WHERE status = 'completed'
GROUP BY order_date, currency_code;

CREATE TABLE IF NOT EXISTS shop_demo.products
(
    product_id UUID,
    name String,
    category LowCardinality(String),
    price Decimal(18, 6),
    in_stock UInt32,
    created_at DateTime64(3, 'UTC')
)
ENGINE = MergeTree
ORDER BY (category, name);

CREATE TABLE IF NOT EXISTS shop_demo.inventory_summary
(
    category LowCardinality(String),
    total_products UInt64,
    total_stock UInt64
)
ENGINE = SummingMergeTree
ORDER BY category;

CREATE MATERIALIZED VIEW IF NOT EXISTS shop_demo.mv_inventory_summary
TO shop_demo.inventory_summary
AS
SELECT
    category,
    count() AS total_products,
    sum(in_stock) AS total_stock
FROM shop_demo.products
GROUP BY category;

CREATE TABLE IF NOT EXISTS shop_demo.users
(
    user_id UUID,
    name String,
    email String,
    registered_at DateTime64(3, 'UTC')
)
ENGINE = MergeTree
ORDER BY registered_at;

CREATE TABLE IF NOT EXISTS shop_demo.top_customers
(
    user_id UUID,
    total_spent_state AggregateFunction(sum, Decimal(18, 6)),
    total_orders_state AggregateFunction(count, UInt32)
)
ENGINE = AggregatingMergeTree
ORDER BY user_id;

CREATE MATERIALIZED VIEW IF NOT EXISTS shop_demo.mv_top_customers
TO shop_demo.top_customers
AS
SELECT
    user_id,
    sumState(quantity * price_per_unit) AS total_spent_state,
    countState() AS total_orders_state
FROM shop_demo.orders
WHERE status = 'completed'
GROUP BY user_id;

CREATE VIEW IF NOT EXISTS shop_demo.top_customers_view AS
SELECT
    user_id,
    sumMerge(total_spent_state) AS total_spent,
    countMerge(total_orders_state) AS total_orders
FROM shop_demo.top_customers
GROUP BY user_id;

CREATE VIEW IF NOT EXISTS shop_demo.top_customers_info_view AS
SELECT
    t.user_id,
    u.name,
    u.email,
    t.total_spent,
    t.total_orders
FROM shop_demo.top_customers_view AS t
INNER JOIN shop_demo.users AS u
    ON t.user_id = u.user_id
ORDER BY t.total_spent DESC;

CREATE TABLE IF NOT EXISTS shop_demo.discounts
(
    discount_code String,
    description String,
    percentage UInt8,
    active_until DateTime64(3, 'UTC')
)
ENGINE = MergeTree
ORDER BY active_until;

CREATE TABLE IF NOT EXISTS shop_demo.feedback
(
    feedback_id UUID,
    user_id UUID,
    product_id UUID,
    rating UInt8,
    comment String,
    submitted_at DateTime64(3, 'UTC')
)
ENGINE = MergeTree
ORDER BY submitted_at;
