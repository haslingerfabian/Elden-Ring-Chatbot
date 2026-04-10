import { useEffect, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

type Props = {
  data: Slide[];
  align?: "left" | "right";
};

function SlideshowCard({ data, align = "left" }: Props) {
  const [index, setIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % data.length;
      setVisibleIndex(nextIndex);
      setIsFading(true);

      setTimeout(() => {
        setIndex(nextIndex);
        setIsFading(false);
      }, 450);
    }, 20000);

    return () => clearInterval(interval);
  }, [index, data.length]);

  const current = data[index];
  const next = data[visibleIndex];

  return (
    <aside className={`slideshow-card ${align}`}>
      <div
        className={`slideshow-image base ${isFading ? "fade-out" : "visible"}`}
        style={{ backgroundImage: `url(${current.image})` }}
      />
      <div
        className={`slideshow-image overlay ${isFading ? "fade-in" : "hidden"}`}
        style={{ backgroundImage: `url(${next.image})` }}
      />
      <div className="slideshow-overlay">
        <span className="slideshow-subtitle">
          {isFading ? next.subtitle : current.subtitle}
        </span>
        <h2>{isFading ? next.title : current.title}</h2>
        <p>{isFading ? next.description : current.description}</p>
      </div>
    </aside>
  );
}

export default SlideshowCard;