import { useSiteSettings } from '@/hooks/useSiteSettings';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ruler } from 'lucide-react';

interface SizeGuideProps {
  category?: string;
}

const defaultClothingSizes = [
  { size: 'S', chest: '36-38', waist: '28-30', hips: '36-38' },
  { size: 'M', chest: '38-40', waist: '30-32', hips: '38-40' },
  { size: 'L', chest: '40-42', waist: '32-34', hips: '40-42' },
  { size: 'XL', chest: '42-44', waist: '34-36', hips: '42-44' },
  { size: 'XXL', chest: '44-46', waist: '36-38', hips: '44-46' },
];

const defaultShoeSizes = [
  { size: '38', eu: '38', uk: '5', us: '6', cm: '24' },
  { size: '39', eu: '39', uk: '6', us: '7', cm: '24.5' },
  { size: '40', eu: '40', uk: '6.5', us: '7.5', cm: '25' },
  { size: '41', eu: '41', uk: '7', us: '8', cm: '25.5' },
  { size: '42', eu: '42', uk: '8', us: '9', cm: '26' },
  { size: '43', eu: '43', uk: '9', us: '10', cm: '27' },
  { size: '44', eu: '44', uk: '9.5', us: '10.5', cm: '27.5' },
  { size: '45', eu: '45', uk: '10.5', us: '11.5', cm: '28' },
];

export function SizeGuide({ category }: SizeGuideProps) {
  const { data: settings } = useSiteSettings();
  
  const isShoe = category === 'shoes';
  const sizeGuide = isShoe 
    ? (settings?.size_guide_shoes || defaultShoeSizes)
    : (settings?.size_guide_clothing || defaultClothingSizes);
  const sizeGuideNote = settings?.size_guide_note || 'All measurements are in inches. For the best fit, we recommend taking your measurements and comparing them with our size chart. If you are between sizes, we suggest sizing up.';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-accent p-0 h-auto text-sm gap-1.5">
          <Ruler className="w-4 h-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {isShoe ? 'Shoe Size Guide' : 'Clothing Size Guide'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {isShoe ? (
                    <>
                      <th className="py-3 px-3 text-left font-semibold">Size</th>
                      <th className="py-3 px-3 text-left font-semibold">EU</th>
                      <th className="py-3 px-3 text-left font-semibold">UK</th>
                      <th className="py-3 px-3 text-left font-semibold">US</th>
                      <th className="py-3 px-3 text-left font-semibold">CM</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-3 text-left font-semibold">Size</th>
                      <th className="py-3 px-3 text-left font-semibold">Chest</th>
                      <th className="py-3 px-3 text-left font-semibold">Waist</th>
                      <th className="py-3 px-3 text-left font-semibold">Hips</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {sizeGuide.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/50">
                    {isShoe ? (
                      <>
                        <td className="py-3 px-3 font-medium">{row.size}</td>
                        <td className="py-3 px-3">{row.eu}</td>
                        <td className="py-3 px-3">{row.uk}</td>
                        <td className="py-3 px-3">{row.us}</td>
                        <td className="py-3 px-3">{row.cm}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-3 font-medium">{row.size}</td>
                        <td className="py-3 px-3">{row.chest}</td>
                        <td className="py-3 px-3">{row.waist}</td>
                        <td className="py-3 px-3">{row.hips}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4">{sizeGuideNote}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
