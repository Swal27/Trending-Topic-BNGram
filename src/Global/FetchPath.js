const BaseUrl = 'http://localhost:3000';

export const Tweet = () => {
    const ExecuteProcess = `${BaseUrl}/ExecuteTweetProcess`;
    const ExecutePreProcess = `${BaseUrl}/ExecuteTweetPreProcess`;
    const GetPull = `${BaseUrl}/GetPullTweet`;
    const GetPreProcess = `${BaseUrl}/GetPreProcessTweet`;
    return { ExecuteProcess, ExecutePreProcess, GetPull, GetPreProcess };
}

export const Result = (data) => {
    const ExecuteProcess = `${BaseUrl}/ExecuteResultProcess`;
    const ExecuteCluster = `${BaseUrl}/ExecuteResultCluster`;
    const GetAll = `${BaseUrl}/GetAllResult`;
    const GetImage = `${BaseUrl}/GetImageResult/${data}`;
    const GetTotalandTop = `${BaseUrl}/ClusterJson`;
    const GetTopResult = `${BaseUrl}/ResultJson`;
    return { ExecuteProcess, ExecuteCluster, GetAll, GetImage, GetTotalandTop, GetTopResult };
}

