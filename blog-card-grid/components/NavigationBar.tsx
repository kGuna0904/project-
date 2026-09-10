'use client';

import Link from "next/link";
 
//nav bar for the webpage 
export default function NavigationBar() {
    return (
        <nav className="bg-gray-700 p-4 shadow-md ">
            
            <div className=" flex  my-auto mx-auto my-auto gap-8  ">
                <img src="/blog-preview-card-main/assets/images/favicon.ico" alt="Logo" className="h-10 w-10 mr-2 ml-2 self-start transition-transform duration-400 hover:scale-[1.5]" />  
                <div className="self-center scroll-smooth">
                    <Link href="#card-grid" className="inline-block text-white font-bold aria-selected:text-yellow-400 aria-selected:border-yellow-400 mx-5 hover:text-yellow-400 transition-transform duration-600 hover:scale-[1.2]">Tool Cards</Link>
                    <Link href="#ascii-card" className="inline-block text-white font-bold aria-selected:text-yellow-400 aria-selected:border-yellow-400 mx-5 hover:text-yellow-400 transition-transform duration-600 hover:scale-[1.2]">Ascii Camera</Link>
                    <Link href="#newsletter-card" className="inline-block text-white font-bold aria-selected:text-yellow-400 aria-selected:border-yellow-400 mx-5 hover:text-yellow-400 transition-transform duration-600 hover:scale-[1.2]">Newsletter</Link>
                    <Link href="#donation-card" className="inline-block text-white font-bold aria-selected:text-yellow-400 aria-selected:border-yellow-400 mx-5 hover:text-yellow-400 transition-transform duration-600 hover:scale-[1.2]">Donate</Link>
                </div>

            </div>

        </nav>
    );
}