import boto3
import json
import constants

s3_client = boto3.client('s3',
                         aws_access_key_id=constants.AWS_ACCESS_KEY,
                         aws_secret_access_key=constants.AWS_SECRET_ACCESS_KEY)

def upload_to_s3(file_path, s3_key=None):
    # If no S3 key provided, use filename
    if s3_key is None:
        s3_key = file_path.split('/')[-1]
        
    try:
        s3_client.upload_file(file_path, constants.S3_BUCKET_NAME, s3_key)
        print(f"Successfully uploaded {file_path} to {constants.S3_BUCKET_NAME}/{s3_key}")
    except Exception as e:
        print(f"Error uploading file: {str(e)}")

def read_from_s3(s3_key):
    try:
        # Get object from S3
        response = s3_client.get_object(Bucket=constants.S3_BUCKET_NAME, Key=s3_key)
        
        # Read the content
        content = response['Body'].read().decode('utf-8')
        return content
        
    except Exception as e:
        print(f"Error reading file: {str(e)}")
        return None
    
def get_context():
    try:
        # List objects in bucket
        response = s3_client.list_objects_v2(Bucket=constants.S3_BUCKET_NAME)
        
        # Get the first (and only) file
        if 'Contents' in response and len(response['Contents']) > 0:
            file_key = response['Contents'][0]['Key']
            print(f"Found file: {file_key}")
            
            # Read the file content
            file_response = s3_client.get_object(Bucket=constants.S3_BUCKET_NAME, Key=file_key)
            content = file_response['Body'].read().decode('utf-8')
            return content
        else:
            print("No files found in bucket")
            return None
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def has_file():
    try:
        response = s3_client.list_objects_v2(Bucket=constants.S3_BUCKET_NAME)
        return 'Contents' in response and len(response['Contents']) > 0
    except Exception as e:
        print(f"Error checking bucket: {str(e)}")
        return False