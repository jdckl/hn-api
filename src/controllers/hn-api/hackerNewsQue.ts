import * as fastq from 'fastq';
import type { queueAsPromised } from "fastq";

import Comment from '../../models/Comments';
import {getItemById} from './hackerNewsApi';

// Argument schema
type DownloadCommentTask = {
    storyId: number;
    commentId: number;
}

// Promise FastQ, with 2 tasks in parallel
export const CommentQue:queueAsPromised<DownloadCommentTask> = fastq.promise(downloadWorker, 2)

/**
 * Download worker for downloading comment data asynchronously without blocking a request
 * 
 * @param {DownloadCommentTask} arg 
 */
async function downloadWorker (arg: DownloadCommentTask) : Promise<void> {
    const {storyId, commentId} = arg;
    const itemDoc = await getItemById(commentId);

    if (itemDoc) {
        const commentDoc = Comment.build({
            itemId: commentId,
            storyId: storyId,
            text: itemDoc.text ? itemDoc.text : '',
            author: itemDoc.author ? itemDoc.author: '',
            commentedOn: itemDoc.timestamp ? new Date(itemDoc.timestamp * 1000).toISOString() : new Date().toISOString()
        })

        try {
            await commentDoc.save();
        } catch (err) {
            console.log(err)
        }
    }
}