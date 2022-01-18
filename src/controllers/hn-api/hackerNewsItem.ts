export interface RawItem {
    readonly id: number;
    readonly type: "story" | "comment";
    readonly by?: string;
    readonly title?: string;
    readonly url?: string;
    readonly text?: string;
    readonly time?: number;
    readonly parent: number;
    readonly kids: number[];
}
export interface Item {
    readonly id: number;
    readonly type: "story" | "comment";
    readonly author?: string;
    readonly title?: string;
    readonly url?: string;
    readonly text?: string;
    readonly timestamp?: number;
    readonly parentId: number;
    readonly childrenIds: number[];
}