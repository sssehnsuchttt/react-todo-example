module.exports = {
    transform: {
        "^.+\\.[tj]sx?$": "babel-jest", 
        "^.+\\.mjs$": "jest-esm-transformer"
    },
    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy"
    }
};
