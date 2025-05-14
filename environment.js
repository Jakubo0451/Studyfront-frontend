

const backendUrl = (() => {
    switch (process.env.NEXT_PUBLIC_BACKEND_ENV) {
        case 'development':
            return 'http://localhost:5000';
        case 'production':
            return 'https://group5-api.sustainability.it.ntnu.no';
        default:
            return 'https://group5-api.sustainability.it.ntnu.no';
    }
})();

console.log(`Environment: ${process.env.NEXT_PUBLIC_BACKEND_ENV}`);
console.log(`Using backend URL: ${backendUrl}`);

export default backendUrl;