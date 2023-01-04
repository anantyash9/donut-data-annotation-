import os
import uuid
import boto3
from botocore.client import Config

s3 = boto3.resource('s3',
                    endpoint_url='http://localhost:9099',
                    aws_access_key_id='YI6CcRE2AMRgVAQ5',
                    aws_secret_access_key='lUk9HMEUZXX2sitGOKLBxxLW5AwcyLU6',
                    config=Config(signature_version='s3v4'),
                    region_name='us-east-1')
# upload file to minio bucket images
def upload_file_to_minio(contents,imageId,filename):
    #get the file extension
    file_extension = os.path.splitext(filename)[1]
    #create a unique name for the file
    key =imageId+file_extension
    s3.Bucket('test').put_object(Key=key, Body=contents)
    return key

# delete all files from minio bucket
def clear_data(bucket):
    # get all objects from bucket
    objects = s3.Bucket(bucket).objects.all()
    # delete all objects from bucket
    for obj in objects:
        obj.delete()
    return True
