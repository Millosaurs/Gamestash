"use client";
import { useEffect, useState } from "react";

export default function LastUpdated() {
  const [now, setNow] = useState("");

  useEffect(() => {
    setNow(new Date().toLocaleString());
  }, []);

  return <span>Last updated: {now}</span>;
}
