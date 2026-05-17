PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- Canonical users:
-- hithesh0215@gmail.com -> 01b45e90-d272-4a11-9994-c0eb3f761bc5
-- hitheshtube@gmail.com -> 3e7df08e-da3d-486c-ae03-5b5e883c7b18

-- Move session/history references first.
UPDATE connection_sessions
SET user_id = '01b45e90-d272-4a11-9994-c0eb3f761bc5'
WHERE user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

UPDATE openclaw_pairing_sessions
SET approved_user_id = '01b45e90-d272-4a11-9994-c0eb3f761bc5'
WHERE approved_user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

UPDATE request_logs
SET user_id = '01b45e90-d272-4a11-9994-c0eb3f761bc5'
WHERE user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

UPDATE app_requests
SET user_id = '01b45e90-d272-4a11-9994-c0eb3f761bc5'
WHERE user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

UPDATE app_request_votes
SET user_id = '01b45e90-d272-4a11-9994-c0eb3f761bc5'
WHERE user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

UPDATE tool_executions
SET user_id = '01b45e90-d272-4a11-9994-c0eb3f761bc5'
WHERE user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

UPDATE api_keys
SET user_id = '01b45e90-d272-4a11-9994-c0eb3f761bc5'
WHERE user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

UPDATE user_integrations
SET user_id = '01b45e90-d272-4a11-9994-c0eb3f761bc5'
WHERE user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

-- Keep the canonical billing row for hithesh0215 and delete the synthetic duplicates.
DELETE FROM billing_accounts
WHERE user_id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a'
);

-- hitheshtube@gmail.com: keep billing on 3e7df..., move session refs from 6a8e...
UPDATE connection_sessions
SET user_id = '3e7df08e-da3d-486c-ae03-5b5e883c7b18'
WHERE user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

UPDATE openclaw_pairing_sessions
SET approved_user_id = '3e7df08e-da3d-486c-ae03-5b5e883c7b18'
WHERE approved_user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

UPDATE request_logs
SET user_id = '3e7df08e-da3d-486c-ae03-5b5e883c7b18'
WHERE user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

UPDATE app_requests
SET user_id = '3e7df08e-da3d-486c-ae03-5b5e883c7b18'
WHERE user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

UPDATE app_request_votes
SET user_id = '3e7df08e-da3d-486c-ae03-5b5e883c7b18'
WHERE user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

UPDATE tool_executions
SET user_id = '3e7df08e-da3d-486c-ae03-5b5e883c7b18'
WHERE user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

UPDATE api_keys
SET user_id = '3e7df08e-da3d-486c-ae03-5b5e883c7b18'
WHERE user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

UPDATE user_integrations
SET user_id = '3e7df08e-da3d-486c-ae03-5b5e883c7b18'
WHERE user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

DELETE FROM billing_accounts
WHERE user_id = '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1';

-- Remove duplicate user rows last.
DELETE FROM users
WHERE id IN (
  '16b2379e-2e25-4d15-90f5-4b3e815cdeb7',
  'fc7b8782-957f-4fc4-b722-f2fdf5f6be1a',
  '6a8ed971-ad67-42a3-b54b-694b9e5ea7f1'
);

COMMIT;
PRAGMA foreign_keys = ON;
