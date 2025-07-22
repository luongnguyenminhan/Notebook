from minio import Minio
from minio.error import S3Error

from app.core.config import settings


class MinIOClient:
    def __init__(self):
        self.client = Minio(settings.minio_endpoint, access_key=settings.minio_access_key, secret_key=settings.minio_secret_key, secure=settings.minio_secure)

    def ensure_bucket_exists(self, bucket_name: str):
        """Create bucket if it doesn't exist"""
        if not self.client.bucket_exists(bucket_name):
            self.client.make_bucket(bucket_name)
            print(f"Created bucket: {bucket_name}")

    def upload_file(self, file_path: str, bucket_name: str, object_name: str):
        """Upload a file to MinIO"""
        try:
            self.ensure_bucket_exists(bucket_name)
            result = self.client.fput_object(bucket_name, object_name, file_path)
            return {"bucket_name": bucket_name, "object_name": object_name, "etag": result.etag, "version_id": result.version_id}
        except S3Error as e:
            print(f"Error uploading to MinIO: {e}")
            raise

    def download_file(self, bucket_name: str, object_name: str, file_path: str):
        """Download a file from MinIO"""
        try:
            self.client.fget_object(bucket_name, object_name, file_path)
            return file_path
        except S3Error as e:
            print(f"Error downloading from MinIO: {e}")
            raise


# Initialize MinIO client
minio_client = MinIOClient()
