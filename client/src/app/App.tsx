import { PixelBox } from "../shared/ui";
import { ItemList } from "../widgets/item-list/ItemList";

export function App() {
  return (
    <div className="h-screen flex flex-col p-6 gap-4">
      <header className="flex items-baseline justify-between">
        <h1 className="font-pixel text-sm text-pixel-accent pixel-cursor">
          {"> 1 M ITEMS"}
        </h1>
        <span className="font-pixel text-[9px] text-pixel-text-dim">
          drag 
        </span>
      </header>

      <main className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <PixelBox className="flex flex-col min-h-0">
         <ItemList side="left" filter="" />
        </PixelBox>

        <PixelBox className="flex flex-col min-h-0">
         <ItemList side="right" filter="" />
        </PixelBox>
      </main>
    </div>
  );
}