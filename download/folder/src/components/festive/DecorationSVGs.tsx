import React from 'react';

export const Bauble = ({ color = '#C70039' }) => (
    <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" width="10" height="8" rx="2" fill="#D4AF37"/>
        <circle cx="30" cy="38" r="28" fill={color}/>
        <circle cx="30" cy="38" r="28" fill="url(#gloss)" />
        <defs>
            <radialGradient id="gloss" cx="0.3" cy="0.3" r="0.7">
                <stop stopColor="white" stopOpacity="0.6"/>
                <stop offset="1" stopColor={color} stopOpacity="0"/>
            </radialGradient>
        </defs>
    </svg>
);

export const Star = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="#FFC300" stroke="#F1B300" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
    </svg>
);

export const CandyCane = () => (
    <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <style>{`.st0{fill:none;stroke:#C70039;stroke-width:14;stroke-miterlimit:10;} .st1{fill:none;stroke:#FFFFFF;stroke-width:14;stroke-miterlimit:10;stroke-dasharray:20,20;}`}</style>
        <path className="st0" d="M29.2,89.5V40.1c0-12.7,10.3-23,23-23h0c12.7,0,23,10.3,23,23"/>
        <path className="st1" d="M29.2,89.5V40.1c0-12.7,10.3-23,23-23h0c12.7,0,23,10.3,23,23"/>
    </svg>
);

export const Snowflake = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2v20M12 12l-7.77-4.5M12 12l7.77-4.5M12 12l-7.77 4.5M12 12l7.77 4.5M4.23 7.5L2 12l2.23 4.5M19.77 7.5L22 12l-2.23 4.5"/>
    </svg>
);
