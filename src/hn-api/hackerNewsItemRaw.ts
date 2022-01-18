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