'use client';

export default function Loading() {
    return (
    <div>
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="loadingText">Loading...</h1>
            <div className="loader"></div>
        </div>
        <style jsx>{`
            .loader {
                border: 8px solid var(--color-sky-blue); /* Light grey */
                border-top: 8px solid var(--color-petrol-blue);
                border-radius: 50%;
                width: 60px;
                height: 60px;
                animation: spin 2s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loadingText {
                font-size: 2rem;
                margin-bottom: 2rem;
            }
        `}</style>
    </div>
    );
}