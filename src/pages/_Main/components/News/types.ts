export enum PostType {
    Medium = 'Medium',
    Youtube = 'Youtube',
    Twitter = 'Twitter',
}

export enum TagColor {
    Blue = 'Blue',
    Violet = 'Violet',
}

export type Post = {
    type: PostType;
    title: string;
    description?: string;
    link: string;
    blankLink?: boolean;
    // tag: {
    //     text: string;
    //     color: string;
    // };
    // backgroundPath: string;
}
