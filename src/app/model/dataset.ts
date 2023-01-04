

//add a model for google photos album
export interface Dataset{ 
    id: string;
    title: string;
    // make base url Optional
    baseUrl?: string;
    mediaItemsCount?: string;
    coverPhotoBaseUrl?: string;
    coverImage?: string;
}

