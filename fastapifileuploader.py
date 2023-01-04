import fastapi
import uvicorn
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware
import mongoutils
import minio_flie_handler

from pydantic import BaseModel



app = FastAPI()
# allow cors for all origins

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Dataset(BaseModel):
    #name is optional
    title: Union[str, None] = None
    #id is required
    id: str
    #tags is optional
    tags: Union[str, None] = None
    #coverImage 
    coverImage: Union[str, None] = None

# class to store coordinate object

class ImageDimentions(BaseModel):
    height: int
    width: int
class MarkerDimentions(BaseModel):
    height: int
    width: int
    left: int
    top: int

class Coordinate(BaseModel):
    imageDimentions: ImageDimentions
    markerDimentions: MarkerDimentions

class Field(BaseModel):
    #id is required
    key: str
    #name is optional
    value_type: str
    #length is optional
    length: Union[int, None] = None
    #coordinates is required
    coordinates: Coordinate
    class Config:
        orm_mode = True

class Tag(BaseModel):
    #id is required
    imageId: str
    #list of fields
    fields: List[Field]
    state: dict
    class Config:
        orm_mode = True

class TraningData(BaseModel):
    #id is required
    datasetId: str
    #url optional
    url:    Union[str, None] = None
    state: dict
    class Config:
        orm_mode = True

# //the parameter will be provided as json 
@app.post("/dataset")
async def create_dataset():
    datasetId=mongoutils.create_dataset()
    return {"datasetId": str(datasetId)}

#get all images
@app.get("/dataset/{datasetId}/images")
async def get_all_images(datasetId: str):
    images=mongoutils.get_all_images(datasetId)
    return images





# endpoint to upload files as multipart/form-data with datasetname in the form
@app.post("/uploadfiles/")
async def create_upload_files(datasetId: str = Form(...), files: List[UploadFile] = File(...)):
    # async def create_upload_files(files: List[UploadFile] = File(...)):
    keys=[]
    for file in files:
        contents = await file.read()
        print("id: ", datasetId)
        file_extension = file.filename.split(".")[-1]
        # insert image metadata to mongodb
        imageId=mongoutils.create_image(datasetId,[],file_extension)
        # upload file to minio
        key=minio_flie_handler.upload_file_to_minio(contents,imageId,file.filename)
        keys.append(key)
    return {"filenames": keys}

# endpoint to update dataset
@app.put("/dataset")
async def update_dataset(dataset: Dataset):
    # update dataset metadata in mongodb
    modify_count=mongoutils.update_dataset(dataset.id,dataset.title,dataset.tags,dataset.coverImage)
    return {"modify_count": modify_count}

# endpoint to get all dataset
@app.get("/dataset",response_model=List[Dataset])
async def get_all_dataset():
    # get all dataset metadata from mongodb
    datasets=mongoutils.get_all_dataset()
    return datasets
#clear all data
@app.delete("/cleardata")
async def clear_data():
    mongoutils.clear_data()
    minio_flie_handler.clear_data("test")
    return {"message": "cleared all data"}

# endpoint to get tag by image id
@app.get("/tag/{imageId}")
async def get_tag(imageId: str):
    # get all dataset metadata from mongodb
    tags=mongoutils.get_tag(imageId)
    return tags
@app.post("/tag")
async def save_tag(tag: Tag):
    # get all dataset metadata from mongodb
    r=tag.dict()
    id=mongoutils.save_tag(r["imageId"],r["fields"],r["state"])
    return {"id": id}

#save training data
@app.post("/trainingdata")
async def save_training_data(trainingData: TraningData):
    # get all dataset metadata from mongodb
    id=mongoutils.save_training_data(trainingData)
    return {"id": id}

# get training data
@app.get("/trainingdata/{datasetId}")
async def get_training_data(datasetId: str):
    # get all dataset metadata from mongodb
    trainingData=mongoutils.get_training_data(datasetId)
    return trainingData

# run the app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
