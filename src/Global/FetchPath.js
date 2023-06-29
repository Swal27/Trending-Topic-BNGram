const BaseUrl = 'http://localhost:3000';

export const Tweet = () => {
    const Execute = `${BaseUrl}/ExecuteTweet`;
    const GetAll = `${BaseUrl}/GetAllTweet`;
    const DeleteAll = `${BaseUrl}/DeleteAllTweet`;
    return { Execute, GetAll, DeleteAll };
}

export const Result = (data) => {
    const Execute = `${BaseUrl}/ExecuteResult`;
    const GetAll = `${BaseUrl}/GetAllResult`;
    const DeleteAll = `${BaseUrl}/DeleteAllResult/${data}`;
    const GetImage = `${BaseUrl}/GetImageResult/${data}`;
    return { Execute, GetAll, DeleteAll, GetImage };
}

