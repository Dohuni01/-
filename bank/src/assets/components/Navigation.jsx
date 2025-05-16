import React from "react";

function Navigation() {
    return (
        <div class="fixed left-0 right-0 bottom-0 w-full mx-auto bg-white border-t border-[#f3f3f3] flex justify-around py-2 z-20 ">
            <button class="flex flex-col items-center text-[12px] font-medium text-[#191919] hover:shadow-md ">
                <span class="text-[22px] mb-0.5">🏠 </span>
                홈
            </button>
            <button class="flex flex-col items-center text-[12px] font-medium text-[#bbb] relative hover:shadow-md ">
                <span class="text-[22px] mb-0.5">🎁<span class="absolute top-0 right-0 bg-[#ff3636] text-white text-[9px] rounded-full px-1 ml-1 -mt-2"></span></span>
                혜택
            </button>
            <button class="flex flex-col items-center text-[12px] font-medium text-[#bbb] hover:shadow-md">
                <span class="text-[22px] mb-0.5">💳</span>
                결제
            </button>
            <button class="flex flex-col items-center text-[12px] font-medium text-[#bbb] hover:shadow-md">
                <span class="text-[22px] mb-0.5">💰</span>
                자산
            </button>
            <button class="flex flex-col items-center text-[12px] font-medium text-[#bbb] hover:shadow-md">
                <span class="text-[22px] mb-0.5">💹</span>
                증권
            </button>
        </div>
    )
}

export default Navigation;