// electron.d.ts
export {};

declare global {
    interface Window {
        electronAPI: {
            createFile: (fileName: string, content: string) => Promise<string>;
            readFile: (fileName: string) => Promise<string>;
            deleteFile: (fileName: string) => Promise<string>;
        };
    }
}
