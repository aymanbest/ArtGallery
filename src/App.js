import React, {
  useState,
  useLayoutEffect,
  useRef
} from "react";
 import slides from "./Data";
 import useKeyboardAndWheel from "./useKeyboardAndWheel";


function getRect(el) {
  return el.getBoundingClientRect();
}

function flip(firstRect, el) {
  requestAnimationFrame(() => {
    const lastEl = el;
    const lastRect = getRect(lastEl);
    const dx = lastRect.x - firstRect.x;
    const dy = lastRect.y - firstRect.y;
    const dw = lastRect.width / firstRect.width;
    const dh = lastRect.height / firstRect.height;
    lastEl.dataset.flipping = true;
    lastEl.style.setProperty("--dx", dx);
    lastEl.style.setProperty("--dy", dy);
    lastEl.style.setProperty("--dw", dw);
    lastEl.style.setProperty("--dh", dh);
    requestAnimationFrame(() => delete lastEl.dataset.flipping);
  });
}

function useFlip(ref) {
  const rectRef = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) {
      if (!rectRef.current) {
        rectRef.current = getRect(ref.current);
      }
      flip(rectRef.current, ref.current);
      rectRef.current = getRect(ref.current);
    }
  });
}


/* ---------------------------------- */

function ImageTitle(props) {
  const ref = useRef(null);
  useFlip(ref);

  return <span {...props} ref={ref} data-flip className="title" />;
}

function Image({ src, title, selected, date, ...props }) {
  const ref = useRef(null);
  useFlip(ref);

  return (
    <div
      {...props}
      className="image"
      key={src}
      data-selected={selected || undefined}
    >
      <img data-flip src={src} ref={ref} alt={title} />
      <ImageTitle>
        <strong>{title}</strong> {date}
      </ImageTitle>
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState(0);

  useKeyboardAndWheel(
    (event) => {
      switch (event.key) {
        case "ArrowRight":
          setSelected((selected) => (selected + 1) % slides.length);
          break;
        case "ArrowLeft":
          setSelected(
            (selected) => (slides.length + (selected - 1)) % slides.length
          );
          break;
        default:
          break;
      }
    },
    (event) => {
      if (event.deltaY > 0) {
        // Swipe down
        setSelected((selected) => (selected + 1) % slides.length);
      } else if (event.deltaY < 0) {
        // Swipe up
        setSelected(
          (selected) => (slides.length + (selected - 1)) % slides.length
        );
      }
    }
  );

  return (
    <div className="app">
      <h1>@Art Gallery</h1>
      <div className="gallery">
        {slides.map((slide, index) => {
          return (
            <Image
              src={slide.image}
              title={slide.title}
              date={slide.date}
              selected={index === selected}
              key={index}
              onClick={() => setSelected(index)}
            />
          );
        })}
      </div>
      <div className="content">
      <p>
      You can press <kbd>←</kbd> <kbd>→</kbd> on your keyboard or swipe up/down to navigate. Mouse wheel works too.</p>
      </div>
    </div>
  );
}

export default App;