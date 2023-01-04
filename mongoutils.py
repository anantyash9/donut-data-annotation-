import pymongo
from bson.objectid import ObjectId
from fastapifileuploader import Tag,TraningData
# setup connection to server using srv and port
client = pymongo.MongoClient("mongodb+srv://paperless:paperless@cluster0.58ofa.mongodb.net/?retryWrites=true&w=majority")
# set database
db = client["donut"]

# function to create document in collection dataset
def create_dataset(datasetName='', datasetTags=''):
    # create document in collection dataset
    dataset = {
        "title": datasetName,
        "tags": datasetTags
    }
    # insert document into collection dataset
    record=db.dataset.insert_one(dataset)
    # return objectid 
    return record.inserted_id

#function to update document in collection dataset by id
def update_dataset(datasetId,datasetName='', datasetTags=[],coverImage=''):
    # create document in collection dataset
    dataset = {
        "title": datasetName,
        "tags": datasetTags,
        "coverImage": coverImage
    }
    # find document in collection dataset by id and update
    
    record=db.dataset.update_one({"_id":ObjectId(datasetId)}, {"$set":dataset})
    return record.matched_count

# function to create document in collection image
def create_image(datasetId,imageTags,file_extension):
    # create document in collection image
    image = {
        "datasetId": datasetId,
        "tags": imageTags,
        "fileExtension": file_extension
    }
    # insert document into collection image
    record=db.image.insert_one(image)
    # return objectid 
    return str(record.inserted_id)

#get all images for a dataset
def get_all_images(datasetId):
    #get all images for a dataset
    images=db.image.find({"datasetId":datasetId})
    #make a list of images
    images=list(images)
    #make objectid to string
    for image in images:
        image['id']=str(image['_id'])
    #remove _id from image dictionary
    for image in images:
        del image['_id']
    return images

def get_all_dataset():
    # get all dataset metadata from mongodb
    datasets=db.dataset.find()
    #make a list of dataset
    datasets=list(datasets)
    #make objectid to string
    for dataset in datasets:
        dataset['id']=str(dataset['_id'])
    #delete _id
    for dataset in datasets:
        del dataset['_id']
    return datasets

#clear all images in collection image
def clear_data():
    #clear all images in collection image
    db.image.delete_many({})
    #clear all datasets in collection dataset
    db.dataset.delete_many({})
    return "success"

#save tag for image
def save_tag(imageId,fields,state):
    #save tag for image or update tag for image
    record=db.tag.update_one({"imageId":imageId},{"$set":{"fields":fields,"state":state}},upsert=True)
    # return the id of the tag
    return str(record.upserted_id)

def get_tag(imageId):
    #get tag for image
    tag=db.tag.find_one({"imageId":imageId})
    #check if there is a tag
    if tag is None:
        return None
    #change objectid to string
    tag['id']=str(tag['_id'])
    #delete _id
    del tag['_id']
    return tag

def save_training_data(traningData:TraningData):
    #save traning data
    record=db.traningData.insert_one(traningData.dict())
    #return id of traning data
    return str(record.inserted_id)

def get_training_data(datasetId):
    #get traning data for dataset
    traningData=db.traningData.find_one({"datasetId":datasetId})
    #check if there is a traning data
    if traningData is None:
        return None
    #change objectid to string
    traningData['id']=str(traningData['_id'])
    #delete _id
    del traningData['_id']
    return traningData
    