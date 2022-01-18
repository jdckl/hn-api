import axios from 'axios';
import { Item, RawItem } from './hackerNewsItem';

// List of API URLs
const URL = {
    'newStories': 'https://hacker-news.firebaseio.com/v0/newstories.json', // @todo?
    'item': 'https://hacker-news.firebaseio.com/v0/item/ITEM_ID.json'
}

/**
 * Get single item (story) API URL
 * @param {string} itemId ID of the item (story/comment)
 * @returns {string} URL
 */
function getItemURL (itemId: number) : string {
    return URL.item.replace('ITEM_ID', String(itemId));
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
    const timestamp = itemData.time ? itemData.time : Math.floor(Date.now() / 1000);

    return {
        id: itemData.id,
        type: itemData.type,
        author: itemData.by,
        title: itemData.title,
        url: itemData.url,
        text: itemData.text ? itemData.text.replace(/<\/?[^>]+(>|$)/g, "") : '',
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
export async function getItemById (id: number) : Promise<Item|undefined> {
    try {
        const itemData = await getItemJSON(getItemURL(id));
        if (!itemData || (itemData && !['story', 'comment'].includes(itemData.type))) {
            return;
        }

        return populateItem({itemData});
    } catch (error) {
        // @todo log
        return;
    }
}