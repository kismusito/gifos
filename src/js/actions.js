import { APIKEY, APIURL } from "./config.js";

const getCompleteURL = (query) => {
    return APIURL + query + "api_key=" + APIKEY;
};

export const getGifs = async (query) => {
    const configuration = {};

    const request = await fetch(getCompleteURL(query), configuration);
    const convertRequest = await request.json();
    return convertRequest;
};

export const getSuggestionGifs = async (query) => {
    const request = await fetch(getCompleteURL(`tags/related/${query}?`));
    const convertRequest = await request.json();
    return convertRequest;
};

export const getTrendingGifs = async (totalSlides = 8) => {
    const request = await fetch(
        getCompleteURL(`gifs/trending?limit=${totalSlides}&`)
    );
    const convertRequest = await request.json();

    return convertRequest;
};

export const getTrendingSearchesGifs = async () => {
    const request = await fetch(
        getCompleteURL(`trending/searches?limit=5&`)
    );
    const convertRequest = await request.json();

    return convertRequest;
};
