from typing import List

from pydantic import BaseModel


class AdminStats(BaseModel):
    total_users: int
    total_recordings: int
    completed_recordings: int
    processing_recordings: int
    pending_recordings: int
    failed_recordings: int
    total_storage: int
    total_queries: int
    top_users: List[dict]
