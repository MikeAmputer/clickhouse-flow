CREATE DATABASE IF NOT EXISTS bank_demo;

CREATE TABLE IF NOT EXISTS bank_demo.transactions
(
    transaction_id UUID,
    user_id UUID,
    amount Decimal(18, 6),
    currency_code LowCardinality(String),
    status LowCardinality(String),
    created_at DateTime64(3, 'UTC'),
    updated_at DateTime64(3, 'UTC'),

    year UInt16 MATERIALIZED toYear(created_at),
    month UInt8 MATERIALIZED toMonth(created_at),
    day UInt8 MATERIALIZED toDayOfMonth(created_at)
)
ENGINE = MergeTree
ORDER BY (created_at, user_id);

CREATE TABLE IF NOT EXISTS bank_demo.transactions_by_user
(
    user_id UUID,
    currency_code LowCardinality(String),
    total_amount AggregateFunction(sum, Decimal(18, 6)),
    transaction_count AggregateFunction(count, UInt64),
    first_transaction AggregateFunction(min, DateTime64(3, 'UTC')),
    last_transaction AggregateFunction(max, DateTime64(3, 'UTC'))
)
ENGINE = AggregatingMergeTree
ORDER BY (currency_code, user_id);

CREATE MATERIALIZED VIEW IF NOT EXISTS bank_demo.mv_transactions_by_user
TO bank_demo.transactions_by_user
AS
SELECT
    user_id,
    currency_code,
    sumState(amount) AS total_amount,
    countState() AS transaction_count,
    minState(created_at) AS first_transaction,
    maxState(created_at) AS last_transaction
FROM bank_demo.transactions
GROUP BY user_id, currency_code;

CREATE VIEW IF NOT EXISTS bank_demo.transactions_by_user_view AS
SELECT
    user_id,
    currency_code,
    sumMerge(total_amount) AS total_amount,
    countMerge(transaction_count) AS transaction_count,
    minMerge(first_transaction) AS first_transaction,
    maxMerge(last_transaction) AS last_transaction
FROM bank_demo.transactions_by_user
GROUP BY user_id, currency_code;

CREATE TABLE IF NOT EXISTS bank_demo.transactions_daily_counts
(
    event_date Date,
    count UInt64
)
ENGINE = SummingMergeTree
ORDER BY event_date;

CREATE MATERIALIZED VIEW IF NOT EXISTS bank_demo.mv_transactions_daily_counts
TO bank_demo.transactions_daily_counts
AS
SELECT
    toDate(created_at) AS event_date,
    count() AS count
FROM bank_demo.transactions
GROUP BY event_date;

CREATE TABLE IF NOT EXISTS bank_demo.transactions_failed
(
    transaction_id UUID,
    user_id UUID,
    amount Decimal(18, 6),
    currency_code LowCardinality(String),
    created_at DateTime64(3, 'UTC')
)
ENGINE = MergeTree
ORDER BY created_at;

CREATE MATERIALIZED VIEW IF NOT EXISTS bank_demo.mv_transactions_failed
TO bank_demo.transactions_failed
AS
SELECT
    transaction_id,
    user_id,
    amount,
    currency_code,
    created_at
FROM bank_demo.transactions
WHERE status = 'failed';

CREATE VIEW IF NOT EXISTS bank_demo.recent_failed_transactions_view AS
SELECT *
FROM bank_demo.transactions_failed
WHERE created_at >= now() - INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS bank_demo.users
(
    user_id UUID,
    name String,
    email String,
    country LowCardinality(String),
    created_at DateTime64(3, 'UTC')
)
ENGINE = MergeTree
ORDER BY (country, created_at);

CREATE TABLE IF NOT EXISTS bank_demo.accounts
(
    account_id UUID,
    user_id UUID,
    account_type LowCardinality(String),
    balance Decimal(18, 6),
    currency_code LowCardinality(String),
    is_active UInt8,
    opened_at DateTime64(3, 'UTC')
)
ENGINE = MergeTree
ORDER BY (user_id, opened_at);

CREATE TABLE IF NOT EXISTS bank_demo.exchange_rates
(
    currency_code LowCardinality(String),
    rate_to_usd Decimal(18, 6),
    date Date
)
ENGINE = MergeTree
ORDER BY (currency_code, date);

CREATE TABLE IF NOT EXISTS bank_demo.transactions_usd
(
    transaction_id UUID,
    user_id UUID,
    amount_usd Decimal(18, 6),
    created_at DateTime64(3, 'UTC')
)
ENGINE = MergeTree
ORDER BY (created_at, user_id);

CREATE MATERIALIZED VIEW IF NOT EXISTS bank_demo.mv_transactions_usd
TO bank_demo.transactions_usd
AS
SELECT
    t.transaction_id,
    t.user_id,
    t.amount * r.rate_to_usd AS amount_usd,
    t.created_at
FROM bank_demo.transactions AS t
INNER JOIN bank_demo.exchange_rates AS r
    ON t.currency_code = r.currency_code AND toDate(t.created_at) = r.date;

CREATE TABLE IF NOT EXISTS bank_demo.user_country_stats
(
    country LowCardinality(String),
    total_transactions AggregateFunction(count, UInt64),
    total_amount AggregateFunction(sum, Decimal(18, 6))
)
ENGINE = AggregatingMergeTree
ORDER BY country;

CREATE MATERIALIZED VIEW IF NOT EXISTS bank_demo.mv_user_country_stats
TO bank_demo.user_country_stats
AS
SELECT
    u.country,
    countState() AS total_transactions,
    sumState(t.amount) AS total_amount
FROM bank_demo.transactions t
INNER JOIN bank_demo.users u ON t.user_id = u.user_id
GROUP BY u.country;

CREATE VIEW IF NOT EXISTS bank_demo.user_country_stats_view AS
SELECT
    country,
    countMerge(total_transactions) AS total_transactions,
    sumMerge(total_amount) AS total_amount
FROM bank_demo.user_country_stats
GROUP BY country;