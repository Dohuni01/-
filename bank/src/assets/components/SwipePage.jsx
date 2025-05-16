// src/components/SwipePage.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

// 순서대로 연결된 페이지 경로
const PAGE_ORDER = ["/", "/money", "/benefit", "/charge", "/pay"];

export default function SwipePage({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const idx = PAGE_ORDER.indexOf(location.pathname);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (idx < PAGE_ORDER.length - 1) navigate(PAGE_ORDER[idx + 1]);
    },
    onSwipedRight: () => {
      if (idx > 0) navigate(PAGE_ORDER[idx - 1]);
    },
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div {...swipeHandlers} className="min-h-screen">
      {children}
    </div>
  );
}
