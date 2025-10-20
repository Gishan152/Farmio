-- Add agent tracking columns to requests table
-- Migration for Request status tracking feature

ALTER TABLE requests 
ADD COLUMN accepted_by_agent_id BIGINT,
ADD COLUMN accepted_by_agent_name VARCHAR(255);

-- Add index for performance when querying by agent
CREATE INDEX idx_requests_agent_id ON requests(accepted_by_agent_id);

-- Add comments for documentation
COMMENT ON COLUMN requests.accepted_by_agent_id IS 'ID of the waste agent who accepted this request';
COMMENT ON COLUMN requests.accepted_by_agent_name IS 'Name of the waste agent who accepted this request';
