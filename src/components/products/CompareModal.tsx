import React from 'react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { Modal } from '../ui/Modal';
import { PriceDisplay } from '../ui/PriceDisplay';
import { RatingStars } from '../ui/RatingStars';
import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompareModal: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, isCompareModalOpen, setIsCompareModalOpen } =
    useCompare();
  const { addToCart } = useCart();

  if (!isCompareModalOpen) return null;

  return (
    <Modal
      isOpen={isCompareModalOpen}
      onClose={() => setIsCompareModalOpen(false)}
      title="Smartphone Side-by-Side Comparison"
      maxWidth="4xl"
    >
      {compareList.length < 2 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-600 mb-4">
            Select at least 2 smartphones to compare their specifications side-by-side.
          </p>
          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
          >
            Browse Smartphones
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto text-xs">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 text-left font-bold text-slate-400 uppercase text-[11px] w-36 bg-slate-50/50">
                  Specification
                </th>
                {compareList.map((product) => (
                  <th key={product.id} className="p-3 text-center min-w-[200px] align-top">
                    <div className="relative flex flex-col items-center">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-rose-500 rounded-full bg-slate-100"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 object-contain mb-2"
                      />
                      <Link
                        to={`/products/${product.slug}`}
                        onClick={() => setIsCompareModalOpen(false)}
                        className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1 mb-1"
                      >
                        {product.name}
                      </Link>
                      <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="sm" />
                      <div className="mt-1">
                        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                      </div>
                      <button
                        onClick={() => {
                          addToCart(
                            product,
                            product.availableColours[0],
                            product.storageOptions[0],
                            product.ramOptions[0],
                            1
                          );
                        }}
                        className="mt-3 w-full py-1.5 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Brand</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-center font-bold text-slate-800">
                    {p.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Processor</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">
                    {p.processor}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Display</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">
                    {p.specifications.display}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Cameras</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">
                    {p.cameraSpecification}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Battery &amp; Charging</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">
                    {p.batteryCapacity} ({p.specifications.charging})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">RAM &amp; Storage</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">
                    {p.ramOptions.join('/')} RAM · {p.storageOptions.join('/')} ROM
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">OS Version</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-center text-slate-700">
                    {p.operatingSystem}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};
