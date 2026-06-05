import React from 'react'

const ContinueWIthGoogle = () => {
    return (
        <a
            href="/api/auth/google"
            role="button"
            aria-label="Continue with Google"
            className="inline-flex items-center gap-3 h-10 px-4 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:shadow-md active:translate-y-[0.5px] focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
            <span className="inline-flex w-4 h-4" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 11.6c1.9 0 3.6.7 4.9 1.9l3.6-3.6C29 7 26.2 6 23 6 14.9 6 7.9 10.9 4.3 18.1l4.2 3.3C9.7 14.2 15.8 11.6 23 11.6z" fill="#EA4335"/>
                    <path d="M46 23c0-1.5-.1-2.8-.4-4H23v8.4h12.6c-.5 2.8-2.3 5.1-4.8 6.7l3.7 2.9C42.7 34.1 46 29 46 23z" fill="#34A853"/>
                    <path d="M9.5 28.4A13.7 13.7 0 0 1 9 23c0-1.6.3-3.1.8-4.4L5.6 15.3C3.4 19.1 2 23.4 2 28c0 4.6 1.2 8.9 3.4 12.6l4.1-3.9z" fill="#4A90E2"/>
                    <path d="M23 46c6 0 11-2 14.6-5.4l-7-5.7C27.9 36.7 25.6 37.6 23 37.6 15.8 37.6 9.7 35 6.6 30.9l-4.2 3.3C7.9 40.9 14.9 46 23 46z" fill="#FBBC05"/>
                </svg>
            </span>
            <span className="leading-none">Continue with Google</span>
        </a>
    )
}

export default ContinueWIthGoogle