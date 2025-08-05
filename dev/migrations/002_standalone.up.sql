CREATE TABLE IF NOT EXISTS standalone_logs
(
    log_id UInt64,
    log_line String,
    log_created DateTime('UTC') MATERIALIZED now('UTC'),
    eph_len UInt64 ALIAS length(log_line)
)
ENGINE = MergeTree()
ORDER BY log_id;