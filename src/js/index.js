const APIURL = "https://api.giphy.com/v1/gifs/";
const APIKEY = "LKVw4C4kXg5PuVmsXk0iQZdIC4OIuanN";

const getCompleteURL = (query) => {
    return APIURL + query + "?api_key=" + APIKEY;
};

const getGifs = async (query) => {
    const configuration = {};

    const request = await fetch(getCompleteURL(query), configuration);
    const convertRequest = await request.json();
    return convertRequest;
};

const favoriteGif = (item) => {};

const fullScreenGif = (item) => {};

const downloadGif = (item) => {};
