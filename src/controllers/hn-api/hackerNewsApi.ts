import axios from 'axios';
import { Item } from './hackerNewsItem';
import { RawItem } from './hackerNewsItemRaw';

// List of API URLs
const URL = {
    'newStories': 'https://hacker-news.firebaseio.com/v0/newstories.json', // @todo?
    'item': 'https://hacker-news.firebaseio.com/v0/item/ITEM_ID.json'
}

/**
 * Convert unix timestamp to ISO String time
 * @param {number} time Unix timestamp
 * @returns {string} ISO String
 */
function unixTimeToISO (time: number) : string {
    return new Date(time * 1000).toISOString();
}

/**
 * Get single item (story) API URL
 * @param {string} itemId ID of the item (story/comment)
 * @returns {string} URL
 */
function getItemURL (itemId: string) : string {
    return URL.item.replace('ITEM_ID', itemId);
}

/**
 * Get the item JSON data from URL
 * @param {string} url endpoint of the API
 * @returns {object|boolean} Item data
 */
async function getItemJSON (url: string) : Promise<RawItem|undefined> {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        // @todo log
        return;
    }
}

/**
 * Populate an <Item>
 * @param {object} itemData data received from HN API
 * @returns {object} Item
 */
function populateItem({itemData}: {itemData: RawItem}) : Item {
    const timestamp = itemData.time ? unixTimeToISO(itemData.time) : undefined;

    return {
        id: itemData.id,
        type: itemData.type,
        author: itemData.by,
        title: itemData.title,
        url: itemData.url,
        text: itemData.text,
        timestamp: timestamp,
        parentId: itemData.parent,
        childrenIds: itemData.kids
    };
}

/**
 * Get single HN item by its ID
 * @param {string} id ID of the item (story/comment)
 * @returns {object|boolean} Item
 */
export async function getItemById (id: string) : Promise<Item|undefined> {
    try {
        const itemData = await getItemJSON(getItemURL(id));
        if (!itemData) {
            return;
        }

        return populateItem({itemData});
    } catch (error) {
        // @todo log
        return;
    }
}