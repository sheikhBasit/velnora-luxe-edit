import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { X, Plus, Minus, Trash2, ExternalLink } from "lucide-react";

export function CartDrawer() {
  const {
    cartItems,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      return acc + (isNaN(numericPrice) ? 0 : numericPrice) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Securely open each product's affiliate tracking link in a new browser tab
    cartItems.forEach((item) => {
      window.open(item.amazonUrl, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        className="w-full sm:max-w-md bg-background border-l border-border/80 flex flex-col p-0 h-full justify-between"
        style={{ backgroundColor: "var(--background)" }}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-border/40 flex justify-between items-center">
          <SheetHeader className="text-left space-y-0">
            <SheetTitle className="font-serif text-2xl text-foreground tracking-wide">
              Shopping Bag
            </SheetTitle>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
              {cartItems.length} {cartItems.length === 1 ? "Object" : "Objects"}
            </p>
          </SheetHeader>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 text-foreground transition hover:bg-foreground hover:text-background cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <p className="font-serif text-lg text-muted-foreground italic">
                Your shopping bag is empty.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 text-xs uppercase tracking-[0.2em] text-foreground border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition"
              >
                Continue Curation
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-start py-4 border-b border-border/20 last:border-none"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 overflow-hidden rounded-sm bg-muted shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-serif text-sm text-foreground truncate">
                        {item.name}
                      </h4>
                      <span className="font-sans text-sm text-foreground whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
                      {item.note}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-foreground/10 rounded-full h-8 px-1 bg-secondary/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="h-6 w-6 flex items-center justify-center rounded-full text-foreground hover:bg-background transition cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-sans text-xs px-3 text-foreground min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="h-6 w-6 flex items-center justify-center rounded-full text-foreground hover:bg-background transition cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* External retail link & Trash buttons */}
                      <div className="flex items-center gap-3">
                        <a
                          href={item.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          title="Open affiliate retailer page directly"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-foreground transition hover:bg-foreground hover:text-background cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from bag`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition hover:border-destructive hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-6 border-t border-border/40 bg-secondary/20">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Subtotal
              </span>
              <span className="font-serif text-2xl text-foreground">
                ${calculateSubtotal().toFixed(0)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="pill-btn w-full bg-black text-white hover:bg-neutral-900 justify-center transition flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium h-12"
              style={{ backgroundColor: "#000000", color: "#ffffff", borderColor: "#000000" }}
            >
              Proceed to Retailer <ExternalLink className="h-4 w-4" />
            </button>

            <p className="mt-4 text-[9px] text-muted-foreground text-center leading-relaxed">
              Clicking "Proceed to Retailer" opens each product's Amazon checkout in a new browser tab.
              As an Amazon Associate, Velnora earns from qualifying purchases.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
