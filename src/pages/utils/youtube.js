const YOUTUBE_HOST = "https://youtube.googleapis.com";

export async function getPlaylist(playlistId) {
    try {
        const playlistItemsUrl = `${YOUTUBE_HOST}/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE_API_KEY}`;
        let playlistItems = [];
        
        let res = await fetch(playlistItemsUrl);
        let data = await res.json();

        playlistItems = data.items;

        while(data.nextPageToken) {
            res = await fetch (
                `${playlistItemsUrl}&pageToken=${data.nextPageToken}`
            )
            data = await res.json();
            playlistItems = playlistItems.concat(data.items);
        }
        return playlistItems;
    } catch (error) {
        console.log(error);
    }
    return null;
}

export async function getChannelInfo(channelId) {
    try {
        const url = `${YOUTUBE_HOST}/youtube/v3/channels?part=snippet,contentDetails&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`
        const res = await fetch(
            `${YOUTUBE_HOST}/youtube/v3/channels?part=snippet,contentDetails&id=UCFvocK8dHEpwOsN9Ecfr81Q&key=${process.env.YOUTUBE_API_KEY}`
        )

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
    }
    return null;
}

export async function getVideoInfo(videoId) {
    try {
        const res = await fetch(
            `${YOUTUBE_HOST}/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
        )

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
    }
    return null;
}