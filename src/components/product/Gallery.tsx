"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductMedia } from "../ui/ProductMedia";
import { cn } from "@/lib/utils";

export function Gallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  function go(dir: 1 | -1) {
    setIndex((i) => (i + dir + images.length) % images.length);
  }

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-[26px] sm:rounded-[28px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="absolute inset-0"
          >
            <ProductMedia tag={images[index]} className="h-full w-full" iconClassName="h-16 w-16" />
          </motion.div>
        </AnimatePresence>

        {/* dot indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full bg-white/70 transition-all",
                i === index ? "w-5 bg-white" : "w-1.5"
              )}
            />
          ))}
        </div>
      </div>

      {/* thumbnails */}
      <div className="mt-3 flex gap-2.5">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 transition-all",
              i === index ? "ring-honey" : "ring-transparent opacity-70"
            )}
          >
            <ProductMedia tag={img} className="h-full w-full" iconClassName="h-6 w-6" />
          </button>
        ))}
      </div>
    </div>
  );
}
