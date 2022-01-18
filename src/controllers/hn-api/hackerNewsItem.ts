export interface Item {
    readonly id: number;
    readonly type: "story" | "comment";
    readonly author?: string;
    readonly title?: string;
    readonly url?: string;
    readonly text?: string;
    readonly timestamp?: string;
    readonly parentId: number;
    readonly childrenIds: number[];
}