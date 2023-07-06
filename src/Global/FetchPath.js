const BaseUrl = 'http://localhost:3000';

export const Tweet = () => {
    const ExecuteProcess = `${BaseUrl}/ExecuteTweetProcess`;
    const ExecutePreProcess = `${BaseUrl}/ExecuteTweetPreProcess`;
    const GetPull = `${BaseUrl}/GetPullTweet`;
    const GetPreProcess = `${BaseUrl}/GetPreProcessTweet`;
    const ReProgress = `${BaseUrl}/reCheckProgress`;
    const IsPulled = `${BaseUrl}/isPulled`;
    const IsPreProcessed = `${BaseUrl}/isPreProcessed`;
    return { ExecuteProcess, ExecutePreProcess, GetPull, GetPreProcess, ReProgress, IsPulled, IsPreProcessed};
}

export const Result = (data) => {
    const ExecuteProcess = `${BaseUrl}/ExecuteResultProcess`;
    const ExecuteCluster = `${BaseUrl}/ExecuteResultCluster`;
    const GetAll = `${BaseUrl}/GetAllResult`;
    const GetImage = `${BaseUrl}/GetImageResult/${data}`;
    const GetTotalandTop = `${BaseUrl}/ClusterJson`;
    const GetTopResult = `${BaseUrl}/ResultJson`;
    const IsProcessed = `${BaseUrl}/isProcessed`;
    return { ExecuteProcess, ExecuteCluster, GetAll, GetImage, GetTotalandTop, GetTopResult, IsProcessed };
}

