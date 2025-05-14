const backendUrl = (() => {
    switch (process.env.BACKENDUrl) {
        case 'development':
            return 'http://localhost:5000';
        case 'production':
            return 'https://group5-api.sustainability.it.ntnu.no';
        default:
            return 'http://localhost:5000';
    }
})();

export default backendUrl;