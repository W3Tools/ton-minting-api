export const appConfig = {
    global: {
        prefix: 'v1',
        port: process.env.PORT || 3000,
        debug: process.env.NODE_ENV === 'dev' ?? false,
    },
    swagger: {
        route: 'swagger',
        prefix: 'v1',
        title: 'Ton Minting Api Documentation',
        description: `Ton Nft Minting Platform`,
        version: '1.0',
    },
};
